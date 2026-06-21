---
sidebar_position: 2
title: Layered → VSA 전환
sidebar_label: Layered → VSA 전환
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Layered Architecture → Vertical Slice Architecture 전환

---

기존 Layered Architecture 기반 구조에서는 화면, API 호출, 상태 관리, 실시간 소켓 처리 로직이 전역 레이어에 분산되어 기능 단위 변경 시 여러 계층을 동시에 수정해야 하는 문제가 있었습니다.

특히 Socket.IO + MQTT 기반 장비 상태 갱신 로직이 페이지별로 직접 연결되고, 메시지 리스너 cleanup과 브로드캐스트 책임이 명확히 분리되지 않아 화면 전환 시 상태 갱신 누락, 중복 수신, 연결 관리 복잡도가 발생할 수 있었습니다.

이를 해결하기 위해 AI 기반 코드 분석으로 기능별 의존 흐름과 실시간 메시지 처리 경계를 식별했고, Layered Architecture에서 Vertical Slice Architecture 중심으로 구조를 재설계했습니다.

그 결과 장비 상태 갱신 기능을 UI/API/상태/실시간 처리 책임 단위로 응집시키고, 공통 소켓 모듈과 서버 단일 브로드캐스트 구조를 도입해 기능 단위 변경이 가능한 구조로 개선했습니다.

---

## Before — Layered Architecture

```
src/
├── components/
│   ├── EntityPanel.tsx       ← Domain A
│   ├── EntityChart.tsx       ← Domain B
│   └── EntityBanner.tsx      ← Domain C
├── hooks/
│   ├── useEntityA.ts
│   ├── useEntityB.ts
│   └── useEntityC.ts
├── services/
│   ├── entityAApi.ts
│   ├── entityBApi.ts
│   └── entityCApi.ts
└── store/
    ├── entityASlice.ts
    ├── entityBSlice.ts
    └── entityCSlice.ts
```

---

## After — Vertical Slice Architecture

```
src/
├── features/
│   ├── domain-a/             ← Domain A 기능 전체가 여기
│   │   ├── ui/
│   │   │   └── EntityPanel.tsx
│   │   ├── model/
│   │   │   ├── useEntity.ts
│   │   │   └── entitySlice.ts
│   │   ├── api/
│   │   │   └── entityApi.ts
│   │   └── index.ts
│   │
│   ├── domain-b/             ← Domain B 기능 전체가 여기
│   │   ├── ui/
│   │   │   └── EntityChart.tsx
│   │   ├── model/
│   │   │   ├── useEntity.ts
│   │   │   └── entitySlice.ts
│   │   ├── api/
│   │   │   └── entityApi.ts
│   │   └── index.ts
│   │
│   └── domain-c/             ← Domain C 기능 전체가 여기
│
└── shared/                   ← 슬라이스 간 공유 코드만
    ├── ui/
    ├── lib/
    └── websocket/            ← 공용 실시간 통신 클라이언트
```

---

## 실제 코드 비교

<Tabs>
  <TabItem value="before" label="Before (Layered) — 도메인 명령 전송">

```ts title="hooks/useEntity.ts"
import { entityApi } from '../services/entityApi';     // services 레이어 참조
import { useDispatch } from 'react-redux';
import { setEntityState } from '../store/entitySlice';  // store 레이어 참조

export function useEntity() {
  const dispatch = useDispatch();

  const sendCommand = async (entityId: string, command: string) => {
    const result = await entityApi.send(entityId, command);
    dispatch(setEntityState(result));
  };

  return { sendCommand };
}
```

  </TabItem>
  <TabItem value="after" label="After (VSA) — 도메인 명령 전송">

```ts title="useEntity.ts"
import { sendEntityCommand } from '../api/entityApi'; // 같은 슬라이스 내 api
import { useEntityStore } from './entitySlice';       // 같은 슬라이스 내 model

export function useEntity() {
  const { setState } = useEntityStore();

  const sendCommand = async (entityId: string, command: string) => {
    const result = await sendEntityCommand(entityId, command);
    setState(result);
  };

  return { sendCommand };
}
```

```ts title="domain-a/index.ts"
// 슬라이스 외부에 공개할 인터페이스
export { EntityPanel } from './ui/EntityPanel';
export { useEntity } from './model/useEntity';
```

기능 슬라이스별 public API를 정의해 외부 모듈이 내부 구현 경로에 직접 의존하지 않도록 제한했습니다.
이를 통해 슬라이스 내부 구조 변경이 외부 사용처로 전파되는 문제를 줄였습니다.

  </TabItem>
</Tabs>

---

## 전환 효과

| 항목 | Before (Layered) | After (VSA) |
|---|---|---|
| 도메인 기능 수정 시 변경 파일 | 4개 레이어 각각 | `features/domain-a/` 내부만 |
| 수정 영향 범위 | 전체 레이어 | **40% 축소** |
| 신규 기능 추가 | 레이어마다 파일 추가 | 슬라이스 폴더 하나 추가 |

수정 영향 범위 40% 축소. 슬라이스 단위 독립성으로 사이드 이펙트 감소.
