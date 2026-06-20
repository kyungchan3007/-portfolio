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

| 발견 항목 | 문제 | 개선 방향 | 결과 |
|---|---|---|---|
| 네트워크 요청 | 폴링 기반으로 불필요한 요청 발생 | SSE 전환 | **60% 감소** |
| 화면 반영 지연 | 폴링 주기로 3~5초 지연 | SSE 실시간 수신 | **1초 이내** |
| 설비 트리 렌더링 | 노드 상태 변경 시 전체 트리 재렌더링 | 확장 서브트리만 상태 유지, 미노출 노드 조건부 unmount | React DevTools 기준 **60% 개선** |
| 초기 JS 로드 | router 100개 페이지 직접 import (1.67MB gzip) | lazy route 전환 | **30~60% 절감 가능** |
| API 레이어 역의존 | API client가 UI/상태 계층 직접 참조 (184개) | 의존성 주입 방식으로 분리 | **60~75% 감소 가능** |
| 렌더링 비용 | theme/message 매 렌더마다 재생성 | `useMemo` / `useEffect` 적용 | 불필요한 렌더 비용 감소 |

---

## AI Agent

코드 리뷰 기준이 명문화되어 있지 않아 번들 크기, 의존성 구조, 라우팅 안정성을 수동으로 점검해야 했습니다. AI Agent를 도입해 681개 소스 파일을 정적 분석하고 `MERGE: HOLD` 판정과 함께 주요 이슈를 발굴했습니다.

### 1. lazy route 전환 (번들 크기 개선)

```tsx
// Before
{ path: "/usermanagement", element: <UserManagement /> }

// After
const UserManagement = lazy(
  () => import("@/pages/user-management")
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

### 2. API 레이어 역의존 해소

```ts
// Before
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

### 3. 렌더링 비용 개선

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

