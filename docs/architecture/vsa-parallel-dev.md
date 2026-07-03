---
sidebar_position: 3
title: VSA 설계
sidebar_label: VSA 설계
---

# Vertical Slice Architecture 적용


---

FMS에서는 작은 팀이 여러 도메인을 동시에 다뤄야 했기 때문에, 기능 단위 병렬 개발이 가능한 구조가 필요했습니다. 이 문서는 그 문제를 해결하기 위해 왜 VSA를 선택했고, 어떤 방식으로 경계를 설계했는지에 집중합니다.

기존 레이어 중심 구조에서는 UI, 상태, API 로직이 전역 폴더에 분산되어 기능 단위 변경 범위가 불명확했습니다. 이 구조에서는 병렬 개발을 시도할수록 수정 충돌과 조율 비용이 커질 수밖에 없었습니다.

그래서 도메인별 UI, model, api, schema를 하나의 슬라이스 안에 응집시키고, 각 작업은 담당 슬라이스 안에서만 이루어지도록 경계를 제한했습니다. 외부 모듈은 `index.ts` public API를 통해서만 접근하게 해 슬라이스 밖으로 내부 구현이 새어 나가지 않도록 했습니다.

그 결과 변경 범위를 슬라이스 내부로 가둘 수 있었고, 병렬 개발 시 충돌을 줄이면서 신규 기능이나 도메인 추가에도 기존 영역 영향 범위를 최소화할 수 있었습니다.

---

## 폴더 구조

```
src/
├── features/
│   ├── domain-a/
│   │   ├── ui/
│   │   │   ├── EntityList.tsx
│   │   │   └── EntityDetail.tsx
│   │   ├── model/
│   │   │   ├── useEntity.ts
│   │   │   └── entity.schema.ts
│   │   ├── api/
│   │   │   └── entityApi.ts
│   │   └── index.ts
│   │
│   ├── domain-b/
│   │   ├── ui/
│   │   ├── model/
│   │   ├── api/
│   │   └── index.ts
│   │
│   └── domain-c/
│
└── shared/
    ├── ui/
    ├── lib/
    │   └── queryClient.ts
    └── api/
        └── httpClient.ts
```

---

## 왜 이 구조가 필요했는가

기존 구조의 핵심 문제는 "기능 하나를 바꾸기 위해 여러 전역 레이어를 동시에 건드려야 한다"는 점이었습니다. 화면 하나를 수정해도 UI 컴포넌트, 상태 관리, API 호출, 스키마 정의가 서로 떨어져 있어 영향 범위를 빠르게 파악하기 어려웠고, 같은 도메인을 두 사람이 나눠 작업할수록 충돌 위험도 커졌습니다.

그래서 필요한 것은 단순한 폴더 정리가 아니라, 도메인 단위로 변경 범위를 가두는 구조였습니다. VSA는 각 기능이 자신의 UI, 모델, API, 스키마를 함께 가지도록 만들어 수정 범위를 슬라이스 내부로 최대한 한정했습니다.

---

## index.ts — 슬라이스 경계 강제

```ts title="index.ts"
export { EntityList } from './ui/EntityList';
export { EntityDetail } from './ui/EntityDetail';
export { useEntity } from './model/useEntity';
export type { Entity } from './model/entity.schema';

// 내부 구현 파일은 export 하지 않음 → 외부에서 직접 접근 불가
```

기능 슬라이스별 public API를 정의해 외부 모듈이 내부 구현 경로에 직접 의존하지 않도록 제한했습니다.
이를 통해 내부 구현 경로에 직접 접근하는 deep import를 줄이고, 기능 단위 캡슐화를 강화했습니다. 즉, 병렬 개발을 하더라도 다른 사람이 맡은 슬라이스 내부 구현까지 연쇄적으로 건드리지 않도록 안전장치를 둔 것입니다.

다른 슬라이스는 index.ts를 통해서만 접근:

```ts title="useDomainB.ts"
// ✅ index.ts 통해 접근
import type { Entity } from '@/features/domain-a';

// ❌ 내부 파일 직접 접근 금지
// import { entityApi } from '@/features/domain-a/api/entityApi';
```

---

## 슬라이스 경계를 더 명확히 만든 보조 장치

```ts title="entity.schema.ts"
import { z } from 'zod';

export const EntitySchema = z.object({
  id: z.string().uuid(),
  parentId: z.string(),
  status: z.enum(['pending', 'in_progress', 'completed', 'failed']),
  scheduledAt: z.string().datetime(),
  completedAt: z.string().datetime().nullable(),
  assignee: z.object({
    id: z.string(),
    name: z.string(),
  }),
});

export type Entity = z.infer<typeof EntitySchema>;
```

API 응답을 받을 때 스키마로 즉시 검증하게 해, 슬라이스가 기대하는 데이터 계약을 코드 수준에서 분명히 했습니다. 이 장치는 VSA 자체를 대체하는 것은 아니지만, 도메인 경계를 안정적으로 유지하는 데 도움이 됐습니다.
