---
title: 데이터 정합성 · 검증 체계
sidebar_label: 데이터 정합성 · 검증 체계
---

# 데이터 정합성 · 검증 체계

실시간 반영 성능과 함께, 데이터 정합성을 유지하고 개선 효과를 수치로 검증하는 기준을 만든 보조 문서입니다.

---

## 1. JSON 규칙 기반 보정 — 프로시저 수정 없이 정합성 확보

계산 로직이 추가될 때마다 백엔드 프로시저를 전부 손대는 대신, 보정 수식을 JSON 규칙으로 분리해 프론트에서 동적으로 계산하도록 만들었습니다.

- **문제** — 로직 추가 시 프로시저 전면 수정이 현실적으로 불가, 부담이 프론트로 전가되고 null·부분 응답에서 데이터 오염 가능성
- **적용** — 보정 수식을 JSON 규칙으로 분리, 프론트 레이어에서 수식을 동적 로드·계산, 정합성 보정이 끝난 결과만 화면·검증 단계에서 사용
- **성과** — 백엔드 프로시저 변경 시 프론트 수정 최소화, 데이터 정합성 확보

```json title="domain.json"
[
  {
    "field": "측정 항목 A",
    "condition": "결측 조건",
    "fallback": 0
  },
  {
    "field": "측정 항목 B",
    "condition": "범위 이탈 조건",
    "formula": "보정 수식"
  },
  {
    "field": "측정 항목 C",
    "condition": "임계 초과 조건",
    "fallback": null
  }
]
```

```ts title="domain.ts"
export function 보정적용(원본) {
  const 결과 = { ...원본 };

  for (const 규칙 of rules) {
    "규칙에 따라 해당 필드 값을 보정";
  }

  return 결과;
}
```

---

## 2. 화면 반영 지연 측정 체계 — 개선 효과 정량 검증

체감이 아니라 숫자로 검증할 수 있도록, `performance.now()`와 `requestAnimationFrame()`으로 실제 화면 반영 지연을 측정하는 체계를 만들었습니다.

- **문제** — "체감상 빨라졌다"만으로는 클라이언트·팀이 같은 기준으로 개선 효과를 검증 불가
- **적용** — 수신 시점과 다음 프레임 반영 시점의 차이를 측정하는 유틸을 데이터 처리 경로에 삽입
- **성과** — 개선 전후 수치 정량 비교 가능, Web Worker 도입 효과 검증 완료

```ts title="domain.ts"
export function 지연측정(라벨: string) {
  const 시작 = performance.now();

  requestAnimationFrame(() => {
    const 종료 = performance.now();
    console.log(`[${라벨}] 화면 반영 지연: ${(종료 - 시작).toFixed(2)}ms`);
  });
}
```

```ts title="domain.ts"
const 신규데이터처리 = (다음값: DataMap) => {
  지연측정('delta-apply');
  workerRef.current?.postMessage({ prev: prevDataRef.current, next: 다음값 });
  prevDataRef.current = 다음값;
};
```
