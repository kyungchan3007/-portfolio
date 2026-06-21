---
sidebar_position: 2
title: 하네스 엔지니어링 — AGENTS.md · SKILL.md
sidebar_label: 하네스 엔지니어링
---

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
너는 FMS의 **UI 구현 Agent**다.
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

## 도입 효과

- 프롬프트 오해 및 재작업 감소
- Agent 정확도 95% 달성
- 3계층 온톨로지로 컨텍스트 소비 최소화
- 도메인 간 간섭 제거로 병렬 개발 가능
