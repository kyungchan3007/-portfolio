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

`React` `TypeScript` `Redux` `SSE` `react-query` `Styled-components` `SCSS` `Sonar`

---

## 성과 요약

| 발견 항목 | 문제 | 개선 방향 | 결과 |
|---|---|---|---|
| 네트워크 요청 | 불필요한 폴링 요청 | SSE 전환 | **60% 감소** |
| 화면 반영 지연 | 폴링 주기로 3~5초 지연 | SSE 실시간 수신 | **1초 이내** |
| 트리 렌더링 | 전체 트리 재렌더링 | 서브트리 상태 유지 | **60% 개선** |
| 초기 JS 로드 | 전체 페이지 직접 import | lazy route 전환 | **30~60% 절감 가능** |
| API 역의존 | API client의 UI/상태 참조 | 의존성 주입 분리 | **60~75% 감소 가능** |
| 렌더링 비용 | theme/message 재생성 | 메모이제이션 적용 | 불필요 렌더 감소 |

---

## AI Agent

코드 리뷰 기준이 명문화되어 있지 않아 번들 크기, 의존성 구조, 라우팅 안정성을 수동으로 점검해야 했습니다. AI Agent를 도입해 정적 분석 기반으로 주요 이슈를 발굴하고 개선 방향을 도출했습니다.

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

초기 번들에 전체 페이지가 포함되던 구조를 화면별 lazy loading으로 전환. 초기 JS 로드 **30~60% 절감** 가능.

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
