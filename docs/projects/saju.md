---
sidebar_position: 5
title: SAJU:ME
sidebar_label: SAJU:ME
---

# 🔮 SAJU:ME

**2026.03 – 2026.06 · FE 개발 · 배포**

출생 정보 기반 사주 분석·맞춤 장소 추천 서비스에서, AI의 역할·검증 기준 편차를 줄이는 Skill·Ontology 기반 AI Agent Harness를 설계하고 그 기준을 이후 FMS 개발 프로세스로 확장했습니다.

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

## 맡은 역할

- Skill·Ontology 기반 AI Agent Harness 설계
- Claude와 Codex의 역할 분리 기준 정리
- 작업 유형별 검증 체크리스트와 평가 구조 설계
- 배포 전 검증 · 재사용 UI · 워크스페이스 구조 · Edge 배포까지 구현

---

## 핵심 문제 — 역할·검증 기준 없는 AI의 편차

역할과 검증 기준이 고정되지 않으면 UX 판단·비즈니스 로직·리뷰 문맥이 한 흐름에 섞여, 결과 편차와 재작업 비용이 커집니다.

- 같은 문맥에서 구현·검증이 동시에 일어나 재현성이 떨어짐
- 좋은 결과가 나와도 기준이 없어 프롬프트 재작성·수동 되돌림 반복

---

## 1. Skill·Ontology 기반 AI Agent Harness — 구현·검증 문맥 분리

도메인 개념·관계·검증 규칙을 Ontology로 구조화하고 Skill·단계별 컨텍스트를 연결해, 구현→검증→리뷰→배포 4단계 Workflow를 만들었습니다.

- **문제** — 같은 문맥에서 구현과 검증이 동시에 일어나면 결과 편차가 크고 재현성 저하
- **적용** — Claude(UX/UI 구현) / Codex(로직·API 검증·리뷰) 역할 분리, Ontology로 도메인·검증 규칙 구조화, Skill로 단계별 컨텍스트 연결
- **성과** — 구현·검증 문맥 분리, 재작업 감소

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

## 2. prompt-trigger-eval 평가 구조 — 검증 충족률 95%

"좋아 보인다"는 인상 대신, 작업 유형별 체크리스트를 자동 실행해 재현 가능한 기준으로 검증했습니다.

- **문제** — 좋은 결과가 나와도 재현 가능한 기준이 없어 품질 확인이 일관되지 않음
- **적용** — `prompt-trigger-eval` Skill로 작업 유형별 체크리스트 자동 실행(요구사항 충족·도메인 규칙·품질 기준 확인), AI 구현 결과 100건 평가
- **성과** — 100건 중 95건 1차 검증 통과, 검증 기준 충족률 95%

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

## 3. 재사용 UI·모노레포 구축 — 웹·관리자 UI 재사용 구조 확보

디자인 프로토타입을 React·TypeScript 컴포넌트로 재구현하고, npm Workspaces로 패키지 책임을 분리했습니다.

- **문제** — 화면별 개별 구현으로 공통 UI가 중복되고, 확장 시 패키지 간 책임·의존 관계가 복잡해질 위험
- **적용** — 프로토타입을 HTML·CSS에서 React·TS 컴포넌트로 재구현, npm Workspaces로 `web`·`admin`·`ui`·`design-tokens` 책임 분리, 공통 UI·디자인 기준을 `ui`·`design-tokens`로 관리
- **성과** — 공통 UI·디자인 기준을 별도 패키지로 관리해 웹·관리자 화면에서 재사용 가능한 구조 확보

---

## 4. Edge 서버리스 배포 — Cold Start·운영 부담 최소화

OpenNext로 Next.js를 Cloudflare Workers에 배포하고, Node.js 의존 기능을 Edge Runtime에 맞게 조정했습니다.

- **문제** — 서버리스 배포 시 Node.js 의존 기능의 Edge Runtime 비호환과 초기 응답 지연
- **적용** — OpenNext 기반 Cloudflare Workers 배포, Node.js 의존 기능을 Edge Runtime에 맞게 조정
- **성과** — 서버 인스턴스 운영 부담·Cold Start 영향 최소화, 사용자와 가까운 Edge에서 콘텐츠 제공

---

## 5. 첫 화면 성능 최적화 — LCP 820ms → 404ms

배포까지 직접 진행한 프로젝트라, 점수가 아니라 병목을 분해해 특정한 뒤 원인별로 대응했습니다.

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

전체 네트워크 페이로드 약 **6,172KiB**, 진단은 렌더링 차단 요청(약 720ms)·이미지 전송(약 2,061KiB)·비효율 캐시 수명(약 3,835KiB)·unused JS·CSS(약 51–56KiB / 38KiB)를 절감 항목으로 지목했습니다. 여기서 멈추지 않고 개선 전 LCP를 구성 단계별로 분해했습니다.

| LCP 구성 단계 | 개선 전 |
| --- | --- |
| TTFB | 약 10ms |
| resource load delay | 약 70ms |
| resource load time | 약 80ms |
| **element render delay** | **약 1,170ms** |

LCP 대부분이 **element render delay**에 몰려 있었고, attribution으로 확인한 LCP 대상도 이미지가 아니라 **텍스트 블록**이었습니다. 이 분해가 곧 대응 우선순위가 됐습니다.

### 적용

- 홈·프리뷰 주요 이미지 PNG를 **WebP로 교체**, 히어로 이미지를 **모바일/데스크톱 분기 자산**으로 분리
- LCP 후보 이미지에 **우선 로드**(`priority`, `fetchPriority="high"`, `loading="eager"`)
- 전역 레이아웃의 **AdSense 스크립트 전역 주입 제거** → 광고 슬롯 렌더 시점에만 `lazyOnload` 로드
- 홈 하단 마케팅 섹션에 **`content-visibility: auto`**
- `/preview/...` 프리뷰 라우트를 **SSG(`force-static`)로 전환**
- 전역 Provider 범위·공통 번들 구조 재구성으로 **공통 CSS·JS 비용 축소**

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
