---
sidebar_position: 3
title: VSA 병렬 개발 (FMS)
sidebar_label: VSA 병렬 개발
---

# FMS — Vertical Slice Architecture 적용

**적용 프로젝트: FMS**

---

:::tip 결과
개발 인원 3→2명에도 30개 이상 라우트 전 도메인 커버리지 유지.
AI Agent를 도메인별로 독립 할당해 슬라이스 간 충돌 없이 병렬 개발.
:::

---

## 폴더 구조

```
src/
├── features/
│   ├── inspection/          ← Agent A 담당
│   │   ├── ui/
│   │   │   ├── InspectionList.tsx
│   │   │   └── InspectionDetail.tsx
│   │   ├── model/
│   │   │   ├── useInspection.ts
│   │   │   └── inspection.schema.ts
│   │   ├── api/
│   │   │   └── inspectionApi.ts
│   │   └── index.ts
│   │
│   ├── work-order/          ← Agent B 담당
│   │   ├── ui/
│   │   ├── model/
│   │   ├── api/
│   │   └── index.ts
│   │
│   └── facility-status/     ← Agent C 담당
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

```ts title="features/inspection/index.ts"
export { InspectionList } from './ui/InspectionList';
export { InspectionDetail } from './ui/InspectionDetail';
export { useInspection } from './model/useInspection';
export type { Inspection } from './model/inspection.schema';

// 내부 구현 파일은 export 하지 않음 → 외부에서 직접 접근 불가
```

다른 슬라이스는 index.ts를 통해서만 접근:

```ts title="features/work-order/model/useWorkOrder.ts"
// ✅ index.ts 통해 접근
import type { Inspection } from '@/features/inspection';

// ❌ 내부 파일 직접 접근 금지
// import { inspectionApi } from '@/features/inspection/api/inspectionApi';
```

---

## Zod 스키마로 슬라이스 계약 명시

```ts title="features/inspection/model/inspection.schema.ts"
import { z } from 'zod';

export const InspectionSchema = z.object({
  id: z.string().uuid(),
  facilityId: z.string(),
  status: z.enum(['pending', 'in_progress', 'completed', 'failed']),
  scheduledAt: z.string().datetime(),
  completedAt: z.string().datetime().nullable(),
  inspector: z.object({
    id: z.string(),
    name: z.string(),
  }),
});

export type Inspection = z.infer<typeof InspectionSchema>;
```

API 응답을 받을 때 스키마로 즉시 검증 → 계약 위반 시 런타임에서 즉시 감지.
