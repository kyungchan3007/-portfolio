---
sidebar_position: 1
title: SSR 인증/렌더링 구조
sidebar_label: SSR 인증/렌더링 구조
---

# SSR 기반 인증 · 렌더링 구조

여러 Next.js App Router 프로젝트에 공통으로 적용한 **SSR 중심 인증/렌더링 아키텍처**입니다. 클라이언트 렌더링 이후에 상태를 판단하는 방식이 아니라, 서버 컴포넌트에서 먼저 인증·사용자 상태·보안 검증을 판단하도록 직접 설계했습니다.

---

## 배경 — 왜 문제였나

초기 구조는 CSR-only였고, 첫 렌더링이 다음 순서로 흘러갔습니다.

```
빈 화면(Spinner) 렌더 → 브라우저 JS hydration → useEffect fetch → 상태 판단 → 재렌더/redirect
```

이 구조에서 네 가지 문제를 겪었습니다.

- **초기 화면 깜빡임** — hydration 이후에야 인증/데이터가 반영되어 네비게이션·콘텐츠가 뒤늦게 바뀌었습니다.
- **보호 페이지 순간 노출** — 로그인 판별이 클라이언트에서 일어나, 인증이 필요한 화면이 잠깐 그려진 뒤 뒤늦게 로그인 페이지로 밀려났습니다.
- **데이터 워터폴** — 데이터가 많은 페이지일수록 `렌더 → mount → fetch → 재렌더`가 누적되어 로딩 스피너와 layout shift가 반복됐습니다.
- **토큰 노출 리스크** — 브라우저가 access token을 직접 들고 백엔드와 통신했습니다.

---

## 왜 SSR인가 — 채택 근거

### 1. 데이터가 무거운 초기 페이지

초기 진입 시 조회할 데이터가 많은 페이지가 많았습니다. CSR은 화면을 먼저 그린 뒤 데이터를 가져오는 워터폴이라 무거운 페이지일수록 체감 지연이 커졌습니다. 서버에서 **데이터를 미리 채운 HTML**을 내려주면 이 워터폴 자체가 사라지고, 서버는 백엔드와 가까워 **병렬 fetch·저지연 수집**에 유리하며 핵심 콘텐츠가 초기 HTML에 포함되어 LCP가 개선된다고 판단해 SSR을 선택했습니다.

### 2. 인증 · 보호 페이지

인증이 필요한 화면은 클라이언트가 판단하기 전에 서버에서 선제적으로 차단하는 것이 안전하다고 봤습니다. 어차피 서버에서 쿠키를 읽어 인증을 판별하므로, 그 지점에서 라우팅과 데이터 로딩까지 함께 결정하도록 설계해 왕복을 줄였습니다.

### 3. 토큰 보안

브라우저가 access token을 직접 다루지 않도록, 서버(Route Handler)를 BFF 계층으로 두어 토큰을 서버에만 유지하고 백엔드 호출을 대리했습니다.

:::note 
SSR + Suspense 스트리밍
SSR은 "서버가 데이터를 다 받을 때까지 응답을 늦출 수 있다"는 TTFB 트레이드오프가 있습니다. 그래서 무거운 데이터 영역은 `Suspense`로 감싸 **먼저 보여줄 것은 즉시 스트리밍하고, 무거운 부분만 나중에 흘려보내는** 방식으로 관리했습니다. 무겁다고 SSR을 피한 것이 아니라, 스트리밍으로 무거움을 통제했습니다.
:::

---

## 성과 요약

| 발견 항목 | 문제 | 개선 방향 | 결과 |
|---|---|---|---|
| Root 인증 라우팅 | client-side Spinner hydration 후 redirect | 서버 쿠키 기반 `redirect()` 로 전환 | First Load JS **약 10~14% 절감** |
| Route entry 경계 | dynamic route entry가 Client Component | Server Component shell + Client UI 분리 | client entry 수 **약 17% 감소** |
| React Query 캐시 | 전역 singleton으로 SSR 요청 간 오염 리스크 | 요청 단위 인스턴스 생성으로 전환 | cache contamination 리스크 완화 |
| 보호 페이지 노출 | 클라이언트 판별 전 순간 노출 | 렌더 전 서버 인증 게이트 | 미인증 사용자 렌더 이전 차단 |
| 토큰 노출 | 브라우저가 access token 직접 사용 | Route Handler BFF로 토큰 서버 보관 | 브라우저 토큰 비노출 |

