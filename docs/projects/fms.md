---
sidebar_position: 1
title: FMS — Facility Management System
sidebar_label: FMS
---

# FMS — Facility Management System

**2026.01 – 2026.06 · ㈜TSM Technology · 과장 · FE 개발 · 팀 리딩**

:::info 개요
시설물 유지보수 업무를 디지털화한 웹 애플리케이션.
AI Agent 파이프라인으로 2인 체제에서도 전 도메인 커버리지를 유지하고 개발 속도를 향상시켰습니다.
:::

## 기술 스택

`Next.js` `React` `TypeScript` `Tailwind CSS` `Zustand` `TanStack Query` `Zod` `Vitest` `Playwright` `Storybook`

---

## 성과 요약

| 발견 항목 | 문제 | 개선 방향 | 결과 |
|---|---|---|---|
| 개발 병렬성 | 2인 체제로 전 도메인 커버 어려움 | VSA 기반 Agent 도메인 독립 할당 | 30+ 라우트 전 도메인 병렬 개발 |
| 타입 안정성 | 수동 타입 정의·백엔드 소통 비용 발생 | OpenAPI → Zod 타입 자동화 | 소통 비용 감소, 타입 불일치 버그 제거 |
| 품질 커버리지 | 수동 검증으로 누락 위험 | Vitest + Playwright + Storybook 3중 검증 | 단위·E2E·UI 전 레이어 커버리지 확보 |
| 프롬프트 오해 | 컨텍스트 누적으로 AI 재작업 반복 | 하네스 엔지니어링, 도메인별 reference 명세화 | 재작업 감소, 개발 사이클 단축 |

---

## AI Agent

Claude(UX/UI) + Codex(비즈니스 로직) 역할 분리, 구현·검증·리뷰·배포 4단계 파이프라인 운영.

→ 자세한 내용: [Agent 역할 분리](/ai-workflow/agent-role-split) · [4단계 파이프라인](/ai-workflow/agent-pipeline)

### 1. OpenAPI → Zod 타입 자동화

HeyAPI(openapi-ts)로 타입·클라이언트 자동 생성, Zod로 런타임 API 계약 검증.

→ 자세한 내용: [OpenAPI → Zod](/quality/openapi-to-zod)

### 2. 품질 검증 (Merge Gate)

Critical/Major/Minor 심각도 판정 기반 병합 차단 + Vitest · Playwright 3중 검증.

→ 자세한 내용: [Merge Gate (CI)](/quality/merge-gate-ci)

### 3. UI · 디자인 토큰 패키지 분리

```
apps/
  web/          ← 메인 서비스
packages/
  ui/           ← 공용 컴포넌트
  design-tokens/← 색상·타이포·간격 토큰
```

Changesets로 major · minor · patch 기준 수립, 패키지 버전 독립 관리.
