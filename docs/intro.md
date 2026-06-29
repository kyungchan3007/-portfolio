---
sidebar_position: 1
title: 소개
---

# 박경찬 · Frontend Engineer

> IoT 기반 제어 시스템부터 복잡한 운영 관리 도메인까지, 실제 코드로 증명하는 프론트엔드 포트폴리오입니다.

약 4년간 산업용 웹 서비스를 개발하며 아키텍처 전환, 실시간 통신, AI Agent 워크플로우, 품질 자동화를 직접 설계하고 적용했습니다.
이 사이트는 이력서에 적힌 내용을 **실제 코드와 아키텍처**로 보여주기 위해 만들었습니다.

---

## 핵심 기술 6가지

| 기술 | 한 줄 요약 | 적용 프로젝트 |
|---|---|---|
| [아키텍처 전환](/architecture/layered-to-fsd) | Layered → FSD / VSA 선택 적용 | FMS · BEMS |
| [멱등성 검증](/realtime/dedup-idempotency) | AWS IoT Core 중복 메시지 필터링 | 원격 제어 시스템 |
| [AWS IoT 제어](/realtime/aws-iot-control) | MQTT → Lambda → WebSocket, 응답 지연 23s→1s | 원격 제어 시스템 |
| [OpenAPI → Zod](/projects/fms) | 타입 자동생성 + 런타임 계약 검증 | FMS |
| [Merge Gate (CI)](/quality/merge-gate-ci) | 심각도 기반 병합 차단 자동화 | FMS · BEMS |
| [AI Agent Workflow](/ai-workflow/agent-pipeline) | Claude/Codex 역할 분리 + 4단계 파이프라인 | FMS |

---

## 프로젝트 개요

### [FMS](/projects/fms)
**2026.01 – 2026.06 · ㈜TSM Technology · FE 개발 · 팀 리딩**

복합 업무 프로세스를 디지털화한 웹 애플리케이션.
Vertical Slice Architecture + AI Agent 파이프라인으로 인원 3→2명에도 전 도메인 커버리지 유지.

`Next.js` `TypeScript` `Zustand` `TanStack Query` `Zod` `Vitest` `Playwright`

---

### [BEMS](/projects/bems)
**2023.08 – 2025.08 · ㈜TSM Technology · FE 개발 · 팀 리딩**

운영 지표 데이터 실시간 수집·시각화 시스템.
Web Worker 기반 렌더링으로 화면 반영 지연 3~5초 → 1초 이내 단축.

`React` `TypeScript` `Redux` `Web Worker` `react-query` `Styled-components`

---

### [원격 제어 및 모니터링](/projects/hvac-control)
**2024.08 – 2025.12 · ㈜TSM Technology · FE 개발 · AWS 서버 구축**

AWS IoT Core 기반 현장 장비 원격 제어 및 실시간 모니터링 시스템.
멱등성 검증으로 응답 지연 23초 → 1초 이내 단축.

`React` `TypeScript` `Redux` `WebSocket` `AWS IoT Core` `Lambda` `DynamoDB`

---

## 연락처

- Email: developfff@gmail.com
- GitHub: [github.com/kyungchan3007](https://github.com/kyungchan3007)