---

## 핵심 패턴

### 1. 서버 컴포넌트에서 인증 상태 판별

서버 컴포넌트에서 HttpOnly 쿠키를 직접 읽어 로그인 여부를 SSR 단계에서 판별하도록 했고, 인증 상태별로 React Query 캐시 scope를 분리했습니다. 로그인/로그아웃 전환 시 쿼리 캐시가 섞이지 않도록 `authScope`를 Provider key로 사용했습니다.

```tsx title="layout.tsx"
export default async function RootLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE_KEY)?.value;
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE_KEY)?.value;
  const userEmail = cookieStore.get(USER_EMAIL_COOKIE_KEY)?.value?.trim();

  const isLoggedIn = Boolean(accessToken || refreshToken);
  const authScope = isLoggedIn ? userEmail || "authenticated" : "guest";

  return (
    <Providers key={authScope} authScope={authScope}>
      <GlobalNav isLoggedIn={isLoggedIn} />
      {children}
    </Providers>
  );
}
```

**효과**: hydration 이후 네비게이션이 바뀌는 문제를 제거했고, 인증 상태별 캐시 scope를 분리했습니다.

---

### 2. 상태 기반 진입 라우팅 (서버 redirect)

이미 로그인된 사용자나 특정 도메인 상태를 가진 사용자를 클라이언트에서 `useEffect`로 밀어내는 대신, 서버 렌더링 단계에서 쿠키·상태를 확인해 즉시 `redirect()` 하도록 구현했습니다.

```tsx title="page.tsx — 랜딩 진입 분기"
export default async function HomePage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE_KEY)?.value;

  if (accessToken) redirect("/home");

  return <WelcomeSection />;
}
```

도메인 상태(임시 저장 폼, 기존 분석 결과 등)에 따라 입력/결과 화면을 서버에서 분기하는 경우, 상태 조회 로직을 `server-only` 모듈로 분리했습니다.

```ts title="getDomainEntryRouteOnServer.ts"
export async function getDomainEntryRouteOnServer(): Promise<DomainEntryRoute> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE_KEY)?.value;
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE_KEY)?.value;
  const pendingForm = cookieStore.get(PENDING_FORM_COOKIE_KEY)?.value;

  if (!accessToken) return refreshToken ? "result" : "input";
  if (pendingForm) return "result";

  const profile = await getDomainProfileOnServer({ refreshOnUnauthorized: false });

  if (!profile.success) return "result";

  return profile.data?.domainResult ? "result" : "input";
}
```

```tsx title="domain/page.tsx"
export default async function DomainPage({ searchParams }: DomainPageProps) {
  const params = await searchParams;
  const nextPath = normalizeInternalRedirectPath(params.next);

  if (params.forceInput !== "1") {
    const entryRoute = await getDomainEntryRouteOnServer();
    if (entryRoute === "result") redirect(buildDomainResultPath(nextPath) as Route);
  }

  return <DomainInput nextPath={nextPath} />;
}
```

**효과**: 로그인 사용자가 비로그인 화면을 잠깐 보는 문제를 없앴고, 이미 결과가 있는 사용자에게 불필요한 입력 UX와 API 호출을 제거했습니다.

---

### 3. Server Component shell + Client UI 분리

dynamic route entry가 `useParams()`에 의존해 Client Component로 선언되던 구조를, route entry는 Server Component로 두고 `params`를 서버에서 해석한 뒤 UI 로직만 Client Component로 분리했습니다.

```tsx title="[type]/page.tsx — Server shell"
export default async function DomainDetailPage({ params }: DomainDetailPageProps) {
  const { type } = await params;
  return <DomainDetailClient type={type} />;
}
```

