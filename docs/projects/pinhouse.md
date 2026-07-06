---
sidebar_position: 4
title: PinHouse — 맞춤형 주거 탐색 서비스
sidebar_label: PinHouse
---

# 🏠 PinHouse — 맞춤형 주거 탐색 서비스

**2025.10 – 2026.03 · Pinhouse · FE 개발**

PinHouse는 사용자의 핀포인트 위치와 주거 조건을 기반으로 공공/민간 주거 공고를 탐색하고, 조건에 맞는 매물을 비교·검색할 수 있는 맞춤형 주거 탐색 서비스입니다.

SSR 경계, 인증 라우팅, React Query 캐시 구조의 잠재적 문제를 발굴하고, First Load JS 14% 절감과 렌더링 안정성을 개선할 수 있었고 프로젝트 품질을 높일 수 있었습니다.

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

## 사이드 프로젝트로서의 PinHouse

PinHouse는 실제 서비스로 함께 만든 프로젝트이면서, 제가 약하다고 느끼던 영역을 실제 제품에서 정면으로 파고든 자리였습니다.

제가 특히 확신이 부족했던 부분은 **SSR과 정적 렌더링, 아키텍처 설계**였습니다. 그동안 감으로만 다뤄 왔던 영역이라, PinHouse에서 이 부분들을 의도적으로 깊게 붙잡았습니다. SSR과 정적 렌더링은 특정 한 화면이 아니라, 조회량이 많은 주택 목록·필터별 조회·검색처럼 데이터가 무거운 화면부터 프로젝트에 필요한 정적 페이지, 그리고 챗봇까지 화면 성격에 따라 어디에 어떤 렌더링을 적용할지 판단하는 기준을 세우는 과정이었습니다. 백엔드 API를 사용하는 화면에서도 데이터 요청 시점과 렌더링 책임을 함께 정리하면서, 화면별로 서버에서 먼저 처리할 것과 클라이언트에 남길 것을 구분했습니다. 여기에 인증 진입을 서버로 옮기고(SSR 인증/렌더링) 폼 로직을 설정 기반 구조로 빼는 작업까지 더하면서, 막연히 어렵던 이 주제들을 제 강점이라고 말할 수 있는 수준까지 끌어올렸습니다. 여기서 세운 판단 기준은 이후 현업 여러 프로젝트에서 품질을 끌어올리는 밑바탕이 되었습니다.

아래 세 가지는 그 과정에서 특히 배움이 컸던 부분입니다.

### 1. SSR 인증/렌더링

아래는 PinHouse에서 직접 발굴하고 개선한 결과입니다. 핵심은 인증 진입과 렌더링 책임을 클라이언트에 남겨두지 않고, 서버에서 먼저 판단하도록 구조를 정리한 점이었습니다. 일반적인 SSR 패턴을 사용했고, 도메인 특성에 맞게 재구성해 적용했습니다.

예시 코드입니다. 일반적인 패턴을 기반으로, 도메인 특성에 맞게 재구성해 적용했습니다.

#### 1. Root 인증 라우팅 개선

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

#### 2. Dynamic Route의 Client Page 분리

라우트 진입점에서 필요한 값을 먼저 해석하고, UI 상호작용이 필요한 부분만 클라이언트 컴포넌트로 분리하는 패턴을 사용했습니다.

```tsx title="server-shell-pattern.tsx"
export default function RoutePage({ params }: { params: { id: string } }) {
  return <ClientView id={params.id} />;
}
```

**개선 효과**
- Client Component boundary를 UI 영역으로 제한
- client `page.tsx` entry 수 17개 → 14개, 약 **17% 감소**

#### 3. React Query Provider 동시성 개선

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

### 2. AI 챗봇 — 프롬프트 룰 엔진과 구조화된 응답

주거 공고를 자연어로 물어보면 답과 함께 매물 검색으로 이어주는 챗봇을 붙이면서 두 가지를 실험했습니다.

먼저 **프롬프트 규칙을 화면 코드에 흩뿌리지 않고 별도 패키지로 분리해 npm에 배포**했습니다. 규칙을 버전으로 관리하고 재사용할 수 있게 되면서, "프롬프트도 관리 대상"이라는 관점을 갖게 됐습니다.

다음으로 **LLM 응답을 자유 텍스트가 아니라 구조화된 형태로 강제**했습니다. 답변은 `summary`, 필요할 때만 `followUpQuestion`, 매물 카테고리일 때만 지역별 `ctas`로 나눠 받도록 규칙을 세워, 화면에서 답변을 안정적으로 파싱하고 검색 버튼을 자동으로 만들 수 있었습니다.

예시 코드입니다. 일반적인 패턴을 기반으로, 도메인 특성에 맞게 재구성해 적용했습니다.

```ts title="chatResponse.ts"
type ChatResponse = {
  summary: string;            // 핵심 답변
  followUpQuestion?: string;  // 필요할 때만
  ctas?: Array<{              // 매물 카테고리일 때만 지역별 생성
    label: string;
    action: "open_listing";
    keyword?: string;
  }>;
};
```

이 실험으로 LLM을 제품에 붙일 때 **출력 신뢰성**을 어떻게 확보하는지 체득했습니다. 제가 약했던 부분이었고, 사이드에서 먼저 부딪혀 본 덕분에 현업에서도 자신 있게 다룰 수 있게 됐습니다.

### 3. 주거 자격 진단 — 설정 기반 동적 폼

자격 진단은 답에 따라 다음 질문이 갈라지는 흐름이라, 화면마다 조건을 하드코딩하면 유지보수가 빠르게 무너질 구조였습니다. 그래서 **단계와 컴포넌트를 코드가 아니라 "설정 데이터"로 정의하고, 렌더러가 그 설정을 해석해 폼을 그리는** 방식으로 풀었습니다.

각 컴포넌트 설정은 타입·props와 함께 조건부 표시(`showWhen`)·비활성화(`disabledWhen`), 하위 질문(`children`), 상태 연결(`storeKey`)을 데이터로 갖고, 렌더러는 이를 읽어 동적으로 화면을 구성합니다.

예시 코드입니다. 일반적인 패턴을 기반으로, 도메인 특성에 맞게 재구성해 적용했습니다.

```ts title="componentConfig.ts"
interface ComponentConfig {
  type: ComponentType;                        // 어떤 입력 컴포넌트인지
  props: Record<string, unknown>;
  showWhen?: (data: FormData) => boolean;     // 조건부 표시
  disabledWhen?: (data: FormData) => boolean; // 조건부 비활성화
  children?: ComponentConfig[];               // 조건부 하위 질문
  storeKey?: string;                          // 상태와 자동 연결
}
```

이 "로직을 설정으로 빼는" 접근은 현업에서 데이터 보정 로직을 규칙 기반으로 분리했던 경험과 같은 결이었습니다. 사이드에서 다른 도메인에 한 번 더 적용해 보며 그 패턴에 대한 확신을 얻었고, 현업 여러 프로젝트에서 설정 기반 구조를 다룰 때 근거가 되었습니다.
