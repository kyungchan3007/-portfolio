---
sidebar_position: 2
title: BEMS
sidebar_label: BEMS
---

# BEMS

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

null 데이터와 부분 응답 환경에서 백엔드 프로시저 수정 시 영향 범위가 증가하고 데이터 오염 가능성이 존재했습니다.
데이터 보정 수식을 JSON 기반 규칙으로 분리하여 프론트 레이어에서 동적으로 계산하는 구조로 개선했습니다.

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
