---
sidebar_position: 2
title: BEMS
sidebar_label: BEMS
---

# ⚡ BEMS

**2023.08 – 2025.08 · ㈜TSM Technology · 과장 · FE 개발 · 팀 리딩**

운영 지표 데이터 실시간 수집·시각화 및 계층형 데이터 조회·집계 분석 시스템.
<br/>클라이언트 요구사항 회의·일정 조율과 팀 리딩·직접 개발을 병행했습니다.

## 기술 스택

`React` `TypeScript` `Redux` `Web Worker` `react-query` `Styled-components` `Sonar`

---

## 성과 요약

| 발견 항목 | 문제 | 개선 방향 | 결과 |
|---|---|---|---|
| 데이터 조회 구조 | 15분 주기 폴링으로 실시간 반영 불가 | 1분 단위 delta 업데이트 구조로 전환 | 네트워크 요청 **60% 감소** |
| 메인 스레드 부하 | 4,400개 데이터 비교·갱신 시 UI 블로킹 | Web Worker로 비교·검증 연산 분리 | 화면 반영 지연 **3~5초 → 1초 이내** |
| 데이터 정합성 | null·부분 응답 환경에서 데이터 오염 가능성 | JSON 규칙 기반 보정 수식 분리 | 프론트 레이어 동적 계산으로 정합성 확보 |
| 성능 측정 체계 | 개선 효과를 정량적으로 판단할 기준 없음 | performance.now() + rAF 기반 측정 체계 구축 | 개선 전후 수치 검증 |

---

## 팀 리딩 — 요구사항과 검증을 문서화로 돌파하다

BEMS는 기획을 제외한 서비스 설계, 클라이언트 커뮤니케이션, 기능 구현, 일정 관리까지 전 과정을 주도적으로 수행한 프로젝트였습니다.

프로젝트를 진행하며 가장 큰 과제는 지속적으로 변화하는 요구사항을 관리하는 일이었습니다. 기능 개발과 검증이 완료된 이후에도 기능 변경이나 추가 요청이 발생했고, 동일한 기능에 대한 설명과 검증 과정이 반복되면서 커뮤니케이션 비용이 점차 증가했습니다.

이를 해결하기 위해 요구사항 문서화를 도입했습니다. 기능 개발 단계마다 "요청 사항", "이해한 요구사항", "구현 범위", "결과물"을 문서로 정리하여 개발 완료 시점에 클라이언트와 공유했고, 이를 기준으로 검증과 추가 논의를 진행했습니다. 이후 요구사항 변경 이력과 의사결정 과정이 명확하게 관리되면서 커뮤니케이션 비용을 크게 줄일 수 있었습니다.

BEMS는 사용자가 실시간 에너지 데이터를 기반으로 운영 비용과 의사결정을 수행하는 서비스였기 때문에 데이터 정합성과 계산 정확성이 무엇보다 중요했습니다. 구현 자체보다 검증 과정이 더 중요하다고 판단했고, 주요 계산 로직과 기능이 추가될 때마다 에너지 분야 전문가의 자문을 통해 결과를 검증했습니다. 검증 과정과 결과 역시 문서화하여 팀 전체가 동일한 기준을 공유할 수 있도록 했습니다.

또한 에너지 관리 도메인은 설비, 계측, 운영 방식 등 다양한 하위 도메인으로 구성되어 있었기 때문에 각 도메인별 마크다운 문서를 작성했습니다. 도메인의 목적과 동작 방식, 데이터 요청부터 화면 렌더링까지의 흐름을 정리하여 팀원들과 공유했고, 이를 통해 신규 기능 개발과 유지보수 과정에서 발생하는 이해 비용을 줄일 수 있었습니다.

프로젝트 후반 UAT 단계에서는 팀원별 구현 방식 차이로 인해 코드 수정과 리뷰 비용이 증가하는 문제가 발생했습니다. 이를 해결하기 위해 함수 작성 방식, 네이밍 규칙, Return 패턴, 코드 중복 방지 기준 등 SonarQube 기반의 개발 컨벤션 문서를 정리했고, 팀 전체가 동일한 기준으로 개발할 수 있는 환경을 구축했습니다.

결과적으로 BEMS 프로젝트에서는 기능 구현뿐만 아니라 요구사항 관리, 도메인 지식 축적, 개발 기준 수립을 문서화와 표준화를 통해 해결하며 프로젝트의 운영 안정성과 유지보수성을 높일 수 있었습니다.

---

## 1. 실시간 데이터 전환 및 네트워크 최적화

고객 요구사항 변경으로 기존 15분 주기 데이터 조회를 1분 단위 실시간 구조로 전환해야 했습니다.
전체 데이터를 매번 교체하는 방식 대신, 변경된 데이터만 추출해 전달하는 delta 업데이트 구조를 도입했습니다.

```ts title="deltaExtractor.ts"
// 이전 상태와 비교하여 변경된 항목만 추출
export function extractDelta(prev: DataMap, next: DataMap): DeltaEntry[] {
  const delta: DeltaEntry[] = [];

  for (const key of Object.keys(next)) {
    if (prev[key] !== next[key]) {
      delta.push({ key, value: next[key] });
    }
  }

  return delta;
}
```

