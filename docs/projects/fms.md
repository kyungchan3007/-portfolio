---
sidebar_position: 1
title: FMS
sidebar_label: FMS
---

# 🏭 FMS

**2026.01 – 2026.06 · ㈜TSM Technology · 과장 · FE 개발 · 팀 리딩**

복합 업무 프로세스를 디지털화한 웹 애플리케이션.
<br/>설비 관리로 시작한 프로젝트가 ERP까지 확장되며 범위가 급격히 커졌고, 2인 체제에서 구현 기준과 API 설계 기준까지 함께 정리해야 했습니다.
<br/>저는 이 프로젝트에서 AI Workflow와 RESTful endpoint 설계 기준을 팀 공통 방식으로 정리해, 개발 범위가 커져도 같은 기준으로 구현·검증할 수 있는 구조를 만들었습니다.

## 기술 스택

`Next.js` `React` `TypeScript` `Claude` `Codex` `Skill` `Ontology` `OpenAPI` `Zod` `Radix UI` `Design Tokens` `Vitest` `Playwright`

---

## 성과 요약

| 항목 | 문제 | 적용 | 결과 |
|---|---|---|---|
| AI Workflow 표준화 | 요구사항·API·검증 기준이 단계마다 다르게 전달됨 | Claude·Codex 역할 분리, Skill·Ontology 연결, 팀 공통 Workflow 운영 | 구현·검증 시간 **약 50% 절감** |
| 개발 범위 확대 대응 | 도메인 확장으로 구현 범위가 빠르게 증가 | 역할·컨텍스트·검증 기준을 고정한 개발 흐름 정착 | 개발 범위 **약 50% 증가 상황 대응** |
| API 계약 대응 | 스펙 변경마다 타입·클라이언트를 수동 수정 | OpenAPI → Zod Runtime 검증 흐름 구성 | API 변경 대응·검증 시간 **50% 이상 절감** |
| API 설계 기준 부재 | 기능별 Endpoint 명명·응답 구조가 달라짐 | RESTful endpoint 설계 기준 문서화 및 리뷰 기준화 | 반복적인 API 설계 협의·재작업 감소 |
| 공통 UI 운영 | 화면이 늘수록 UI와 토큰 기준이 분산됨 | `ui`·`design-tokens` 패키지 분리, CSS 변수 기반 토큰 중앙화, Changesets 릴리즈 관리 | 공통 UI 변경 기준과 재사용 범위 정리 |
| 접근성·동작 로직 | Modal·Select류 컴포넌트를 화면마다 개별 구현해 접근성 품질 편차 발생 | Radix UI 기반 headless primitive를 Shell로 감싸 동작·스타일 분리 | 접근성·동작 로직 Shell 레벨 검증, 컴포넌트별 재구현 제거 |
| 일정 대응 | 인력은 적고 검증 비용은 계속 증가 | Workflow와 계약 검증 기준을 함께 운영 | 목표보다 **약 2주 조기 완료** |

---

## 이 프로젝트에서 맡은 역할

- 서비스 설계, 프론트엔드 구현, API 협의, 검증 흐름 정리까지 전반을 주도했습니다.
- 팀이 같은 기준으로 구현하고 검증할 수 있도록 AI Workflow와 API 설계 원칙을 문서화했습니다.
- OpenAPI 기반 계약 자동화와 공통 UI 운영 기준을 연결해 개발 속도와 일관성을 함께 높였습니다.

---

## 핵심 문제

FMS는 도메인 확장과 일정 압박이 동시에 들어온 프로젝트였습니다. 기능이 늘어날수록 구현 자체보다도 요구사항 전달, API 설계, 검증 기준, 리뷰 관점이 사람마다 달라지는 문제가 더 크게 드러났습니다.

특히 다음 네 가지가 병목이었습니다.

- 구현 범위가 약 50% 확대되면서 작업 분담 기준이 흔들렸습니다.
- AI를 사용해도 역할과 검증 기준이 고정되어 있지 않아 결과 편차와 프롬프트 재작업이 반복됐습니다.
- API 스펙 변경 때마다 타입과 클라이언트를 수동으로 맞추느라 소통 비용이 커졌습니다.
- Endpoint 명명, 응답 구조, Query Parameter 기준이 기능마다 달라 API 설계 협의가 반복됐습니다.