**효과**: Client Component 경계를 UI 영역으로 제한해 route entry의 client 번들을 줄였고, page 역할과 interactive UI 역할을 분리했습니다.

---

### 4. 렌더 전 보안 게이트

인증이 필요한 페이지는 서버 컴포넌트에서 공통 인증 게이트를 통과하도록 구성했습니다. access token이 있으면 허용, refresh token만 있으면 refresh UI, 둘 다 없으면 로그인 페이지로 redirect 하도록 했습니다.

```ts title="getProtectedPageAuthDomainServer.ts"
import "server-only";

export async function getProtectedPageAuthDomainServer(
  targetPath: Route,
): Promise<ProtectedPageAuthState> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE_KEY)?.value;
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE_KEY)?.value;
  const loginPath = buildLoginPath(targetPath);

  if (accessToken) return { kind: "allow" };
  if (refreshToken) return { kind: "refresh", loginPath };

  return { kind: "redirect", loginPath };
}
```

민감한 개인화 데이터가 포함된 결과 페이지는 인증에 더해 봇 검증까지 확인하도록 했고, 실제 결과 UI는 `Suspense`로 감싸 대기 상태를 처리했습니다.

```tsx title="domain.tsx"
export default async function DomainResultPage({ searchParams }: DomainResultPageProps) {
  const params = await searchParams;
  const nextPath = normalizeInternalRedirectPath(params.next);

  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE_KEY)?.value;
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE_KEY)?.value;
  const isBotCheckVerified = Boolean(cookieStore.get(BOT_CHECK_VERIFIED_COOKIE_KEY)?.value);

  if (!accessToken) {
    if (refreshToken) return <AuthRefreshRetry />;
    redirect("/login");
  }

  if (!isBotCheckVerified) {
    redirect(buildBotCheckVerifyPath(buildDomainResultPath(nextPath)));
  }

  return (
    <Suspense fallback={<ResultPendingGate />}>
      <DomainResult nextPath={nextPath} />
    </Suspense>
  );
}
```

**효과**: 미인증·미검증 사용자를 결과 컴포넌트가 렌더링되기 전에 서버에서 차단해, 보호 페이지의 잘못된 노출을 방지했습니다.

---

### 5. BFF 토큰 계층 (Route Handler)

브라우저가 백엔드 access token을 직접 다루지 않도록 Route Handler를 BFF로 두었습니다. 서버가 쿠키에서 토큰을 읽어 `Authorization` 헤더로 백엔드에 전달하고, 401 응답 시 refresh token으로 세션을 갱신한 뒤 재시도하도록 구현했습니다.

```ts title="authDomainFetch.ts"
export async function authDomainFetch(
  path: string,
  init: RequestInit = {},
) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE_KEY)?.value;
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE_KEY)?.value;

  if (!accessToken) {
    return { success: false, response: unauthorizedResponse("LOGIN_REQUIRED") };
  }

  const firstResponse = await requestBackend(path, init, accessToken);
  if (firstResponse.status !== 401) {
    return { success: true, response: firstResponse, accessToken };
  }

  if (!refreshToken) return { success: false, response: firstResponse };

  const refreshed = await refreshAuthSessionOnServer(cookieStore);
  if (!refreshed.success) {
    return { success: false, response: unauthorizedResponse("TOKEN_REFRESH_FAILED") };
  }

  const retryResponse = await requestBackend(path, init, refreshed.accessToken);
  return { success: retryResponse.ok, response: retryResponse, accessToken: refreshed.accessToken };
}
```

OAuth 로그인도 클라이언트에서 토큰을 처리하지 않고 Route Handler에서 state 생성·검증, 백엔드 토큰 교환, HttpOnly 쿠키 저장, 로그인 후 redirect를 모두 서버에서 처리했습니다.

```ts title="route.ts"
const result = await exchangeOAuthCodeOnServer(code);

const postLoginPath =
  result.data.accountStatus === "PENDING_DELETION"
    ? "/auth/restore"
    : requestedNextPath ?? (result.data.isNewUser ? "/domain" : "/home");

const res = NextResponse.redirect(new URL(postLoginPath, req.url));

res.cookies.set(ACCESS_TOKEN_COOKIE_KEY, result.data.accessToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: ACCESS_TOKEN_COOKIE_MAX_AGE,
});
```