**결과**: 전체 교체 대비 네트워크 요청 **60% 감소**, 변경 데이터만 화면에 반영

---

## 2. Web Worker 기반 렌더링 성능 개선

1분 단위로 수신되는 **4,400개 데이터**의 비교·캐싱 연산을 메인 스레드에서 처리하자 UI 블로킹이 발생하고 화면 반영이 3~5초 지연되었습니다.

비교·검증 연산 전체를 **Web Worker 백그라운드 스레드**로 분리하고, 변경된 항목만 순차적으로 메인 스레드에 전달하는 구조로 개선했습니다.

```ts title="dataWorker.ts (Worker 스레드)"
// 백그라운드에서 4,400개 데이터 비교 후 delta만 순차 전달
self.onmessage = (e: MessageEvent<WorkerPayload>) => {
  const { prev, next } = e.data;
  const delta: DeltaEntry[] = [];

  for (const key of Object.keys(next)) {
    if (prev[key] !== next[key]) {
      delta.push({ key, value: next[key] });
    }
  }

  // 변경 항목만 메인 스레드에 배달
  self.postMessage({ type: 'DELTA', payload: delta });
};
```

```ts title="useRealtimeData.ts (메인 스레드)"
// Worker 생성 및 delta 수신
const workerRef = useRef<Worker | null>(null);

useEffect(() => {
  workerRef.current = new Worker(
    new URL('./dataWorker.ts', import.meta.url),
    { type: 'module' }
  );

  workerRef.current.onmessage = (e: MessageEvent<WorkerResponse>) => {
    if (e.data.type === 'DELTA') {
      // delta 항목만 순차 반영
      dispatch(applyDelta(e.data.payload));
    }
  };

  return () => {
    workerRef.current?.terminate();
  };
}, []);

const handleNewData = (next: DataMap) => {
  workerRef.current?.postMessage({ prev: prevDataRef.current, next });
  prevDataRef.current = next;
};
```

**결과**: 메인 스레드 블로킹 제거, 화면 반영 지연 **3~5초 → 1초 이내** 단축

---

## 3. JSON 규칙 기반 데이터 정합성 확보

계산 로직이나 기능이 추가될 때마다 이미 만들어진 백엔드 프로시저를 거의 다 손봐야 하는 상황이었지만, 현실적으로 그럴 수는 없었습니다. 결국 그 부담이 프론트로 넘어왔고, 저는 사용자에게 최적의 사용감을 주는 선에서 이를 프론트에서 흡수해야 했습니다. null·부분 응답 환경에서는 데이터 오염 가능성까지 있었습니다.

그래서 데이터 보정 수식을 JSON 기반 규칙으로 분리해, 프론트 레이어에서 수식을 동적으로 불러와 계산하는 구조로 풀었습니다. 프로시저를 건드리지 않고도 계산 로직 변경을 프론트에서 유연하게 반영할 수 있게 됐습니다.

```json title="correctionRules.json"
[
  {
    "field": "powerUsage",
    "condition": "null",
    "fallback": 0
  },
  {
    "field": "efficiency",
    "condition": "< 0",
    "formula": "value * -1"
  },
  {
    "field": "temperature",
    "condition": "> 100",
    "fallback": null
  }
]
```

```ts title="applyRules.ts"
import rules from './correctionRules.json';

export function applyCorrection(data: RawData): CorrectedData {
  const result = { ...data };

  for (const rule of rules) {
    const value = result[rule.field];

    if (rule.condition === 'null' && value == null) {
      result[rule.field] = rule.fallback;
    } else if (rule.condition === '< 0' && typeof value === 'number' && value < 0) {
      result[rule.field] = rule.formula ? eval(rule.formula.replace('value', String(value))) : rule.fallback;
    } else if (rule.condition === '> 100' && typeof value === 'number' && value > 100) {
      result[rule.field] = rule.fallback ?? null;
    }
  }

  return result;
}
```

**결과**: 백엔드 프로시저 변경 시 프론트 수정 최소화, 데이터 정합성 확보

---

## 4. 성능 측정 체계 구축

성능 개선 효과를 정량적으로 판단하기 어려운 문제가 있었습니다.
`performance.now()`와 `requestAnimationFrame()`을 조합해 실제 화면 반영 지연을 측정하는 체계를 구축했습니다.

```ts title="measureRenderDelay.ts"
export function measureRenderDelay(label: string) {
  const start = performance.now();

  requestAnimationFrame(() => {
    const end = performance.now();
    console.log(`[${label}] 화면 반영 지연: ${(end - start).toFixed(2)}ms`);
  });
}
```

```ts title="useRealtimeData.ts — 측정 적용"
const handleNewData = (next: DataMap) => {
  measureRenderDelay('delta-apply');
  workerRef.current?.postMessage({ prev: prevDataRef.current, next });
  prevDataRef.current = next;
};
```

**결과**: 개선 전후 수치 정량 비교 가능, Web Worker 도입 효과 검증 완료
