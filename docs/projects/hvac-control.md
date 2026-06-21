---
sidebar_position: 3
title: 공조기 자동제어 및 모니터링
sidebar_label: 공조기 자동제어
---

# 공조기 자동제어 및 모니터링

**2024.08 – 2025.12 · ㈜TSM Technology · 과장 · FE 개발 · AWS 서버 구축**

:::info 개요
AWS IoT Core 기반 공조기 장비 원격 제어 및 실시간 모니터링 시스템.
MQTT·WebSocket 기반 제어 흐름 정리로 제어 응답 지연 40% 감소.
CloudWatch Alarm 연동으로 장애 대응 체계 확보.
:::

## 기술 스택

`React` `Node.js` `TypeScript` `Redux` `SSE` `WebSocket` `AWS IoT Core` `Lambda` `DynamoDB` `S3` `Athena`

---

## 성과 요약

| 발견 항목 | 문제 | 개선 방향 | 결과 |
|---|---|---|---|
| 제어 응답 지연 | 동일 메시지 중복 전달로 Lambda 중복 처리 | 메시지 ID 기반 멱등성 검증 | **23초 → 1초 이내** |
| 소켓 연결 분산 | 화면마다 소켓 생성으로 연결 관리 복잡도 증가 | 공통 소켓 모듈로 통합 | 소켓 생성 지점 **3→1개 (66.7% 감소)** |
| 메시지 리스너 cleanup 미적용 | `removeAllListeners` 강제 제거로 상태 갱신 누락 위험 | 화면 등록 리스너만 정확히 제거 | cleanup 적용률 **0%→100%** |
| MQTT 브로드캐스트 구조 | 클라이언트 연결 시마다 리스너 재등록 | 서버에서 한 번 수신 후 전체 브로드캐스트 | `removeAllListeners` 사용 **4→0개** |
| 메시지 수신 안정성 | DB 저장 리스너를 60초 루프 내 재등록 | 루프 밖 한 번만 등록 | 수신 성공률 **14.67%→100%**, 누락률 **0%** |
| 화면 전환 소켓 준비 | 화면 전환 시마다 소켓 재연결로 상태 갱신 지연 | 공통 소켓 인스턴스 재사용 | 준비 시간 **0.706ms→0ms** |

---

## AI Agent

AI를 활용해 Socket.IO + MQTT 기반 실시간 장비 상태 갱신 구조를 정적 분석하고, 소켓 연결 분산·메시지 리스너 cleanup 미적용·MQTT 브로드캐스트 구조·DB 저장 리스너 위치 등 4가지 구조적 문제를 발굴하고 개선했습니다.

### 1. 소켓 생성 지점 통합

화면마다 직접 Socket.IO 연결을 생성하던 구조를 공통 소켓 모듈로 통합했습니다.

```js title="Before"
socket = io('http://localhost:5000');

socket.on('connect', () => {});

return () => {
  socket.disconnect();
};
```

```js title="After"
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

let socket;

export const getSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL);
    socket.on('connect', () => {});
  }

  return socket;
};
```

### 2. 메시지 리스너 cleanup 적용

전체 리스너를 강제 제거하던 방식에서 화면에서 등록한 리스너만 정확히 제거하도록 변경했습니다.

```js title="Before"
socket.removeAllListeners('message');

socket.on('message', (data) => {
  const parsedData = JSON.parse(data);
  setDeviceData(parsedData);
});
```

```js title="After"
const handleMessage = (data) => {
  const parsedData = JSON.parse(data);

  if (parsedData.machineID === selectedZone.id) {
    setDeviceData(() => ({ ...parsedData }));
  }
};

socket.on('message', handleMessage);

return () => {
  clearInterval(intervalId);
  socket.off('message', handleMessage);
};
```

### 3. MQTT 브로드캐스트 구조 개선

클라이언트 연결 시마다 MQTT 리스너를 재등록하던 구조를 서버에서 한 번 수신 후 전체 브로드캐스트하도록 변경했습니다.

```js title="Before"
mqtt.removeAllListeners('message');

mqtt.on('message', (topic, message) => {
  socket.emit('message', message.toString());
});
```

```js title="After"
export const messageProcess = (io, mqtt) => {
  mqtt.on('message', (topic, message) => {
    io.emit('message', message.toString());
  });

  io.on('connection', (socket) => {});
};
```

### 4. DB 저장 리스너 위치 개선

60초 주기 루프 내부에서 MQTT 리스너를 재등록하던 구조를 루프 밖에서 한 번만 등록하도록 변경했습니다.

```js title="Before"
setInterval(() => {
  mqtt.removeAllListeners('message');

  mqtt.on('message', (topic, message) => {
    const parsedMessage = JSON.parse(message);
    // DynamoDB 저장
  });
}, 60000);
```

```js title="After"
const saveStatus = (topic, message) => {
  const parsedMessage = JSON.parse(message);
  const { machineID, status: { power, operation, air, auto } } = parsedMessage;

  const param = {
    TableName: 'device_status',
    Item: { DeviceID: machineID, Time: getCurrentDate(), power, operation, auto, air },
  };

  dynamoDB.put(param, (err) => {
    if (err) console.log('저장 오류');
  });
};

mqtt.on('message', saveStatus);
```

