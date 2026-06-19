---
sidebar_position: 1
title: FMS — Facility Management System
sidebar_label: FMS
---

# FMS — Facility Management System

**2026.01 – 2026.06 · ㈜TSM Technology · 과장 · FE 개발 · 팀 리딩**

:::info 개요
시설물 유지보수 업무를 디지털화한 웹 애플리케이션.
AI Agent 파이프라인으로 개발 인원 3→2명에도 전 도메인 커버리지를 유지하고 개발 속도를 향상시켰습니다.
:::

## 기술 스택

`Next.js` `React` `TypeScript` `Tailwind CSS` `Zustand` `TanStack Query` `Zod` `Vitest` `Playwright` `Storybook`

---

## 성과 요약

| 지표 | Before | After |
|---|---|---|
| 개발 인원 | 3명 | 2명 |
| 도메인 커버리지 | 일부 | 전체 유지 |
| 백엔드 소통 비용 | 수동 타입 정의·슬랙 조율 | OpenAPI→Zod 자동화로 감소 |

---

## 아키텍처

**Vertical Slice Architecture** 적용 — 기능 단위 독립 개발로 Agent별 도메인 병렬 할당.

→ 자세한 내용: [VSA 병렬 개발](/architecture/vsa-parallel-dev)

---

## 주요 구현

### 1. AI Agent 워크플로우
Claude(UX/UI) + Codex(비즈니스 로직) 역할 분리, 구현·검증·리뷰·배포 4단계 파이프라인 운영.

→ 자세한 내용: [Agent 역할 분리](/ai-workflow/agent-role-split) · [4단계 파이프라인](/ai-workflow/agent-pipeline)

### 2. OpenAPI → Zod 타입 자동화
HeyAPI(openapi-ts)로 타입·클라이언트 자동 생성, Zod로 런타임 API 계약 검증.

→ 자세한 내용: [OpenAPI → Zod](/quality/openapi-to-zod)

### 3. 품질 검증 (Merge Gate)
Critical/Major/Minor 심각도 판정 기반 병합 차단 + Vitest · Playwright 3중 검증.

→ 자세한 내용: [Merge Gate (CI)](/quality/merge-gate-ci)

### 4. UI · 디자인 토큰 패키지 분리

```
apps/
  web/          ← 메인 서비스
packages/
  ui/           ← 공용 컴포넌트
  design-tokens/← 색상·타이포·간격 토큰
```

Changesets로 major · minor · patch 기준 수립, 패키지 버전 독립 관리.

---

## Issue & Resolution

:::danger 문제
단순 프롬프트 방식의 컨텍스트 누적으로 AI 오해 발생.
검증·수정 시간이 구현 시간을 초과하는 상황 반복.
:::

**원인**: 단일 채팅 내 도메인 무관 정보 혼재 → Agent가 요청 의도를 오해, 재작업 반복.

**해결**: 하네스 엔지니어링 도입. 도메인별 reference 파일로 Agent 행동 범위 명세화.

:::tip 결과
프롬프트 오해 및 재작업 감소.
구현·검증·배포 사이클 단축으로 생산성 향상.
:::
