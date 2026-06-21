---
sidebar_position: 4
title: PinHouse — 맞춤형 주거 탐색 서비스
sidebar_label: PinHouse
---

# PinHouse — 맞춤형 주거 탐색 서비스

**2025.10 – 2026.03 · Pinhouse · FE 개발**

PinHouse는 사용자의 핀포인트 위치와 주거 조건을 기반으로 공공/민간 주거 공고를 탐색하고, 조건에 맞는 매물을 비교·검색할 수 있는 맞춤형 주거 탐색 서비스입니다.

AI Agents 기반 코드 검증 워크플로를 도입해 SSR 경계, 인증 라우팅, React Query 캐시 구조의 잠재적 문제를 발굴하고, First Load JS 14.4% 절감과 렌더링 안정성을 개선할 수 있었고 프로젝트 품질을 높일 수 있었습니다.

## 기술 스택

`Next.js` `TypeScript` `Tailwind CSS` `Zustand` `TanStack Query` `Zod` `Vitest` `Playwright` `Storybook`

---

## 성과 요약

| 발견 항목 | 문제 | 개선 방향 | 결과 |
|---|---|---|---|
| Root 인증 라우팅 | client-side Spinner hydration 후 redirect | 서버 쿠키 기반 `redirect()` 로 전환 | First Load JS **14.4% 절감** |
| Dynamic Route page | `useParams()` 의존으로 route entry가 Client Component | Server Component shell + Client Component UI 분리 | client entry 수 **17.6% 감소** |
| React Query Provider | 전역 singleton cache로 SSR 요청 간 오염 리스크 | `useState` 기반 provider 인스턴스 단위 생성으로 전환 | SSR cache contamination 리스크 완화 |

---

## AI Agent

기존에는 코드 리뷰 기준이 명문화되어 있지 않아 SSR, 렌더링, 타입 안정성, 인증 흐름을 수동으로 점검해야 했습니다.
AI Agent 기반 코드 검증 워크플로를 도입해 아래 3가지 문제를 발굴하고 개선했습니다.

### 1. Root 인증 라우팅 개선

기존 루트 `/` 페이지는 `"use client"` 기반으로 Spinner를 먼저 렌더링한 뒤, 클라이언트에서 인증 체크 후 `router.replace()`로 이동했습니다.
이로 인해 첫 진입 시 의미 있는 HTML 없이 Spinner만 SSR되고, 브라우저 JS hydration 이후에야 인증 체크와 redirect가 실행되는 구조였습니다.

```tsx title="app/page.tsx — Before"
export default function Home() {
  useAuthCheck();
  return <Spinner />;
}
```

서버 컴포넌트에서 쿠키를 직접 읽고 즉시 `redirect()`를 호출하는 구조로 변경해, 브라우저 JS 실행 전에 라우팅이 결정되도록 개선했습니다.

```tsx title="app/page.tsx — After"
export default async function Home() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const isAuth = cookieStore.get("is_auth")?.value === "true";

  redirect(accessToken || isAuth ? "/home" : "/login");
}
```

**개선 효과**
- 인증 분기를 서버에서 처리해 Spinner hydration 및 client-side redirect 제거
- `/ First Load JS` 194 kB → 166 kB, 약 **14.4% 감소**

### 2. Dynamic Route의 Client Page 분리

`onboarding/[type]`, `_quicksearch/[type]` 등 dynamic route entry 자체가 Client Component로 선언되어 있어, `useParams()`에 의존하는 구조였습니다.

```tsx title="app/onboarding/[type]/page.tsx — Before"
export default function OnboardingPage() {
  const { type } = useParams() as { type: string };
  const content = onboardingContentMap[type as keyof typeof onboardingContentMap];

  if (!content) return <div>잘못된 접근입니다.</div>;

  const { Icon, title, description } = content;

  return (
    <main className="flex h-full flex-col">
      <OnboardingSection image={<Icon />} title={title} description={description} type={type} />
    </main>
  );
}
```

route entry는 Server Component로 두고 `params`를 서버에서 해석한 뒤, UI 로직만 Client Component로 분리했습니다.

```tsx title="app/onboarding/[type]/page.tsx — After"
type OnboardingPageProps = {
  params: Promise<{ type: string }>;
};

export default async function OnboardingPage({ params }: OnboardingPageProps) {
  const { type } = await params;
  return <OnboardingPageClient type={type} />;
}
```

```tsx title="app/onboarding/[type]/onboardingPageClient.tsx — After"
type OnboardingPageClientProps = {
  type: string;
};

export function OnboardingPageClient({ type }: OnboardingPageClientProps) {
  const content = onboardingContentMap[type as keyof typeof onboardingContentMap];

  if (!content) return <div>잘못된 접근입니다.</div>;

  const { Icon, title, description } = content;

  return (
    <main className="flex h-full flex-col">
      <OnboardingSection image={<Icon />} title={title} description={description} type={type} />
    </main>
  );
}
```

**개선 효과**
- `useParams()` 의존을 route entry에서 제거하고 Client Component boundary를 UI 영역으로 제한
- client `page.tsx` entry 수 17개 → 14개, 약 **17.6% 감소**
- SSR 구조에 맞게 page 역할과 interactive UI 역할 분리

### 3. React Query Provider 동시성 개선

기존에는 모듈 스코프에 전역 `QueryClient` singleton을 생성하고 있었습니다. SSR/동시 렌더링 환경에서는 요청 간 캐시가 공유될 수 있어 사용자별 데이터가 섞일 구조적 위험이 있었습니다.

```tsx title="src/app/providers/queryProvider.tsx — Before"
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 2,
      refetchOnWindowFocus: false,
    },
    mutations: { retry: 2 },
  },
});

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
```

`useState`를 활용해 Provider 인스턴스별로 `QueryClient`를 생성하는 구조로 변경했습니다.

```tsx title="src/app/providers/queryProvider.tsx — After"
interface QueryProviderProps {
  children: React.ReactNode;
}

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 2,
        refetchOnWindowFocus: false,
      },
      mutations: { retry: 2 },
    },
  });

export const QueryProvider = ({ children }: QueryProviderProps) => {
  const [queryClient] = useState(createQueryClient);
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
```

**개선 효과**
- React Query cache를 provider lifecycle 단위로 격리
- SSR 환경에서 request/user 간 cache contamination 리스크 감소
- hydration 구조와 React Query 권장 패턴에 맞는 구조로 개선