이 프로젝트에서 중요한 것은 단순히 더 빨리 구현하는 것이 아니라, 사람이 바뀌거나 기능이 늘어나도 같은 기준으로 설계하고 검증할 수 있는 팀 표준을 만드는 일이었습니다.

---

## 1. AI Workflow를 팀 공통 방식으로 정리

AI Workflow의 상세 설계 과정은 별도 문서로 분리해 두었습니다.

- [왜 AI Agent 워크플로우를 직접 만들었나](../ai-workflow/overview.md)
- [하네스 + 온톨로지 엔지니어링](../ai-workflow/harness-ontology.md)
- [자동화 검증 워크플로우](../ai-workflow/agent-pipeline.md)

FMS에서는 그 구조를 설명하는 것보다, **그 기준을 실제 팀 개발 프로세스로 어떻게 사용했는가**가 더 중요했습니다.

### 문제

요구사항 정리, API 검토, 구현, 리뷰가 한 흐름 안에서 섞여 돌아가면 AI가 UX 판단, 비즈니스 로직, 검증 문맥을 한 번에 떠안게 됩니다. 그러면 결과 편차가 커지고, 결국 사람이 다시 설명하거나 되돌리는 비용이 커졌습니다.

### 적용

- Claude는 UX/UI 구현과 디자인 반영에 집중하게 했습니다.
- Codex는 비즈니스 로직, API 검증, 리뷰를 담당하게 했습니다.
- Skill과 Ontology로 작업 유형별 실행 절차와 검증 기준을 연결했습니다.
- 구현 → 검증 → 리뷰 → 배포 흐름에서 단계별 컨텍스트와 체크 기준을 고정했습니다.

### 결과

- 구현·검증 시간 약 50% 절감
- 리뷰 소요 시간 50% 이상 절감
- 역할별 결과 편차와 프롬프트 재작업 감소
- 목표 마감일보다 약 2주 앞서 개발 완료

```ts title="domain.ts"
// 설명용 예시: 실제 프로젝트 설정 파일이 아님
const 워크플로우 = {
  implement: {
    role: 'ui-agent',
    context: ['requirements', 'design-guides'],
  },
  verify: {
    role: 'review-agent',
    checks: ['business-rule', 'security', 'cache'],
  },
  release: {
    requires: ['smoke-test', 'regression-test'],
  },
}
```

---

## 2. RESTful endpoint 설계 기준 정리

FMS에서는 API 설계 기준도 함께 정리해야 했습니다. 기능별로 Endpoint 명명 방식과 응답 구조가 달라지면 프론트와 백엔드가 같은 문제를 반복해서 다시 논의하게 됩니다.

그래서 개인 경험이나 기존 관습에 기대지 않고, Microsoft Azure Architecture Center의 RESTful API 설계 가이드를 기준으로 팀 내부 원칙을 정리했습니다.

### 적용한 기준

- 리소스 중심 URI
- 동사가 아닌 명사·컬렉션 중심 Endpoint
- `GET` `POST` `PUT` `PATCH` `DELETE`의 책임 구분
- HTTP 상태 코드와 오류 응답 규격
- 리소스 관계, 하위 리소스, Query Parameter 기준
- 필터링, 정렬, 페이지네이션 규칙
- Endpoint 명명, 계층, 버전 관리 기준

### 사용 방식

- 팀 공통 Endpoint 설계 지침으로 문서화했습니다.
- 신규 API 설계와 PR 리뷰 기준으로 사용했습니다.
- OpenAPI Contract 자동화의 선행 기준으로 연결했습니다.

```text title="domain.txt"
# 설명용 예시: 실제 서비스 Endpoint가 아님
GET    /api/domains
GET    /api/domains/{domainId}
POST   /api/domains
PATCH  /api/domains/{domainId}
DELETE /api/domains/{domainId}

GET    /api/domains?region=sample&page=1&pageSize=20
```

