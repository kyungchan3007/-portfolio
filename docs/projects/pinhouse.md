---
sidebar_position: 4
title: PinHouse — 맞춤형 주거 탐색 서비스
sidebar_label: PinHouse
---

# PinHouse — 맞춤형 주거 탐색 서비스

**2025.10 – 2026.03 · Pinhouse · FE 개발**

:::info 개요
PinHouse는 사용자의 핀포인트 위치와 주거 조건을 기반으로 공공/민간 주거 공고를 탐색하고, 조건에 맞는 매물을 비교·검색할 수 있는 맞춤형 주거 탐색 서비스입니다.

사용자는 홈 화면에서 개인화된 공고, 추천 매물, 핀포인트 기반 통계, 전역 검색을 확인하고, 공고 목록/상세/비교 페이지에서 조건별 필터링과 매물 비교를 수행할 수 있습니다.

Next.js App Router, React Query, Zustand, BFF API Route 구조를 활용해 SSR 초기 데이터 주입과 클라이언트 상호작용을 함께 처리했습니다.
:::

## 기술 스택

`Next.js` `TypeScript` `Tailwind CSS` `Zustand` `TanStack Query` `Zod` `Vitest` `Playwright` `Storybook`

---

## 성과 요약

| 지표 | Before | After | 계기 |
|---|---|---|---|
| / First Load JS | 194 kB | **166 kB (약 14.4% 절감)** | AI Agents 코드 검증 후 개선 |
| client page.tsx entry 수 | 17개 | **14개 (약 17.6% 감소)** | AI Agents 코드 검증 후 개선 |
| 루트 진입 구조 | client-side redirect | **server redirect로 전환** | AI Agents 코드 검증 후 개선 |
| 초기 진입 UX | Spinner hydration 후 이동 | **브라우저 JS 실행 전 라우팅 결정** | AI Agents 코드 검증 후 개선 |
| React Query cache | 전역 singleton | **provider 인스턴스 단위 격리** | AI Agents 코드 검증 후 개선 |

---

## 담당 기능

### Home 페이지

- 핀포인트 기반 홈 공고 목록, 공고 수, 추천 매물, 핀포인트 목록 초기 데이터 SSR 프리패치 구현
- React Query HydrationBoundary를 활용한 서버 초기 데이터 주입
- 홈 전역 검색, 인기 검색어, 검색 결과 카테고리 조회 기능 구현
- 핀포인트 선택/수정/삭제 및 최대 소요 시간 조건 기반 공고 수 갱신 기능 구현
- 홈 진입 시 채팅 deep link query 처리 및 초기 채팅 상태 연동

### Listings 페이지

- 공고 목록 SSR 프리패치 및 무한 스크롤 구현
- 지역, 임대 유형, 공급 유형, 주택 유형, 정렬, 상태 기반 필터링 구현
- 검색 페이지의 인기 검색어, 검색 결과, 빈 상태/무결과 상태 처리
- 공고 상세 페이지의 단지 요약, 주변 환경, 교통/거리, 타입별 보증금·임대료 정보 표시
- 공고 상세 필터 바, 바텀시트 필터, 조건 외 공고 섹션 구현
- 방 타입 비교 페이지 및 정렬/주변시설 조건 기반 비교 데이터 조회 구현

---

## 주요 개선 작업

### 1. Root 인증 라우팅 개선

기존 루트 `/` 페이지는 `"use client"` 기반으로 Spinner를 먼저 렌더링한 뒤, 클라이언트에서 인증 체크 후 `router.replace()`로 이동했습니다.
이로 인해 첫 진입 시 의미 있는 HTML 없이 Spinner만 SSR되고, 브라우저 JS hydration 이후에야 인증 체크와 redirect가 실행되는 구조였습니다.

```tsx title="app/page.tsx — Before"
"use client";

import { useAuthCheck } from "@/src/entities/auth/hooks/useAuthHook";
import { Spinner } from "@/src/shared/ui/spinner/default";

export default function Home() {
  useAuthCheck();
  return <Spinner />;
}
```

서버 컴포넌트에서 쿠키를 직접 읽고 즉시 `redirect()`를 호출하는 구조로 변경해, 브라우저 JS 실행 전에 라우팅이 결정되도록 개선했습니다.

```tsx title="app/page.tsx — After"
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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

---

### 2. Dynamic Route의 Client Page 분리

`onboarding/[type]`, `_quicksearch/[type]` 등 dynamic route entry 자체가 Client Component로 선언되어 있어, `useParams()`에 의존하는 구조였습니다.

```tsx title="app/onboarding/[type]/page.tsx — Before"
"use client";

import { onboardingContentMap } from "@/src/features/onboarding/model/onboardingContentMap";
import { OnboardingSection } from "@/src/widgets/onboardingSection";
import { useParams } from "next/navigation";

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
import { OnboardingPageClient } from "./onboardingPageClient";

type OnboardingPageProps = {
  params: Promise<{ type: string }>;
};

export default async function OnboardingPage({ params }: OnboardingPageProps) {
  const { type } = await params;
  return <OnboardingPageClient type={type} />;
}
```

```tsx title="app/onboarding/[type]/onboardingPageClient.tsx — After"
"use client";

import { onboardingContentMap } from "@/src/features/onboarding/model/onboardingContentMap";
import { OnboardingSection } from "@/src/widgets/onboardingSection";

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

---

### 3. React Query Provider 동시성 개선

기존에는 모듈 스코프에 전역 `QueryClient` singleton을 생성하고 있었습니다. SSR/동시 렌더링 환경에서는 요청 간 캐시가 공유될 수 있어 사용자별 데이터가 섞일 구조적 위험이 있었습니다.

```tsx title="src/app/providers/queryProvider.tsx — Before"
"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";

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
"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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

---

## AI Agents 기반 코드 검증

기존에는 코드 리뷰 기준이 명문화되어 있지 않아 SSR, 렌더링, 타입 안정성, 인증 흐름을 수동으로 점검해야 했습니다.

`.agents` 디렉터리와 루트 `AGENTS.md`를 도입해 구현/검증/기록 역할을 분리하고, 프롬프트에 따라 필요한 검증 스킬이 자동으로 선택되도록 구성했습니다. `code-review-guard`, `codex-review-workflow`, `next-best-practices`, `vercel-react-best-practices` 기준을 연결해 변경분을 `MERGE: PASS / HOLD` 형태로 검증할 수 있게 만들었습니다.

이를 통해 SSR 경계, React Query 캐시, 인증 리다이렉트, 타입 안정성, 렌더링 성능을 일관된 기준으로 점검하는 리뷰 체계를 구축했습니다.

**도입 후 발견 및 개선 사항**

검증 결과 다음 세 가지 문제를 발견하고 순차적으로 개선했습니다.

| 발견 항목 | 문제 | 개선 방향 |
|---|---|---|
| Root 인증 라우팅 | client-side Spinner hydration 후 redirect | 서버 쿠키 기반 `redirect()` 로 전환 |
| Dynamic Route page | `useParams()` 의존으로 route entry가 Client Component | Server Component shell + Client Component UI 분리 |
| React Query Provider | 전역 singleton cache로 SSR 요청 간 오염 리스크 | `useState` 기반 provider 인스턴스 단위 생성으로 전환 |

**개선 결과**

- `/ First Load JS` **194 kB → 166 kB**, 약 14.4% 절감
- client `page.tsx` entry 수 **17개 → 14개**, 약 17.6% 감소
- 루트 진입 경로의 불필요한 Spinner hydration 및 client-side redirect 제거
- SSR 환경의 사용자 간 cache contamination 리스크 완화
