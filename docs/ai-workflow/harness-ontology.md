---
sidebar_position: 3
---

# 하네스 + 온톨로지

이 프로젝트의 `.agents` 디렉터리는 단순한 프롬프트 모음이 아닙니다. **하네스(Harness)** 와 **온톨로지(Ontology)** 두 개념이 결합된 운영 체계입니다.

---

## 하네스란

하네스는 AI가 매번 자유롭게 판단하지 않도록 **실행 순서, 역할, 출력 형식을 사전에 고정**하는 운영 장치입니다.

| 고정 항목 | 내용 |
|---|---|
| **역할** | `implementer`, `reviewer`, `worklog` |
| **절차** | 구현 → 검증 → 기록 순서 준수 |
| **판정** | `MERGE: PASS` 또는 `MERGE: HOLD` 둘 중 하나만 허용 |
| **출력** | 리뷰 결과 형식, 변경 요약 형식, 기록 형식 고정 |

하네스가 없으면 AI는 요청마다 다른 방식으로 동작합니다. 같은 작업이라도 검증 기준이 달라지고, 출력 형식이 제각각이 됩니다. 하네스는 이 변동성을 줄이는 명시적 운영 규칙입니다.

:::note
하네스는 AI가 완전 자동으로 실행하는 파이프라인이 아닙니다. 명시적 운영 규칙과 에이전트 지침에 따라 작동하는 구조입니다.
:::

---

## 온톨로지란

온톨로지는 **작업 도메인과 필요한 지식을 분류하는 체계**입니다. 어떤 요청이 들어왔을 때 어떤 스킬을 쓰고, 어떤 참조 문서를 읽어야 하는지 결정하는 구조입니다.

### 도메인 분류

| 스킬 | 담당 도메인 |
|---|---|
| `frontend` | 웹 애플리케이션 전체 (라우트, API 연동, 상태관리, BFF) |
| `documentation` | 문서 사이트 운영 |
| `design-system-hybrid` | 디자인 시스템 / 토큰 / 컴포넌트 |
| `code-review-workflow` | 검증 절차 및 게이트 매트릭스 |
| `code-review-guard` | 병합 전 코드 리뷰 |
| `weekly-worklog` | 작업 기록 |

### 지식 그래프 구조

각 스킬은 **도메인 진입점(`SKILL.md`)** 과 **세부 지식 그래프(`references/`)** 로 구성됩니다.

```
.agents/skills/frontend/
├── SKILL.md                  ← 도메인 진입점 + 읽기 규칙
└── references/
    ├── architecture.md       ← 전체 구조/레이어 경계
    ├── api.md                ← API 연동/BFF 경계
    ├── auth.md               ← 인증/로그인 흐름
    ├── feature-flows.md      ← 주요 기능 흐름
    ├── infrastructure.md     ← 배포/인프라
    └── ...
```

`SKILL.md` 안에 "이 작업이면 이 reference를 읽어라"는 분기 규칙이 있어서, 작업에 필요한 파일만 선택적으로 읽습니다.

### 트리거 문장 — 스킬 라우팅의 기준

각 스킬 `SKILL.md`의 frontmatter `description`은 단순한 설명이 아닙니다. **사용자 요청을 어떤 도메인으로 분류할지 결정하는 트리거 문장**입니다.

```yaml
---
name: frontend
description: >-
  웹 애플리케이션 구현 또는 변경 요청에 사용한다.
  라우트, API 연동, 상태관리, UI 구성 요청이 해당된다.
  백엔드 전용 변경, 인프라 전용 작업에는 사용하지 않는다.
---
```

이 문장의 품질이 스킬 라우팅 정확도를 결정합니다.

---

## 하네스와 온톨로지가 같이 작동하는 흐름

```
사용자 요청
    │
    ▼
[온톨로지] skill description 매칭
    │   → 어떤 스킬인가? (frontend / design-system-hybrid / ...)
    │
    ▼
[온톨로지] SKILL.md 읽기 규칙으로 필요한 reference 선택
    │   → 어떤 지식이 필요한가? (api.md / auth.md / feature-flows.md / ...)
    │
    ▼
[하네스] implementer 역할 수행
    │   → 구현 전 필수 출력 (읽은 문서, 레이어 계획)
    │   → 코드 작성
    │
    ▼
[온톨로지] gate-matrix로 작업 유형 분류
    │   → 어떤 검증 조합인가?
    │
    ▼
[하네스] reviewer 역할 수행
    │   → code-review-guard + 선택 스킬 적용
    │   → MERGE: PASS / MERGE: HOLD 판정
    │
    ▼
[하네스] worklog 역할 수행
        → 변경 요약 + 작업 기록
```

---

## 실제 적용 예시

### 사용자 데이터 조회 오류 대응

