---
sidebar_position: 5
title: SAJU:ME
sidebar_label: SAJU:ME
---

# 🔮 SAJU:ME

**2026.03 – 2026.06 · FE 개발 · 배포**

사용자의 출생 정보로 사주를 분석하고, 일일 에너지를 기반으로 맞춤형 장소를 추천하는 한국식 운세 추천 서비스입니다.
<br/>이 프로젝트에서는 AI가 역할과 검증 기준 없이 일할 때 생기는 편차를 줄이기 위해 Skill·Ontology 기반 AI Agent Harness를 설계했고, 그 기준을 이후 FMS 개발 프로세스로 확장했습니다.

## 기술 스택

`Next.js 15` `TypeScript` `Claude` `Codex` `Skill` `Ontology` `OpenAPI` `Zod` `Playwright` `Storybook` `Cloudflare`

---

## 성과 요약

| 항목 | 문제 | 적용 | 결과 |
|---|---|---|---|
| AI 역할 분리 | UX 판단, 비즈니스 로직, 리뷰 문맥이 한 흐름에 섞여 결과 편차 발생 | Claude와 Codex 역할 분리, Skill·Ontology 연결 | 구현·검증 문맥 분리와 재작업 감소 |
| 평가 구조 | 작업 유형별 품질 기준을 일관되게 확인하기 어려움 | `prompt-trigger-eval` 기반 체크리스트 자동 실행 | AI 구현 결과 **100건 중 95건** 1차 검증 통과 |
| 검증 기준 정착 | 좋은 결과가 나와도 재현 가능한 기준이 부족함 | 4단계 Workflow와 문서화 기준 정리 | 검증 기준 충족률 **95%** 달성 |
| 첫 화면 성능 | 이미지·전역 스크립트·공통 번들이 초기 로드 경로를 함께 무겁게 만듦 | LCP 분해로 병목 분류 후 원인별 대응, 공통 번들 재구성 | LCP **820ms → 404ms**, 공통 앱 JS **약 22.4% 감소** |
| 현업 확산 | 프로젝트 안에서만 끝나면 재사용 가치가 낮음 | Harness·평가 구조를 FMS에 확장 | 팀 공통 AI Workflow로 정착 |

---

## 이 프로젝트에서 맡은 역할

- Skill·Ontology 기반 AI Agent Harness 설계
- Claude와 Codex의 역할 분리 기준 정리
- 작업 유형별 검증 체크리스트와 평가 구조 설계
- 배포 전 검증, 재사용 UI, 워크스페이스 구조, Edge 배포까지 구현

---

## 핵심 문제

AI를 개발에 쓰기 시작하면 속도는 빨라질 수 있지만, 역할과 검증 기준이 고정되어 있지 않으면 UX 판단, 비즈니스 로직, 리뷰 문맥이 한 흐름에 섞이게 됩니다. 그러면 결과 편차가 커지고, 결국 프롬프트를 다시 쓰거나 사람이 직접 되돌리는 비용이 늘어납니다.

SAJU:ME에서는 이 문제를 피하지 않고, **어떻게 하면 AI가 같은 기준으로 구현하고 검증하도록 만들 수 있는지**를 구조적으로 정리했습니다.

---

## 1. Skill · Ontology 기반 AI Agent Harness

SAJU:ME에서는 도메인 개념, 관계, 검증 규칙을 Ontology로 구조화하고, Skill과 단계별 컨텍스트를 연결해 구현·검증·리뷰·배포의 4단계 Workflow를 만들었습니다.

### 역할 분리

- Claude: UX/UI 구현과 디자인 반영
- Codex: 비즈니스 로직·API 검증과 리뷰

이렇게 역할을 나눈 이유는, 같은 문맥에서 구현과 검증이 동시에 일어나면 좋은 결과가 나와도 편차가 크고 재현성이 떨어지기 때문이었습니다.

```ts title="domain.ts"
// 설명용 예시: 실제 Skill 설정 파일이 아님
const 워크플로우 = {
  implement: {
    role: 'ui-agent',
    context: ['requirements', 'ui-guides'],
  },
  verify: {
    role: 'review-agent',
    checks: ['domain-rule', 'api-contract', 'quality-gate'],
  },
  release: {
    requires: ['smoke-test', 'deploy-check'],
  },
}
```

---

## 2. prompt-trigger-eval 기반 평가 구조

좋은 결과가 나왔다는 인상만으로는 기준이 되기 어렵습니다. 그래서 SAJU:ME에서는 작업 유형별 검증 체크리스트가 자동으로 실행되도록 평가 구조를 붙였습니다.

### 평가 방식

- `prompt-trigger-eval` Skill로 작업 유형별 체크리스트 자동 실행
- 요구사항 충족 여부, 도메인 규칙 준수, 품질 기준 충족 여부 확인
- AI 구현 결과 100건 평가

### 결과

- 95건이 1차 검증 체크리스트 통과
- 검증 기준 충족률 95%

```ts title="domain.ts"
// 설명용 예시: 실제 평가 결과 형식이 아님
const 평가결과 = {
  trigger: 'implementation-complete',
  checks: [
    'requirement-match',
    'domain-rule',
    'api-contract',
    'ui-consistency',
  ],
  passWhen: 'all-required-checks-pass',
}
```

---

