---
sidebar_position: 1
title: 소개
---

# 박경찬 · Frontend Engineer

> 복잡해지는 운영 서비스를 구조로 정리하고, 성능·품질·협업 비용을 함께 낮추는 프론트엔드 엔지니어입니다.

약 4년간 산업용 웹 서비스를 개발하며 실시간 데이터 처리, 브라우저 성능 최적화, 구조 설계, 품질 자동화를 직접 설계하고 적용했습니다.
이 사이트는 이력서에 적힌 문장을 실제 프로젝트 문서와 구조 선택 근거로 풀어낸 포트폴리오입니다.

---

## 나는 어떤 문제를 풀어왔는가

| 강점 | 설명 | 대표 사례 |
|---|---|---|
| 기술 병목 해결 | 병목을 측정 가능한 수치로 확인하고 성능·정합성 문제를 함께 개선 | [BEMS](/projects/bems) |
| AI Workflow 실무 확장 | AI Workflow와 검증 기준을 팀 공통 방식으로 정리해 실무 프로젝트에 적용 | [FMS](/projects/fms) |
| 설계 기준 정리 | API 계약, endpoint 설계, 공통 UI 운영 기준을 문서화하고 실제 개발에 적용 | [FMS](/projects/fms), [원격 제어 시스템](/projects/hvac-control) |
| 사이드 프로젝트 확장 경험 | 사이드 프로젝트에서 만든 기준과 구조를 현업 프로젝트 품질 개선으로 연결 | [PinHouse](/projects/pinhouse), [SAJU:ME](/projects/saju) |

---

## 팀을 위한 기준을 만들고 정착시킨 방식

공통으로 적용한 방식은 단순히 코드를 잘 작성하는 것을 넘어서, 팀 전체가 같은 기준으로 구현하고 검증할 수 있는 구조를 만드는 일이었습니다.

- 코드 컨벤션과 작업 기준을 먼저 문서화해, 구현 스타일과 리뷰 기준이 사람마다 달라지지 않도록 맞췄습니다.
- 성능을 체감이 아니라 수치로 확인할 수 있도록 측정 코드를 만들고, 프론트엔드 개발자들이 바로 활용할 수 있게 공유했습니다.
- 도메인별로 필요한 기술과 스킬을 따로 찾고, 사이드 프로젝트에서 기준을 정리한 뒤 결과를 문서화해 팀에 배포했습니다.
- 문서를 공유할 때는 왜 필요한지, 사용할 때 무엇을 주의해야 하는지, 어떤 개선 효과를 기대할 수 있는지까지 함께 정리했습니다.

### AI Workflow를 정착시킨 방식

AI Workflow는 처음부터 팀이 자연스럽게 받아들인 방식은 아니었습니다. 사람 대신 AI가 구현과 검증의 많은 부분을 맡는 구조였기 때문에, 팀원들도 "정말 검증이 가능한가"에 대해 보수적으로 볼 수밖에 없었습니다.

그래서 바로 현업에 적용하지 않고, 먼저 사이드 프로젝트에서 역할 분리와 평가 구조를 정리한 뒤 그 기준을 문서화해 팀 공통 방식으로 가져갔습니다.

### BEMS에서 기술 기준을 정착시킨 방식

프론트엔드 사수가 없는 환경에서 상태 관리, Web Worker, 크로스 브라우징, 품질 검증 기준까지 직접 찾아보고 정리해야 했습니다. 단순히 좋아 보이는 기술을 쓰는 것이 아니라, BEMS 도메인에 왜 필요한지부터 판단하고 수치와 문서로 근거를 남겼습니다.

---

## 대표 프로젝트

### [FMS](/projects/fms)
**2026.01 – 2026.06 · ㈜TSM Technology · FE 개발 · 팀 리딩**

복합 업무 프로세스를 디지털화한 웹 애플리케이션입니다.
AI Workflow와 RESTful endpoint 설계 기준을 팀 공통 방식으로 정리해, 도메인 확장 상황에서도 같은 기준으로 구현·검증할 수 있게 만들었습니다.

`Next.js` `TypeScript` `OpenAPI` `Zod` `Vitest` `Playwright`

---

### [BEMS](/projects/bems)
**2023.08 – 2025.08 · ㈜TSM Technology · FE 개발 · 팀 리딩**

운영 지표 데이터 실시간 수집·시각화 시스템입니다.
상태·캐시·실시간 처리·품질 검증 기준을 함께 정리해, 브라우저 요청과 화면 반영 지연을 줄이고 운영 가능한 구조로 개선했습니다.

`React` `TypeScript` `Zustand` `TanStack Query` `BFF` `Web Worker`

---

### [원격 제어 및 모니터링](/projects/hvac-control)
**2024.08 – 2025.12 · ㈜TSM Technology · FE 개발 · AWS 서버 구축**

AWS IoT Core 기반 현장 장비 원격 제어 및 실시간 모니터링 시스템입니다.
MQTT 멱등성, WebSocket 연결 구조, 장애 추적 흐름을 정리해 응답성과 신뢰성을 함께 개선했습니다.

`React` `TypeScript` `WebSocket` `AWS IoT Core` `Lambda` `DynamoDB`

---

## 사이드 프로젝트에서 확장한 기준

[PinHouse](/projects/pinhouse)에서는 Zustand·TanStack Query·BFF 기반 검색 상태와 캐시 구조를 정리해, 이후 BEMS의 반복 요청과 상태 관리 구조 개선으로 연결했습니다.  
[SAJU:ME](/projects/saju)에서는 Skill·Ontology 기반 AI Agent Harness와 평가 구조를 만들고, 그 기준을 이후 FMS 팀 공통 개발 프로세스로 확장했습니다.

이 과정에서 정리한 AI Workflow 기준은 FMS에, 상태·캐시 구조 기준은 BEMS에 연결되며 현업 프로젝트의 코드 품질과 서비스 품질을 함께 끌어올렸습니다.

## 연락처

- Email: developfff@gmail.com
- GitHub: [github.com/kyungchan3007](https://github.com/kyungchan3007)
