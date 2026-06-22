---
sidebar_position: 2
title: 하네스 엔지니어링 — AGENTS.md · SKILL.md
sidebar_label: 하네스 엔지니어링
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 하네스 엔지니어링

---

단순 자연어 프롬프트 방식으로 AI Agent를 사용하면:
- 컨텍스트가 누적될수록 Agent가 이전 지시와 충돌하는 결과를 냄
- 도메인 무관 정보가 혼재해 의도를 오해하고 재작업 반복
- 검증·수정 시간이 구현 시간을 초과

---

## 하네스 엔지니어링이란?

Agent가 **어떻게 행동해야 하는지**를 문서로 명세해,
프롬프트가 아닌 **구조화된 환경(하네스)**으로 Agent를 제어하는 방식입니다.

```
단순 프롬프트 방식:
  "이 기능 만들어줘" → Agent가 매번 다르게 해석

하네스 엔지니어링:
  AGENTS.md: "너는 이런 역할이고, 이것만 해야 해"
  SKILL.md:  "이 도메인에서는 이 기준을 참조해"
  → Agent 행동 범위가 고정됨
```

---

## AGENTS.md — Agent 행동 범위 명세

```markdown title="AGENTS.md (예시)"
# Agent 행동 규칙

## 역할
UI 구현 Agent다.
UI 컴포넌트 작성과 레이아웃 구성만 담당한다.

## 허용 행동
- Tailwind CSS 클래스를 사용한 컴포넌트 구현
- shadcn/ui 컴포넌트 활용
- 반응형 레이아웃 구성
- 접근성(aria-*) 속성 추가

## 금지 행동
- API 호출 코드 작성 (useQuery, fetch, axios)
- 비즈니스 로직 작성 (계산, 변환, 필터링)
- Zustand 스토어 수정
- Zod 스키마 정의

## 출력 형식
- 파일 단위로 출력
- import 경로는 @/ 절대경로 사용
- props 타입은 명시적으로 선언

## 컨텍스트 경계
- 현재 작업 도메인: {DOMAIN}
- 참조 SKILL: {SKILL_LIST}
- 수정 대상 파일만 출력 (관련 없는 파일 수정 금지)
```

---

## SKILL.md — 도메인별 참조 문서

```markdown title="skills/domain-a.md (예시)"
# Domain A SKILL

## 데이터 모델
\`\`\`ts
type Entity = {
  id: string;
  entityId: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  scheduledAt: string;
  completedAt: string | null;
}
\`\`\`

## API 엔드포인트
- GET  /api/domain-a       — 목록 조회
- GET  /api/domain-a/:id   — 상세 조회
- POST /api/domain-a       — 생성
- PATCH /api/domain-a/:id  — 상태 변경

## UI 컴포넌트 목록
- EntityList: 목록 테이블
- EntityDetail: 상세 모달
- EntityStatusBadge: 상태 배지

## 비즈니스 규칙
- completed 상태에서는 수정 불가
- scheduledAt이 과거면 pending → failed 자동 전환
- assignee는 현재 로그인 사용자로 자동 설정
```

---

## 3계층 온톨로지 구조

복잡한 도메인에서 Agent 컨텍스트 소비를 최소화하기 위해
참조 파일을 3계층으로 분리합니다.

```
skills/
├── 00-project-overview.md       ← 대도메인: 프로젝트 전체 개요
│
├── domain-a/                    ← 소도메인 A
│   ├── 00-domain-a-overview.md
│   ├── entity-list.md           ← 기능: 목록
│   ├── entity-detail.md         ← 기능: 상세
│   └── entity-status.md         ← 기능: 상태
│
├── domain-b/                    ← 소도메인 B
│   ├── 00-domain-b-overview.md
│   ├── monitoring.md
│   └── analysis.md
│
└── shared/                      ← 공통
    ├── auth.md
    ├── ui-conventions.md
    └── api-conventions.md
```

**기능 개발 시 로드 순서:**
```
Domain A 목록 기능 개발 →
  skills/00-project-overview.md (대도메인)
  skills/domain-a/00-domain-a-overview.md (소도메인)
  skills/domain-a/entity-list.md (기능)
  — 나머지 파일은 로드 안 함 → 컨텍스트 최소화
```

---

## 프로젝트 적용 사례

FMS, BEMS, 원격 제어 시스템, SAJU:ME, PinHouse 등 포트폴리오에 포함된 프로젝트 전반에서
AI Agent가 활용할 수 있는 프로젝트별 스킬을 체계화했습니다.
각 도메인의 코딩 규칙, 아키텍처, 참고 자료를 명문화해 AI Agent의 맥락 인식을 개선했습니다.

<Tabs>
<TabItem value="before" label="Before — 문맥 부재">

```
개발자: "로그인 화면 구현해줘"
AI Agent: 프로젝트 구조를 모르고 일반적인 코드 생성
→ 아키텍처 불일치, 재작업 반복
```

</TabItem>
<TabItem value="after" label="After — 스킬 기반 맥락">

```
.agents/skills/{project-domain}/
├── SKILL.md                    ← 프로젝트 규칙·아키텍처 정의
├── references/
│   ├── fsd-architecture.md     ← FSD 레이어 구조
│   ├── auth-flow.md            ← 인증 흐름
│   ├── api-integration.md      ← API 통합 패턴
│   └── testing-strategy.md     ← 테스트 전략
```

SKILL.md에서 AI Agent에게:
- 프로젝트 구조 (FSD)
- 코딩 규칙 (타입 안정성, 컴포넌트 레이어)
- 파일 레이어 역할 (model/hooks/ui/entities/app)
- 필독 자료 (references)

```tsx
// AI Agent가 생성한 코드 예시
export default function LoginPage() {
  // FSD 레이어 규칙 자동 준수
  const { login } = useAuthMutation();
  return <LoginForm onSubmit={login} />;
}
```

**효과**
- 맥락 기반 코드 생성
- 아키텍처 일관성 유지
- 재작업 최소화

</TabItem>
</Tabs>

**구조:**
- **SKILL.md**: 프로젝트 규칙, 아키텍처, 필수 패턴
- **References**: 도메인별 심화 자료 (인증, API, 테스트)
- **AI Agent 맥락**: 파일 레이어(model/hooks/ui/entities)별 책임 명확화

**결과**: 프로젝트별 AI Agent 코드 생성 **신뢰도 향상**, 개발 속도 **가속화**, 코드 리뷰 피드백 **감소**

---

## 도입 효과

- 프롬프트 오해 및 재작업 감소
- Agent 정확도 95% 달성
- 3계층 온톨로지로 컨텍스트 소비 최소화
- 도메인 간 간섭 제거로 병렬 개발 가능
