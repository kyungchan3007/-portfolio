---
sidebar_position: 2
title: AWS IoT 제어 흐름
sidebar_label: AWS IoT 제어 흐름
---

# AWS IoT Core 기반 원격 제어 시스템



---

현장 장비를 웹에서 원격 제어하는 시스템.
MQTT 프로토콜로 장비와 통신하고, AWS IoT Core → Lambda → WebSocket으로 상태를 실시간 반영합니다.

---

## 전체 아키텍처

```mermaid
graph LR
    FE[프론트엔드\nReact]
    WS[WebSocket\nServer]
    IoT[AWS IoT Core]
    Lambda[AWS Lambda]
    DDB[DynamoDB]
    Device[현장 장비]
    S3[S3]
    Athena[Athena]

    FE -->|제어 명령| WS
    WS -->|MQTT Publish| IoT
    IoT -->|Rule Action| Lambda
    Lambda -->|멱등성 검증\n상태 저장| DDB
    Lambda -->|상태 전파| WS
    WS -->|실시간 반영| FE
    Device -->|MQTT 상태 보고| IoT
    Lambda -->|로그 적재| S3
    S3 -->|SQL 분석| Athena
```

---

## 제어 흐름 단계별 설명

### 1단계 — 프론트엔드: 제어 명령 전송

```ts title="domainAApi.ts"
import { v4 as uuidv4 } from 'uuid';

interface DomainACommand {
  entityId: string;
  operation: 'start' | 'stop' | 'update';
  payload?: Record<string, unknown>;
}

export async function sendDomainACommand(command: DomainACommand) {
  const messageId = uuidv4(); // 멱등성 키 생성

  return wsClient.send({
    type: 'DOMAIN_A_COMMAND',
    messageId,              // Lambda에서 중복 검증에 사용
    timestamp: Date.now(),
    ...command,
  });
}
```

### 2단계 — AWS IoT Core Rule

MQTT 토픽 패턴을 기준으로 AWS IoT Core Rule을 구성하고, Rule Action으로 Lambda를 실행했습니다.

### 3단계 — Lambda: 멱등성 검증 + 상태 처리

```ts title="domainAHandler.ts"
import { DynamoDBClient, GetItemCommand, PutItemCommand } from '@aws-sdk/client-dynamodb';

const db = new DynamoDBClient({ region: 'ap-northeast-2' });

export async function handler(event: IoTEvent) {
  const { messageId, entityId, operation, payload } = event;

  // 멱등성 검증 — 이미 처리한 messageId 확인
  const existing = await db.send(new GetItemCommand({
    TableName: 'domain-a-idempotency',
    Key: { messageId: { S: messageId } },
  }));

  if (existing.Item) {
    console.log(`중복 메시지 스킵: ${messageId}`);
    return { statusCode: 200, body: 'duplicate' };
  }

  // 신규 메시지 처리
  await db.send(new PutItemCommand({
    TableName: 'domain-a-idempotency',
    Item: {
      messageId: { S: messageId },
      entityId: { S: entityId },
      operation: { S: operation },
      processedAt: { S: new Date().toISOString() },
      ttl: { N: String(Math.floor(Date.now() / 1000) + 86400) }, // 24시간 TTL
    },
  }));

  // 장비 상태 업데이트 및 WebSocket 전파
  await updateDomainAState(entityId, operation, payload);
  await broadcastToClients(entityId, { operation, status: 'applied' });

  return { statusCode: 200, body: 'processed' };
}
```

### 4단계 — 프론트엔드: WebSocket 상태 동기화

```ts title="useDomainASync.ts"
export function useDomainASync(entityId: string) {
  const dispatch = useDispatch();
  const processedIds = useRef(new Set<string>());

  useEffect(() => {
    const unsubscribe = wsClient.subscribe(
      `domain-a:${entityId}`,
      (message: DomainAMessage) => {
        // 프론트 중복 렌더링 방지
        if (processedIds.current.has(message.messageId)) return;
        processedIds.current.add(message.messageId);

        dispatch(applyDomainAState({
          entityId: message.entityId,
          status: message.status,
          operation: message.operation,
        }));
      }
    );

    return unsubscribe;
  }, [entityId, dispatch]);
}
```

---

## CloudWatch Alarm 설정

```yaml title="cloudwatch-alarms.yaml"
DomainALambdaErrorAlarm:
  Type: AWS::CloudWatch::Alarm
  Properties:
    AlarmName: domain-a-lambda-errors
    MetricName: Errors
    Namespace: AWS/Lambda
    Statistic: Sum
    Period: 60
    EvaluationPeriods: 1
    Threshold: 5
    ComparisonOperator: GreaterThanOrEqualToThreshold
    AlarmActions:
      - !Ref AlertSNSTopic  # SNS → 슬랙 알림

DomainALambdaDurationAlarm:
  Type: AWS::CloudWatch::Alarm
  Properties:
    AlarmName: domain-a-lambda-duration
    MetricName: Duration
    Namespace: AWS/Lambda
    Statistic: Average
    Period: 60
    EvaluationPeriods: 3
    Threshold: 5000          # 5초 초과 시 알림
    ComparisonOperator: GreaterThanOrEqualToThreshold
    AlarmActions:
      - !Ref AlertSNSTopic
```

---

- 제어 응답 지연 23초 → **1초 이내**
- 중복 메시지 처리 제거로 DB 비용 절감
- CloudWatch Alarm으로 장애 즉시 감지 체계 확보