RESTful endpoint 기준을 먼저 고정해 두었기 때문에, 기능이 늘어날수록 커지기 쉬운 설계 편차와 반복 협의를 줄일 수 있었습니다.

---

## 3. OpenAPI → Zod 기반 계약 자동화

API 설계 기준을 세운 뒤에는, 그 기준이 실제 구현과 검증까지 이어지도록 계약 자동화를 붙였습니다.

### 문제

스펙이 바뀔 때마다 프론트에서 타입과 클라이언트를 수동으로 수정하면 대응 속도도 느리고, 계약 위반도 늦게 발견됩니다.

### 적용

- OpenAPI 스펙 변경을 타입·클라이언트 생성으로 연결했습니다.
- 생성된 응답을 Zod로 Runtime 검증하도록 구성했습니다.
- 계약 위반을 화면 진입 이후가 아니라 응답 수신 시점에 바로 잡도록 했습니다.

### 결과

- 수동 타입 작성과 반복적인 변경 확인 감소
- API 변경 대응·검증 시간 50% 이상 절감
- 확보한 시간을 테스트와 UX 개선에 재투입

```ts title="domain.ts"
// 설명용 예시: 실제 API·Schema 이름이 아님
const 도메인스키마 = z.object({
  id: z.string(),
  label: z.string(),
  status: z.enum(['active', 'inactive']),
})

export async function 도메인요청() {
  const 응답 = await fetch('/api/domains/sample')
  const json: unknown = await 응답.json()

  return 도메인스키마.parse(json)
}
```

---

## 4. 공통 UI 패키지와 디자인 토큰 운영

공통 UI도 같은 기준으로 다뤄야 했습니다. 화면이 늘어나면 표현만 비슷한 컴포넌트가 도메인별로 다시 생기고, 색상·간격·반경 같은 기준도 화면마다 달라지기 쉽습니다.

실제 프로젝트에서는 공통 UI와 디자인 토큰을 각각 별도 패키지로 분리해 운영했습니다.

- `ui` 패키지: `Button`, `Input`, `Card`, `ConfirmModal`, `DialogShell`, `Select`, `ProgressBar`, `StateCard`, `Toast` 같은 공통 UI 컴포넌트 관리
- `design-tokens` 패키지: 색상, 반경, 그림자, 레이아웃, 폰트 크기, z-index, CSS 변수 토큰 관리
- 공통 컴포넌트는 배럴 엔트리로 노출하고, 상태별 UI는 Storybook 스토리로 함께 관리

이 구조 덕분에 공통 UI를 화면 코드에 흩뿌리지 않고, 여러 도메인에서 반복 사용하는 요소만 패키지 단위로 관리할 수 있었습니다. 버전 관리와 배포는 Changesets 기반으로 운영해, 패키지 변경 시 영향 범위와 릴리즈 이력을 추적할 수 있게 했습니다.

```tsx title="domain.ts"
// 설명용 예시: 실제 패키지 구조와 이름이 아님
export { Button } from './button/domainButton'
export { Input } from './input/domainInput'
export { Card } from './card/domainCard'
export { DialogShell } from './dialog/domainDialogShell'
export { StateCard } from './state/domainStateCard'
```

디자인 토큰은 CSS 변수를 소스로 두고, 컴포넌트는 그 변수만 참조하도록 구성했습니다. JS/TS 코드에서 필요한 경우에도 값을 직접 하드코딩하지 않고 같은 변수를 참조하는 얇은 레이어를 통해 접근했습니다.

```css title="domain.css"
/* 설명용 예시: 실제 토큰 값이 아님 */
:root {
  --color-primary: 89 86 233;
  --color-accent: 165 163 247;
  --radius-md: 0.75rem;
  --radius-lg: 1rem;
  --z-modal: 200;
}
```

```ts title="domain.ts"
// 설명용 예시: 실제 토큰 이름이 아님
export const radii = {
  md: 'var(--radius-md)',
  lg: 'var(--radius-lg)',
}
```

