---
sidebar_position: 4
---

# 스킬 시스템

스킬은 AI가 작업 전에 읽는 **도메인별 지침 파일**입니다.

## 왜 스킬인가

AI에게 모든 프로젝트 규칙을 매번 대화에서 설명하면 토큰 낭비가 심해요. 스킬 시스템은 "지금 이 작업에 필요한 문서만 골라 읽는다"는 원칙으로 설계됐습니다.

## 파일 구조

```
.agents/skills/{skill-name}/
├── SKILL.md          ← 진입점. 읽기 규칙 + 공통 원칙
└── references/       ← 도메인별 세부 지침
    ├── architecture.md
    ├── api.md
    ├── auth.md
    └── ...
```

## 읽기 규칙 — "필요한 것만"

`SKILL.md`에는 도메인별 분기 규칙이 있어요.

```
- 입력 폼 흐름 작업이면 → references/form-flow.md 읽기
- API 연동 작업이면       → references/api.md 읽기
- UI 스타일 작업이면      → references/ui-style.md 읽기
```

한 도메인 작업에서 읽는 파일은 `SKILL.md + reference 1개`가 원칙이에요.
여러 도메인에 걸칠 때만 추가로 읽습니다.

## 구현 전 필수 출력

스킬을 읽은 뒤 AI는 코드 작성 전에 반드시 아래 형식을 출력합니다.

```
읽은 문서: SKILL.md, references/XXX.md
요약 (5줄 이내): ...
파일 레이어 계획:
  - model/: 상수, 순수 유틸, 데이터 모델 변환
  - hooks/: useQuery, useMutation, 상태·플로우 로직
  - ui/: props 받아 렌더링만
  - entities/: API 타입, 서버/클라이언트 통신 경계
  - app/api/: BFF route
```

이 출력을 강제함으로써 레이어 배치를 구현 전에 한 번 더 검토하게 됩니다.

## 현재 운영 중인 스킬 목록

| 스킬 | 용도 |
|------|------|
| `frontend` | 웹 애플리케이션 전체 도메인 구현 |
| `code-review-guard` | 병합 전 리뷰 |
| `code-review-workflow` | Claude → Codex 검증 절차 |
| `design-system-hybrid` | 디자인 시스템 운영 |
| `weekly-worklog` | 주간 작업 기록 |
| `prompt-trigger-eval` | 스킬 트리거 평가 |
| `change-summary-report` | 변경 요약 리포트 |
| `best-practices` | 웹 성능/렌더링 점검 |
| `web-design-guidelines` | 웹 UI 가이드 점검 |

## 스킬은 온톨로지 노드다

스킬은 단순한 지침 파일이 아닙니다. 작업 도메인과 필요한 지식을 구조화하는 **온톨로지 노드**입니다.

- **`SKILL.md`** — 도메인 진입점. "어떤 작업일 때 어떤 reference를 읽어라"는 분기 규칙을 담고 있습니다.
- **`references/`** — 세부 지식 그래프. 도메인별로 필요한 규칙, 경계, 주의사항을 분리 보관합니다.
- **`description`** — 트리거 분류 기준. 사용자 요청을 이 스킬의 도메인으로 라우팅할지 판단하는 문장입니다.

좋은 `description`은 **"언제 사용해야 하는지"** 와 **"언제 사용하지 말아야 하는지"** 를 함께 명시합니다.

```yaml
description: >-
  웹 애플리케이션 구현 또는 변경 요청에 사용한다.
  라우트, API 연동, 상태관리 요청이 해당된다.
  백엔드 전용 변경, 인프라 전용 작업에는 사용하지 않는다.
```

"사용하지 않는 경우"가 없으면 범위가 너무 넓어져서 관련 없는 요청에서도 발동(오탐)합니다.

## 스킬 트리거 테스트

`SKILL.md` frontmatter의 `description`은 스킬 라우팅 기준입니다. 이 문장이 부정확하면 엉뚱한 스킬이 발동되거나, 발동해야 할 스킬이 발동되지 않습니다.

`prompt-trigger-eval`은 `should_trigger` / `should_not_trigger` 샘플 세트로 스킬 발동 정확도를 검증합니다.

```
should_trigger 예시:
- "결과 페이지에서 캐시가 꼬여서 이전 데이터가 보여요. 상태관리 점검해줘."

should_not_trigger 예시:
- "백엔드 사용자 인증 엔진의 토큰 검증 로직만 수정해줘."
```

검증 결과는 `references/test-results.md`에 누적되어 어떤 스킬이 어떤 경계에서 오탐/미탐을 냈는지 관리됩니다. 오탐/미탐이 발견되면 `description`을 조정한 뒤 같은 세트로 재검증합니다.

:::tip
`prompt-trigger-eval`은 일반 구현 작업 중 상시 실행하는 스킬이 아닙니다. 스킬 경계를 점검하거나 `description`을 조정할 때만 사용하는 **평가 전용 스킬**입니다.
:::

## 스킬 갱신 규칙

> 새 라우트, 새 도메인, 반복되는 실수, 중요한 규칙이 생기면 스킬 파일을 함께 갱신합니다.

스킬 파일은 코드와 동기화된 살아있는 문서예요. 프로젝트가 바뀌면 스킬도 바뀝니다.