**효과**: 인증 토큰 노출을 줄였고, 프론트엔드와 백엔드 API 계약 사이에 안정적인 서버 중간 계층을 만들었습니다.

---

### 6. 서버 API 가드 (CSRF · 봇 검증)

비용이 발생하거나 보안 검증이 필요한 POST API는 서버 Route Handler에서 CSRF·봇 검증을 먼저 수행하도록 공통 래퍼로 묶었습니다.

```ts title="guards.ts"
export function Guards(options: ApiGuardOptions, handler: RouteHandler) {
  return async (request, ...args) => {
    if (options.requireCsrf) {
      const csrfResponse = rejectCrossOriginRequest(request);
      if (csrfResponse) return csrfResponse;
    }
    if (options.requireBotCheck) {
      const botCheckResponse = await rejectUnverifiedBotCheck();
      if (botCheckResponse) return botCheckResponse;
    }
    return handler(request, ...args);
  };
}
```

**효과**: 개별 핸들러에 검증 로직을 흩뿌리지 않고, 가드를 선언적으로 적용해 보안 검증을 일관되게 강제했습니다.

---

### 7. SSR-안전 React Query 캐시 격리

전역 스코프에 `QueryClient` singleton을 두면 SSR/동시 렌더링 환경에서 요청 간 캐시가 공유되어 사용자별 데이터가 섞일 수 있었습니다. `useState`로 Provider 인스턴스마다 `QueryClient`를 생성해 요청 단위로 캐시를 격리했습니다.

```tsx title="queryProvider.tsx"
export const QueryProvider = ({ children }: QueryProviderProps) => {
  const [queryClient] = useState(createQueryClient);
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
```

**효과**: request/user 간 cache contamination 리스크를 줄였고, hydration 구조와 React Query 권장 패턴에 맞췄습니다.

---

### 8. SSR 메타데이터 · SEO

App Router의 Metadata API로 페이지별 title, description, Open Graph, canonical URL을 서버 렌더링 단계에서 제공했고, sitemap·robots를 `MetadataRoute`로 코드화했습니다.

```ts title="page.tsx"
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    title,
    description,
    url,
    type: "website",
    images: [{ url: ogImageUrl, width: 1200, height: 630 }],
  },
};
```

**효과**: 검색 엔진 크롤링 정책과 공유 미리보기를 서버 렌더링 단계에서 일관되게 제공했습니다.

---

## Before / After

| 항목 | CSR-only (Before) | SSR-first (After) |
|---|---|---|
| 로그인 판별 시점 | hydration 이후 (클라이언트) | 서버 렌더 단계 |
| 초기 화면 깜빡임 | Spinner → 재렌더 발생 | 제거 |
| 보호 페이지 노출 | 순간 노출 후 redirect | 렌더 이전 차단 |
| 초기 데이터 | mount 후 fetch (워터폴) | 서버 선(先)fetch + 스트리밍 |
| access token 위치 | 브라우저 | 서버(HttpOnly 쿠키) + BFF |
| React Query 캐시 | 전역 singleton (오염 위험) | 요청 단위 격리 |

---

## 결과

- **초기 화면 깜빡임 제거** — 서버 redirect로 client spinner/hydration을 제거하고 **First Load JS 약 10~14% 절감**을 확인했습니다.
- **client entry 약 17% 감소** — Server Component shell + Client UI 분리로 client 번들 진입점을 줄였습니다.
- **보호 페이지 오노출 차단** — 미인증/미검증 사용자를 렌더 이전에 서버에서 차단했습니다.
- **토큰 브라우저 비노출** — BFF 계층으로 access token을 서버에만 유지했습니다.
- **캐시 오염 방지** — 인증 상태별 scope 분리 + 요청 단위 QueryClient 격리로 사용자 간 데이터 혼입을 막았습니다.