패키지 변경 사항은 Changesets 파일로 선언해, 어떤 패키지가 어떤 버전으로 올라가는지 릴리즈 전에 명시적으로 기록하도록 했습니다.

```md title="domain.md"
---
"ui": patch
"design-tokens": minor
---

디자인 토큰 값 변경에 따른 공통 UI 패키지 반영
```

핵심은 모든 UI를 공통화한 것이 아니라, **여러 화면에서 반복 사용하는 UI와 토큰만 패키지 단위로 승격해 공통 변경 기준을 만든 점**이었습니다.

---

## 5. Headless UI 패턴으로 접근성·동작과 스타일 분리

공통 UI를 패키지로 묶어도, Modal·Select처럼 포커스 트랩·키보드 인터랙션·ARIA 속성 같은 접근성·동작 로직이 필요한 컴포넌트를 화면마다 직접 구현하면 컴포넌트별로 구현 품질이 달라지고, 디자인이 바뀔 때마다 동작 로직까지 함께 손대야 합니다.

### 문제

Modal, Select류 컴포넌트를 화면마다 개별 구현하면 포커스 트랩, ESC 키 처리, 외부 클릭 닫기, 접근성 속성을 매번 다르게 구현하게 되고, 스타일 변경이 동작 로직에 영향을 주는 경우가 반복됐습니다.

### 적용

- Headless 컴포넌트 라이브러리(Radix UI)로 포커스 트랩·키보드 내비게이션·ARIA 속성 등 접근성·동작 로직을 위임하고, 스타일은 별도 레이어에서 관리
- `DialogShell` 같은 얇은 Shell 컴포넌트로 headless primitive를 감싸, `isDismissible`·`isCloseDisabled` 같은 옵션만으로 동작을 제어하도록 구성
- `ConfirmModal` 같은 상위 컴포넌트는 Shell 위에서 조합만 하고 접근성·동작 로직은 다시 구현하지 않음
- `class-variance-authority`·`tailwind-merge`로 variant별 스타일을 관리해, 동작과 스타일이 서로 다른 레이어에서 독립적으로 바뀔 수 있도록 분리

### 결과

- 접근성·동작 로직을 컴포넌트마다 재구현하지 않고 Shell 레벨에서 한 번만 검증
- 디자인 변경이 동작 로직에 영향을 주지 않아 유지보수 비용 감소
- 신규 모달·드롭다운류 컴포넌트를 추가할 때도 Shell을 재사용해 접근성 기준을 그대로 상속

```tsx title="domain.tsx"
// 설명용 예시: 실제 컴포넌트 이름·클래스가 아님
import * as Dialog from '@radix-ui/react-dialog'

type ShellProps = {
  isOpen: boolean
  onClose: () => void
  isDismissible?: boolean
  children: React.ReactNode
}

export function DialogShell({ isOpen, onClose, isDismissible = true, children }: ShellProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content
          onEscapeKeyDown={(이벤트) => { if (!조건) "이벤트 막기" }}
          onPointerDownOutside={(이벤트) => { if (!조건) "이벤트 막기" }}
          className="dialog-content"
        >
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
```

이 Shell 위에서 확인 모달, 알림 모달 같은 상위 컴포넌트들은 접근성·동작을 다시 구현하지 않고 스타일과 문구만 조합해 만들 수 있었습니다.

---

## 결과

FMS는 개별 화면 구현보다도, AI Workflow와 RESTful endpoint 설계 기준을 팀이 반복 사용할 수 있는 방식으로 정리한 프로젝트였습니다.

- 구현·검증 시간 약 50% 절감
- 개발 범위 약 50% 증가 상황 대응
- 리뷰 소요 시간 50% 이상 절감
- API 변경 대응·검증 시간 50% 이상 절감
- 목표보다 약 2주 조기 완료

이 프로젝트를 통해 AI 활용 방식, API 설계 원칙, 계약 검증, 공통 UI 운영 기준을 각각 따로 두지 않고 하나의 팀 개발 방식으로 묶을 수 있었습니다.
