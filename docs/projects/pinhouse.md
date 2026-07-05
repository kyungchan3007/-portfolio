---
sidebar_position: 4
title: PinHouse — 맞춤형 주거 탐색 서비스
sidebar_label: PinHouse
---

# 🏠 PinHouse — 맞춤형 주거 탐색 서비스

**2025.10 – 2026.03 · Pinhouse · FE 개발**

PinHouse는 사용자의 핀포인트 위치와 주거 조건을 기반으로 공공/민간 주거 공고를 탐색하고, 조건에 맞는 매물을 비교·검색할 수 있는 맞춤형 주거 탐색 서비스입니다.

AI Agents 기반 코드 검증 워크플로를 도입해 SSR 경계, 인증 라우팅, React Query 캐시 구조의 잠재적 문제를 발굴하고, First Load JS 14% 절감과 렌더링 안정성을 개선할 수 있었고 프로젝트 품질을 높일 수 있었습니다.

## 기술 스택

`Next.js` `TypeScript` `Tailwind CSS` `Zustand` `TanStack Query` `Zod` `Vitest` `Playwright` `Storybook`

---

## 성과 요약

| 발견 항목 | 문제 | 개선 방향 | 결과 |
|---|---|---|---|
| Root 인증 라우팅 | client-side Spinner hydration 후 redirect | 서버 쿠키 기반 `redirect()` 로 전환 | First Load JS **10%+ 절감** |
| Dynamic Route page | `useParams()` 의존으로 route entry가 Client Component | Server Component shell + Client Component UI 분리 | client entry 수 **17% 감소** |
| React Query Provider | 전역 singleton cache로 SSR 요청 간 오염 리스크 | `useState` 기반 provider 인스턴스 단위 생성으로 전환 | SSR cache contamination 리스크 완화 |

---

## AI Agent

기존에는 코드 리뷰 기준이 명문화되어 있지 않아 SSR, 렌더링, 타입 안정성, 인증 흐름을 수동으로 점검해야 했습니다.
AI Agent 기반 코드 검증 워크플로를 도입해 SSR 경계에서 아래 3가지 문제를 발굴하고 개선했습니다.

## SSR 인증/렌더링
아래는 PinHouse에서 직접 발굴하고 개선한 결과입니다. 핵심은 인증 진입과 렌더링 책임을 클라이언트에 남겨두지 않고, 서버에서 먼저 판단하도록 구조를 정리한 점이었습니다. 일반적인 SSR 패턴을 사용했고, 도메인 특성에 맞게 재구성해 적용했습니다.

예시 코드입니다. 일반적인 패턴을 기반으로, 도메인 특성에 맞게 재구성해 적용했습니다.


### 1. Root 인증 라우팅 개선

클라이언트 렌더링 이후에 인증을 판단하지 않고, 서버에서 먼저 세션을 확인한 뒤 진입을 분기하는 패턴으로 정리했습니다.

```tsx title="server-first-auth.tsx"
export default async function EntryPage() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  return <Dashboard />;
}
```

**개선 효과**
- Spinner hydration 및 client-side redirect 제거
- `/` First Load JS **10%+ 감소**

### 2. Dynamic Route의 Client Page 분리

라우트 진입점에서 필요한 값을 먼저 해석하고, UI 상호작용이 필요한 부분만 클라이언트 컴포넌트로 분리하는 패턴을 사용했습니다.

```tsx title="server-shell-pattern.tsx"
export default function RoutePage({ params }: { params: { id: string } }) {
  return <ClientView id={params.id} />;
}
```

**개선 효과**
- Client Component boundary를 UI 영역으로 제한
- client `page.tsx` entry 수 17개 → 14개, 약 **17% 감소**

### 3. React Query Provider 동시성 개선

요청 간 상태가 섞이지 않도록, 데이터 캐시를 전역 공유하지 않고 요청 단위로 분리하는 패턴을 사용했습니다.

```tsx title="request-scoped-provider.tsx"
export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => createQueryClient());
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
```

**개선 효과**
- React Query cache를 provider lifecycle 단위로 격리
- request/user 간 cache contamination 리스크 완화
