---
sidebar_position: 3
title: VSA 병렬 개발
sidebar_label: VSA 병렬 개발
---

# Vertical Slice Architecture 적용


---

FMS는 30개 이상 라우트를 짧은 기간 안에 구현해야 했고, 2인 체제에서 여러 도메인을 병렬 개발해야 했습니다.
기존 레이어 중심 구조에서는 UI, 상태, API 로직이 전역 폴더에 분산되어 기능 단위 변경 범위가 불명확했고, Agent를 병렬 투입할수록 수정 충돌과 컨텍스트 혼선이 커질 수 있었습니다.

이를 해결하기 위해 Vertical Slice Architecture를 적용해 도메인별 UI, model, api, schema를 하나의 슬라이스 안에 응집시켰습니다.
각 Agent는 담당 슬라이스만 수정하도록 경계를 제한하고, 외부 모듈은 `index.ts` public API를 통해서만 접근하도록 했습니다.

그 결과 슬라이스 간 충돌 없이 병렬 개발이 가능해졌고, 2인 체제에서도 30개 이상 라우트의 전 도메인 커버리지를 유지할 수 있었습니다.
신규 도메인 추가 시에도 기존 슬라이스 영향 범위를 최소화할 수 있었습니다.

---

## 폴더 구조

```
src/
├── features/
│   ├── domain-a/            ← Agent A 담당
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
│   ├── domain-b/            ← Agent B 담당
│   │   ├── ui/
│   │   ├── model/
│   │   ├── api/
│   │   └── index.ts
│   │
│   └── domain-c/            ← Agent C 담당
│
└── shared/
    ├── ui/
    ├── lib/
    │   └── queryClient.ts
    └── api/
        └── httpClient.ts
```

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
이를 통해 내부 구현 경로에 직접 접근하는 deep import를 줄이고, 기능 단위 캡슐화를 강화했습니다.

다른 슬라이스는 index.ts를 통해서만 접근:

```ts title="useDomainB.ts"
// ✅ index.ts 통해 접근
import type { Entity } from '@/features/domain-a';

// ❌ 내부 파일 직접 접근 금지
// import { entityApi } from '@/features/domain-a/api/entityApi';
```

---

## Zod 스키마로 슬라이스 계약 명시

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

API 응답을 받을 때 스키마로 즉시 검증 → 계약 위반 시 런타임에서 즉시 감지.
