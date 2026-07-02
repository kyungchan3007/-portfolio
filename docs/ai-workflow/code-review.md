---
sidebar_position: 6
---

#  병합 전 리뷰를 표준화한 이유

부족한 인력으로 빠르게 개발하다 보면, 리뷰가 사람의 컨디션과 시간에 따라 들쭉날쭉해지기 쉽습니다. 저는 이 변동성을 없애기 위해 **Claude 구현 → Codex 검증·수정** 리뷰 절차를 표준화했습니다. 누가 언제 리뷰하든 같은 기준으로, 같은 형식으로 판정되게 만드는 것이 목표였습니다.

## 기본 절차

```
① Claude가 구현 완료
      ↓
② Codex에 검증 요청
      ↓
③ gate-matrix로 작업 유형 분류
      ↓
④ code-review-guard 스킬로 리뷰
      ↓
   ┌──┴──┐
  PASS  HOLD
   ↓      ↓
  병합   Codex가 직접 수정 → 재검증
```

## 🗂️ 게이트 매트릭스

작업 유형에 따라 **필수 스킬**, **선택 스킬**, **검증 포커스**가 달라집니다. 작업이 여러 유형에 걸칠 때는 가장 위험한 유형을 주 유형으로 잡고 게이트를 합산합니다.

### 대표 유형별 게이트

| 작업 유형 | 필수 스킬 | 선택 스킬 | 검증 포커스 |
|---|---|---|---|
| 기능 구현/리팩터 | `code-review-guard` | `best-practices` | G1, G2, G4, G5 |
| 인증/권한/로그인 | `code-review-guard` | — | G2, G3, G4, G5 |
| 입력 폼 흐름 | `frontend`, `code-review-guard` | — | G1, G2, G4, G5 |
| 결과 조회 | `frontend`, `code-review-guard` | `best-practices` | G1, G2, G4, G5 |
| 상태관리/캐시 변경 | `frontend`, `code-review-guard` | `best-practices` | G1, G2, G4, G5 |
| BFF/API route 변경 | `frontend`, `code-review-guard` | — | G1, G2, G3, G4, G5 |
| 쿠키/세션/민감정보 처리 | `frontend`, `code-review-guard` | — | G2, G3, G4, G5 |
| UI/디자인 전수 수정 | `code-review-guard` | `web-design-guidelines` | G1, G4, G5 + 접근성 |
| 디자인 시스템/토큰 | `design-system-hybrid`, `code-review-guard` | `web-design-guidelines` | G1, G2, G4, G5 + 접근성 |
| 성능 개선 | `code-review-guard` | `best-practices` | G1, G2, G4, G5 + 성능 근거 |
| CI/CD 워크플로우 | `frontend`, `code-review-guard` | — | G1, G3, G4, G5 |
| 문서 사이트 | `documentation`, `code-review-guard` | — | G1, G2, G4, G5 |
| 작업 기록 | `worklog` | `change-summary-report` | G5 |
| 릴리즈 직전 통합 점검 | `code-review-guard` | `best-practices`, `web-design-guidelines` | G1~G5 전체 |

**G1** 비즈니스 로직 무결성 / **G2** API 계약·타입 안전성 / **G3** 인증·보안 / **G4** 상태관리·캐시 일관성 / **G5** 회귀·운영 안정성

세부 유형과 검증 명령은 `.agents/skills/code-review-workflow/references/gate-matrix.md`에서 관리합니다.

## 📋 필수 점검 항목

리뷰어가 반드시 확인하도록 못 박은 항목들입니다.

- **도메인 플로우** — 주요 사용자 흐름의 정상 동작 (입력/조회/결과 페이지)
- **인증 분기** — 로그인/미로그인 접근 제어 누락 여부
- **상태 관리** — cache key, invalidation, stale 데이터 노출 위험
- **타입 안전성** — nullable/optional 필드 처리, 실패 응답 처리 누락
- **보안** — localStorage/console에 민감정보 노출 여부
- **Dead code** — 하드코딩 flag, 임시 우회 분기

## 📄 리뷰 출력 형식

리뷰 결과가 매번 다른 모양으로 나오지 않도록, 출력 형식을 아래로 고정했습니다.

```
### Verdict
MERGE: PASS  또는  MERGE: HOLD
(HOLD인 경우 이유 1문장)

### Findings
[Critical / High / Medium / Low] 제목
- 영향
- 근거: path:line
- 재현 조건
- 수정 제안

### Open Questions
- 요구사항 확인이 필요한 항목

### Summary
- 심각도별 이슈 수
- 병합 가능/보류 판단 근거
- 권장 테스트
```

:::tip 원칙
모든 이슈에는 **파일/라인 근거**가 포함돼야 합니다. 추측성 지적은 금지예요.
:::

## 🔄 재검증 모드

HOLD가 나와 수정한 뒤 다시 요청하면, 전체를 처음부터 다시 보지 않고 **delta-only** — 새로 바뀐 부분부터 우선 검증하게 했습니다. 재검증 시간을 줄이면서도, 이전 Critical/High가 미해결이면 반드시 다시 보고하도록 안전장치를 뒀습니다.
