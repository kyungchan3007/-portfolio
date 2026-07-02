---
sidebar_position: 4
title: PinHouse — 맞춤형 주거 탐색 서비스
sidebar_label: PinHouse
---

# 🏠 PinHouse — 맞춤형 주거 탐색 서비스

**2025.10 – 2026.03 · Pinhouse · FE 개발**

PinHouse는 사용자의 핀포인트 위치와 주거 조건을 기반으로 공공/민간 주거 공고를 탐색하고, 조건에 맞는 매물을 비교·검색할 수 있는 맞춤형 주거 탐색 서비스입니다.

AI Agents 기반 코드 검증 워크플로를 도입해 SSR 경계, 인증 라우팅, React Query 캐시 구조의 잠재적 문제를 발굴하고, First Load JS 14.4% 절감과 렌더링 안정성을 개선할 수 있었고 프로젝트 품질을 높일 수 있었습니다.

## 기술 스택

`Next.js` `TypeScript` `Tailwind CSS` `Zustand` `TanStack Query` `Zod` `Vitest` `Playwright` `Storybook`

---

## 성과 요약

| 발견 항목 | 문제 | 개선 방향 | 결과 |
|---|---|---|---|
| Root 인증 라우팅 | client-side Spinner hydration 후 redirect | 서버 쿠키 기반 `redirect()` 로 전환 | First Load JS **10%+ 절감** |
| Dynamic Route page | `useParams()` 의존으로 route entry가 Client Component | Server Component shell + Client Component UI 분리 | client entry 수 **17.6% 감소** |
| React Query Provider | 전역 singleton cache로 SSR 요청 간 오염 리스크 | `useState` 기반 provider 인스턴스 단위 생성으로 전환 | SSR cache contamination 리스크 완화 |

---

## AI Agent

기존에는 코드 리뷰 기준이 명문화되어 있지 않아 SSR, 렌더링, 타입 안정성, 인증 흐름을 수동으로 점검해야 했습니다.
AI Agent 기반 코드 검증 워크플로를 도입해 SSR 경계에서 아래 3가지 문제를 발굴하고 개선했습니다.

## SSR 인증/렌더링
아래는 PinHouse에서 직접 발굴하고 개선한 결과입니다. 여기에 공통으로 적용한 SSR 패턴과 코드는 [SSR 인증/렌더링 구조](../architecture/ssr-auth-rendering.md)에 따로 정리해 두었으니, 함께 봐주시면 감사하겠습니다.


### 1. Root 인증 라우팅 개선

`"use client"` 기반으로 Spinner를 먼저 렌더링한 뒤 클라이언트에서 인증 체크 후 `router.replace()`로 이동하던 구조를, 서버 컴포넌트에서 쿠키를 직접 읽고 즉시 `redirect()`를 호출하는 구조로 전환했습니다.

**개선 효과**
- Spinner hydration 및 client-side redirect 제거
- `/` First Load JS **10%+ 감소**

### 2. Dynamic Route의 Client Page 분리

`useParams()`에 의존해 dynamic route entry 자체가 Client Component였던 구조를, route entry는 Server Component shell로 두고 `params`를 서버에서 해석한 뒤 UI 로직만 Client Component로 분리했습니다.

**개선 효과**
- Client Component boundary를 UI 영역으로 제한
- client `page.tsx` entry 수 17개 → 14개, 약 **17.6% 감소**

### 3. React Query Provider 동시성 개선

모듈 스코프에 전역 `QueryClient` singleton을 두어 SSR/동시 렌더링 환경에서 요청 간 캐시가 섞일 위험이 있던 구조를, `useState` 기반 요청 단위 인스턴스 생성으로 전환했습니다.

**개선 효과**
- React Query cache를 provider lifecycle 단위로 격리
- request/user 간 cache contamination 리스크 완화