- **선택되는 스킬:** `frontend`
- **선택되는 reference:** `references/feature-flows.md`
- **게이트:** 데이터 조회 유형 → `frontend`, `code-review-guard` 필수 / `best-practices` 선택
- **검증 포커스:** G1(비즈니스 로직), G2(API 계약), G4(상태관리/캐시), G5(회귀)
- **검증 명령:** 데이터 route/client query unit + `typecheck`

### React Query 캐시/무효화 변경

- **선택되는 스킬:** `frontend`
- **선택되는 reference:** `references/feature-flows.md` 또는 관련 도메인 reference
- **게이트:** React Query 캐시/무효화 유형 → `frontend`, `code-review-guard` 필수 / `best-practices` 선택
- **검증 포커스:** G1, G2, G4, G5
- **검증 명령:** query key/invalidation unit + `typecheck`

### CI/CD 워크플로우 변경

- **선택되는 스킬:** `frontend`
- **선택되는 reference:** `references/infrastructure.md`
- **게이트:** CI/CD 워크플로우 유형 → `frontend`, `code-review-guard` 필수
- **검증 포커스:** G1(로직), G3(보안), G4(상태), G5(회귀)
- **검증 명령:** YAML diff, 트리거/secret/branch 조건 확인

### 디자인 시스템/토큰 변경

- **선택되는 스킬:** `design-system-hybrid`, `code-review-guard`
- **선택되는 reference:** 디자인 시스템 관련 문서
- **게이트:** 디자인 시스템/토큰 유형 → `design-system-hybrid`, `code-review-guard` 필수 / `web-design-guidelines` 선택
- **검증 포커스:** G1, G2, G4, G5 + 접근성
- **검증 명령:** Storybook build + `typecheck`

---

## 트리거 품질 검증 — `prompt-trigger-eval`

### 왜 필요한가

스킬 라우팅은 `description` 문장의 품질에 달려 있습니다.

- **트리거 문장이 너무 넓으면** → 관련 없는 요청에서 잘못 발동(오탐, FP)
- **트리거 문장이 너무 좁으면** → 발동해야 할 요청에서 발동 실패(미탐, FN)

`prompt-trigger-eval`은 `should_trigger` / `should_not_trigger` 샘플 세트로 스킬 발동 정확도를 검증하는 **평가용 스킬**입니다.

### 평가 지표

| 평가 항목 | 의미 |
|---|---|
| **TP** (정탐) | 발동해야 하는 요청에서 정상 발동 |
| **TN** (정거부) | 발동하지 말아야 하는 요청에서 정상 미발동 |
| **FP** (오탐) | 발동하지 말아야 하는 요청에서 잘못 발동 |
| **FN** (미탐) | 발동해야 하는 요청에서 발동 실패 |

### 운영 방식

```
① 평가 대상 스킬 지정
② should_trigger / should_not_trigger 샘플 세트 준비
③ 분류 정확도 점검 (TP / TN / FP / FN 집계)
④ 오탐/미탐이 있으면 description 문장 조정
⑤ 같은 세트로 재검증 → 개선 여부 확인
⑥ 결과를 references/test-results.md에 누적
```

결과는 `test-results.md`에 쌓이면서 어떤 스킬이 어떤 경계에서 오탐/미탐을 냈는지 관리됩니다. 이 과정을 반복해 온톨로지의 도메인 경계를 지속적으로 조정합니다.

:::tip 사용 시점
`prompt-trigger-eval`은 일반 구현 작업 중 상시 실행하는 스킬이 아닙니다. "프롬프트 테스트 하자", "트리거 검증해줘", "오탐/미탐 점검"처럼 스킬 경계를 점검할 때만 사용합니다.
:::

---

## 장점과 한계

### 장점

| 항목 | 설명 |
|---|---|
| **토큰 절약** | 필요한 reference만 선택적으로 읽어 컨텍스트 낭비 없음 |
| **규칙 일관성** | 하네스가 절차와 출력 형식을 고정해 매번 같은 기준 적용 |
| **리뷰 독립성** | 구현 AI와 검증 AI를 분리해 맹점 없는 리뷰 가능 |
| **회귀 위험 감소** | gate-matrix가 작업 유형별 필수 검증을 강제 |
| **산출물 품질 안정화** | 반복 작업에서 출력 포맷과 판정 기준이 흔들리지 않음 |

### 한계

- **description 품질 의존:** 트리거 문장이 부정확하면 오탐/미탐이 생긴다. 주기적으로 `prompt-trigger-eval`로 점검해야 한다.
- **문서 최신화 필요:** 코드가 바뀌면 `references/` 문서도 함께 갱신해야 한다. 문서가 낡으면 잘못된 판단이 나온다.
- **완전 자동 실행이 아님:** 명시적 운영 규칙과 에이전트 지침이 필요하다. 절차는 사람이 의식적으로 따라야 작동한다.
- **스킬 경계 관리 부담:** 프로젝트가 커질수록 스킬 경계를 잘 나눠야 오탐/미탐이 줄어든다.
