---
sidebar_position: 2
title: BEMS — Building Energy Management System
sidebar_label: BEMS
---

# BEMS — Building Energy Management System

**2023.08 – 2025.08 · ㈜TSM Technology · 과장 · FE 개발 · 팀 리딩**

:::info 개요
건물 에너지 사용 데이터 실시간 수집·시각화 및 설비 조회·집계 분석 시스템.
클라이언트 요구사항 회의·일정 조율과 팀 리딩·직접 개발을 병행했습니다.
:::

## 기술 스택

`React` `TypeScript` `Redux` `SSE` `react-query` `Styled-components` `SCSS` `Sonar`

---

## 성과 요약

| 지표 | Before | After |
|---|---|---|
| 네트워크 요청 | 폴링 기반 | SSE 전환으로 **60% 감소** |
| 화면 반영 지연 | 3~5초 | **1초 이내** |
| 설비 트리 렌더링 | 전체 재렌더링 | React DevTools 기준 **60% 개선** |
| UAT 버그 | 다수 | 자정 캐시 초기화로 **80% 감소** |
| 초기 JS 로드 (예상) | 1.67MB gzip | lazy route 적용 시 **30~60% 절감 가능** |
| page-service 직접 결합 | 184개 파일 | API 의존 분리 시 **60~75% 감소 가능** |

---

## 아키텍처 전환

**Layered Architecture → FSD(Feature-Sliced Design)**

레이어 비대화 한계 도달 후 도메인별 책임 분리를 위해 FSD로 전환.

→ 자세한 내용: [Layered → FSD 전환](/architecture/layered-to-fsd)

---

## 주요 구현

### 1. SSE 실시간 통신

폴링 방식에서 SSE로 전환해 네트워크 요청 60% 감소, 화면 반영 지연 1초 이내 단축.

→ 자세한 내용: [SSE vs 폴링](/realtime/sse-vs-polling)

### 2. 10만+ 설비 트리 렌더링 최적화

```
문제: 노드 상태 변경 시 전체 트리 재렌더링 → 화면 조작 지연
해결: 확장된 서브트리만 상태 유지, 미노출 하위 노드 조건부 unmount
```

### 3. Container-Presenter 패턴

설비 조회 화면을 필터 영역(Container)과 결과 영역(Presenter)으로 분리, 화면 로직과 UI 책임 분리.

```tsx title="FacilityPage (Container)"
export function FacilityPage() {
  const { filters, setFilter } = useFacilityFilters();
  const { data, isLoading } = useFacilityQuery(filters);

  return (
    <FacilityLayout>
      <FacilityFilterPanel filters={filters} onChange={setFilter} />
      <FacilityResultPanel data={data} isLoading={isLoading} />
    </FacilityLayout>
  );
}
```

### 4. React Query 자정 캐시 초기화

```ts title="useMidnightCacheReset.ts"
export function useMidnightCacheReset() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const msUntilMidnight = midnight.getTime() - now.getTime();

    const timer = setTimeout(() => {
      queryClient.invalidateQueries();
    }, msUntilMidnight);

    return () => clearTimeout(timer);
  }, [queryClient]);
}
```

---

## Issue & Resolution

:::danger 문제
10만+ 설비 트리에서 노드 상태 변경 시 전체 트리가 재렌더링되어 화면 조작 지연 발생.
:::

**원인**: 단일 상태 변경이 부모→자식 전체 계층으로 전파되는 구조.

**해결**: 확장된 서브트리만 상태 유지, 미노출 하위 노드 조건부 unmount로 렌더링 범위 제한.

:::tip 결과
React DevTools 기준 속도 60% 개선, 조작 반응 속도 30% 향상.
:::

---

## AI Agents 기반 코드 검증

코드 리뷰 기준이 명문화되어 있지 않아 번들 크기, 의존성 구조, 라우팅 안정성을 수동으로 점검해야 했습니다. AI Agent를 도입해 681개 소스 파일을 정적 분석하고 `MERGE: HOLD` 판정과 함께 6개 이슈를 발굴했습니다.

| 발견 이슈 | 수치 | 심각도 |
|---|---|---|
| 라우트 대소문자 불일치 | 1건 | High |
| router 직접 import (번들 과다) | 100건 / JS 1.67MB gzip | High |
| API 레이어 역의존 | page→service 직접 결합 184개 | Medium |
| React Query 버전 혼재 (v3/v5) | 183개 파일 | Medium |
| 렌더 흐름 내 theme/message 재생성 | App 렌더마다 1회 | Medium |
| 운영 console.log 노출 | 22건 | Low |

### 1. 라우트 대소문자 불일치

```ts
// Before
NBSXB040: "/stdfacList"
path: "/stdfaclist"

// After
NBSXB040: "/stdfaclist"
path: "/stdfaclist"
```

메뉴 클릭 시 라우트 매칭 실패 및 권한 오판 위험 제거.

### 2. lazy route 전환 (번들 크기 개선)

```tsx
// Before
import UserManagement from "../../pages/public/user-management/user-menegement";

{ path: "/usermanagement", element: <UserManagement /> }

// After
const UserManagement = lazy(
  () => import("../../pages/public/user-management/user-menegement")
);

{
  path: "/usermanagement",
  element: (
    <Suspense fallback={<LoadingDot />}>
      <UserManagement />
    </Suspense>
  ),
}
```

초기 번들에 100개 페이지가 포함되던 구조를 화면별 lazy loading으로 전환. 초기 JS 로드 **30~60% 절감** 가능.

### 3. API 레이어 역의존 해소

```ts
// Before
import { createNotify } from "../../../components/notify/custom-notify";
import store from "../../../store/store/store";

const state = store.getState();
createNotify(...);

// After
export const createApiClient = ({ getAuthState, onAuthExpired, onError }) => {
  const api = axios.create({ baseURL: BASE_URL });

  api.interceptors.request.use((req) => {
    const { accessToken, currentMenu } = getAuthState();
    req.headers.Authorization = `Bearer ${accessToken}`;
    req.headers.menu = currentMenu;
    return req;
  });

  return api;
};
```

API client가 UI/상태 계층을 직접 참조하던 구조를 의존성 주입 방식으로 분리. page-service 직접 결합 **60~75% 감소** 가능.

### 4. React Query 버전 통일

```tsx
// Before
import { QueryClient, QueryClientProvider } from "react-query";

// After
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
```

의존성은 v5로 선언되어 있으나 183개 파일이 v3를 사용하는 혼재 상태를 단일 기준으로 통일.

### 5. 렌더링 비용 개선

```tsx
// Before
loadMessages({ ko: { ... } });
const theme = createTheme({ palette: { mode: isDark ? "dark" : "light" } });

// After
useEffect(() => { loadMessages({ ko: { ... } }); }, [t]);
const theme = useMemo(
  () => createTheme({ palette: { mode: isDark ? "dark" : "light" } }),
  [isDark]
);
```

App 최상위 렌더마다 theme 객체와 메시지가 재생성되던 구조를 `useMemo` / `useEffect`로 개선.

### 6. 운영 console.log 제거

```js
// Before
console.log(error);

// After
reportClientError(error);
```

22건의 활성 `console.log`를 에러 수집 경로로 일원화해 운영 노이즈 및 민감 데이터 노출 가능성 감소.