## 3. React·TypeScript 기반 재사용 UI 및 npm Workspaces 모노레포 구축

디자인 프로토타입을 화면별로 그대로 구현하면 공통 UI가 화면마다 중복되고, 프로젝트가 커질수록 패키지 간 책임과 의존 관계가 복잡해질 가능성이 있었습니다.

### 문제

디자인 프로토타입을 화면별로 개별 구현하면서 공통 UI 컴포넌트가 중복되고, 프로젝트 확장에 따라 패키지 간 책임과 의존 관계가 복잡해질 위험이 있었습니다.

### 적용

- 디자인 프로토타입을 HTML·CSS 기반에서 React·TypeScript 컴포넌트로 재구현
- npm Workspaces 기반으로 `web`·`admin`·`ui`·`design-tokens` 패키지 책임 분리
- 공통 UI 컴포넌트와 디자인 기준을 `ui`·`design-tokens` 패키지로 분리 관리

### 결과

- 공통 UI 컴포넌트와 디자인 기준을 별도 패키지로 관리해 웹·관리자 화면에서 재사용 가능한 구조 확보

---

## 4. OpenNext·Cloudflare Workers 기반 Edge 서버리스 배포

Next.js 애플리케이션을 서버리스 환경에 배포하는 과정에서 Node.js 의존 기능의 Edge Runtime 호환성과 초기 응답 지연 문제가 있었습니다.

### 문제

Next.js를 서버리스 환경에 배포할 때 Node.js 의존 기능이 Edge Runtime과 호환되지 않는 지점이 있었고, 초기 응답 지연 문제도 함께 발생했습니다.

### 적용

- OpenNext 기반으로 Next.js 애플리케이션을 Cloudflare Workers에 배포
- Node.js 의존 기능을 Edge Runtime에 맞게 조정

### 결과

- 서버 인스턴스 운영 부담과 Cold Start 영향 최소화
- 사용자와 가까운 Edge 환경에서 콘텐츠 제공

---

## 5. 첫 화면 로딩 성능 최적화

직접 배포까지 진행한 프로젝트라 성능 측정과 최적화 절차를 처음부터 끝까지 직접 정리했습니다. 점수를 올리는 데 매달리지 않고 **병목을 분해해 특정한 뒤** 원인별로 대응했습니다.

### 실측 성과 — 공통 번들 (빌드 산출물 기준)

| 대상 | 개선 전 | 개선 후 | 감소량 | 감소율 |
| --- | --- | --- | --- | --- |
| 공통 앱 JS | 123,193B (123.2KB) | 95,577B (95.6KB) | 27,616B | **약 22.4%** |
| 공통 CSS 청크 | 73,477B (73.5KB) | 69,130B (69.1KB) | 4,347B | **약 5.9%** |

### 실측 성과 — 지표 (web-vitals 콘솔)

| 지표 | 값 | 기준 |
| --- | --- | --- |
| TTFB | 37.2ms | 0.8s 이하 |
| FCP | 92ms | 1.8s 이하 |
| LCP | 92ms | 2.5s 이하 |
| INP | 24ms | 0.2s 이하 |

### 병목 분해 — 진단 목록이 아니라 원인으로

전체 네트워크 페이로드는 약 **6,172KiB**였고, 진단은 렌더링 차단 요청(약 720ms), 이미지 전송(약 2,061KiB), 비효율 캐시 수명(약 3,835KiB), unused JS·CSS(약 51–56KiB / 38KiB)를 절감 항목으로 지목했습니다.

여기서 멈추지 않고 **개선 전 LCP를 구성 단계별로 분해**했습니다.

| LCP 구성 단계 | 개선 전 |
| --- | --- |
| TTFB | 약 10ms |
| resource load delay | 약 70ms |
| resource load time | 약 80ms |
| **element render delay** | **약 1,170ms** |

LCP의 대부분이 **element render delay**에 몰려 있었습니다. 이미지를 더 빨리 받는 문제가 아니라 **요소가 렌더되기까지의 지연**이 병목이었고, attribution으로 확인한 LCP 대상도 이미지가 아니라 **텍스트 블록**이었습니다. 이 분해가 곧 대응 우선순위가 됐습니다.

### 적용

- 홈·프리뷰 주요 이미지 PNG를 **WebP로 교체**하고, 히어로 이미지를 **모바일/데스크톱 분기 자산**으로 분리
- LCP 후보 이미지에 **우선 로드**(`priority`, `fetchPriority="high"`, `loading="eager"`) 설정
- 전역 레이아웃의 **AdSense 스크립트 전역 주입 제거** → 광고 슬롯이 실제 렌더될 때만 로드하고 `lazyOnload` 적용
- 홈 하단 마케팅 섹션에 **`content-visibility: auto`** 적용
- `/preview/...` 프리뷰 라우트를 **SSG(`force-static`)로 전환**
- 전역 Provider 범위와 공통 번들 구조를 재구성해 모든 페이지가 함께 지불하던 **공통 CSS·JS 비용 축소**

```domain.tsx
// LCP 후보인 히어로 이미지만 우선 로드로 승격
<Image
  src={"화면 폭에 맞춰 고른 WebP 자산"}
  alt={"히어로 대표 이미지"}
  priority          // next/image: preload + fetchPriority=high
  fetchPriority="high"
  loading="eager"
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

---


