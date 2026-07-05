---
title: 데이터 정합성 · 검증 체계
sidebar_label: 데이터 정합성 · 검증 체계
---

# 데이터 정합성 · 검증 체계

BEMS에서는 실시간 반영 성능을 높이는 것과 함께, 데이터 정합성을 안정적으로 유지하고 개선 효과를 수치로 검증하는 기준도 필요했습니다.

이 문서는 그 과정에서 적용한 JSON 규칙 기반 데이터 보정 방식과 성능 측정 체계를 정리한 보조 문서입니다.

---

## 1. JSON 규칙 기반 데이터 정합성 확보

계산 로직이나 기능이 추가될 때마다 이미 만들어진 백엔드 프로시저를 거의 다 손봐야 하는 상황이었지만, 현실적으로 그럴 수는 없었습니다. 결국 그 부담이 프론트로 넘어왔고, 저는 사용자에게 최적의 사용감을 주는 선에서 이를 프론트에서 흡수해야 했습니다. null·부분 응답 환경에서는 데이터 오염 가능성까지 있었습니다.

그래서 데이터 보정 수식을 JSON 기반 규칙으로 분리해, 프론트 레이어에서 수식을 동적으로 불러와 계산하는 구조로 풀었습니다. 프로시저를 건드리지 않고도 계산 로직 변경을 프론트에서 유연하게 반영할 수 있게 했고, 정합성 문제를 기능 수정 때마다 반복해서 되짚지 않도록 만들었습니다.

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

예시 코드입니다. 일반적인 패턴을 기반으로, 도메인 특성에 맞게 재구성해 적용했습니다.

```ts title="applyRules.ts"
import rules from './correctionRules.json';

export function applyCorrection(data: RawData): CorrectedData {
  const result = { ...data };

  for (const rule of rules) {
    result[rule.field] = transformByRule(rule, result[rule.field]);
  }

  return result;
}
```

실제로는 도메인별 보정 규칙과 계산 로직을 실행했고, 정합성 보정이 끝난 결과만 화면과 검증 단계에서 사용할 수 있도록 정리했습니다.

**결과**: 백엔드 프로시저 변경 시 프론트 수정 최소화, 데이터 정합성 확보

---

## 2. 성능 측정 체계 구축

성능 개선 효과를 정량적으로 판단하기 어려운 문제가 있었습니다. 체감상 빨라졌다는 설명만으로는 클라이언트와 팀이 같은 기준으로 결과를 검증하기 어려웠습니다.

그래서 `performance.now()`와 `requestAnimationFrame()`을 조합해 실제 화면 반영 지연을 측정하는 체계를 구축했습니다. 개선이 맞는지, 어느 정도 좋아졌는지를 숫자로 확인할 수 있어야 다음 판단도 명확해진다고 봤습니다.

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
