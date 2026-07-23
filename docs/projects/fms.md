---
sidebar_position: 1
title: FMS
sidebar_label: FMS
---

# 🏭 FMS

**2026.01 – 2026.06 · ㈜TSM Technology · 과장 · FE 개발 · 팀 리딩**

설비 관리에서 ERP까지 확장된 복합 업무 웹 애플리케이션에서, AI Workflow와 RESTful 설계 기준을 팀 공통 표준으로 정리해 범위가 커져도 같은 기준으로 구현·검증하도록 만들었습니다.

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

## 맡은 역할

- 서비스 설계 · 프론트엔드 구현 · API 협의 · 검증 흐름 정리 전반 주도
- 팀 공통 구현·검증 기준으로서 AI Workflow와 API 설계 원칙 문서화
- OpenAPI 계약 자동화와 공통 UI 운영 기준 연결로 개발 속도·일관성 동시 확보

---

## 핵심 문제 — 확장·압박 속 기준의 부재

도메인 확장과 일정 압박이 동시에 들어오면서, 구현 자체보다 요구사항·API·검증 기준이 사람마다 달라지는 것이 더 큰 병목이었습니다.

- 구현 범위 약 50% 확대 → 작업 분담 기준 흔들림
- AI 사용해도 역할·검증 기준 미고정 → 결과 편차와 프롬프트 재작업 반복
- API 스펙 변경마다 타입·클라이언트 수동 조정 → 소통 비용 증가
- Endpoint 명명·응답 구조·Query Parameter 기준 불일치 → API 설계 협의 반복

---

## 1. AI Workflow 표준화 — 구현·검증 시간 50% 절감

역할과 검증 문맥을 한 흐름에 섞지 않고, 작업 유형별로 실행 절차와 검증 기준을 고정해 결과 편차를 없앴습니다. (상세 설계는 [AI Workflow 문서](../ai-workflow/overview.md) 참고)

- **문제** — 요구사항·API·구현·리뷰가 한 흐름에 섞이면 AI가 UX·로직·검증을 한 번에 떠안아 결과 편차 발생
- **적용** — Claude는 UX/UI 구현, Codex는 로직·API 검증·리뷰 담당 / Skill·Ontology로 작업 유형별 절차·기준 연결 / 구현→검증→리뷰→배포 단계별 컨텍스트 고정
- **성과** — 구현·검증 시간 약 50% 절감, 리뷰 시간 50% 이상 절감, 프롬프트 재작업 감소, 목표 대비 약 2주 조기 완료

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

## 2. RESTful 설계 기준 문서화 — 반복 API 협의 제거

개인 관습이 아니라 Microsoft Azure Architecture Center의 RESTful 설계 가이드를 기준으로 팀 내부 원칙을 고정해, 기능이 늘어도 설계 편차와 재협의가 커지지 않게 했습니다.

- **문제** — 기능별 Endpoint 명명·응답 구조가 달라 프론트-백엔드가 같은 문제를 반복 논의
- **적용** — 리소스 중심 URI, 명사·컬렉션 Endpoint, HTTP 메서드 책임 구분, 상태 코드·오류 규격, 리소스 관계·Query Parameter·필터/정렬/페이지네이션, 명명·계층·버전 기준을 지침으로 문서화
- **성과** — 신규 API 설계·PR 리뷰의 공통 기준 확보, OpenAPI 계약 자동화의 선행 기준으로 연결, 반복 설계 협의 감소

```text title="domain.txt"
# 설명용 예시: 실제 서비스 Endpoint가 아님
GET    /api/domains
GET    /api/domains/{domainId}
POST   /api/domains
PATCH  /api/domains/{domainId}
DELETE /api/domains/{domainId}

GET    /api/domains?region=sample&page=1&pageSize=20
```

---

## 3. OpenAPI→Zod 계약 자동화 — 변경 대응 시간 50%+ 절감

설계 기준이 구현·검증까지 이어지도록, 스펙 변경을 타입·클라이언트 생성과 Runtime 검증으로 연결했습니다.

- **문제** — 스펙 변경마다 타입·클라이언트를 수동 수정하면 대응이 느리고 계약 위반이 늦게 발견됨
- **적용** — OpenAPI 변경 → 타입·클라이언트 생성 연결, 생성 응답을 Zod로 Runtime 검증, 계약 위반을 응답 수신 시점에 차단
- **성과** — 수동 타입 작성·반복 확인 감소, 변경 대응·검증 시간 50% 이상 절감, 확보 시간을 테스트·UX에 재투입

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

## 4. 공통 UI·디자인 토큰 패키지화 — 재사용 기준 확립

모든 UI를 공통화하는 대신, 여러 화면에서 반복 쓰는 UI와 토큰만 패키지로 승격해 공통 변경 기준을 만들었습니다.

- **문제** — 화면이 늘면 표현만 비슷한 컴포넌트가 도메인별로 다시 생기고 색상·간격·반경 기준이 분산됨
- **적용** — `ui`·`design-tokens` 패키지 분리, CSS 변수를 소스로 둔 토큰 중앙화, 공통 컴포넌트는 배럴 엔트리·Storybook으로 관리, Changesets로 버전·영향 범위 추적
- **성과** — 공통 UI 변경 기준과 재사용 범위 정리, 릴리즈 이력 추적 가능

```tsx title="domain.ts"
// 설명용 예시: 실제 패키지 구조와 이름이 아님
export { Button } from './button/domainButton'
export { Input } from './input/domainInput'
export { Card } from './card/domainCard'
export { DialogShell } from './dialog/domainDialogShell'
export { StateCard } from './state/domainStateCard'
```

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

```md title="domain.md"
---
"ui": patch
"design-tokens": minor
---

디자인 토큰 값 변경에 따른 공통 UI 패키지 반영
```

---

## 5. Headless 패턴 — 접근성·동작을 Shell 레벨에서 단일화

Radix UI headless primitive를 얇은 Shell로 감싸, Modal·Select류의 포커스·키보드·ARIA 로직을 화면마다 재구현하지 않고 한 번만 검증하도록 만들었습니다.

- **문제** — Modal·Select를 화면마다 개별 구현하면 포커스 트랩·ESC·외부 클릭·ARIA 품질이 제각각이고 스타일 변경이 동작 로직에 영향
- **적용** — Radix UI에 접근성·동작 로직 위임, `DialogShell`이 primitive를 감싸 옵션만으로 동작 제어, 상위 컴포넌트는 조합만, `cva`·`tailwind-merge`로 스타일 레이어 분리
- **성과** — 접근성·동작을 Shell 레벨에서 단일 검증, 디자인 변경이 동작에 미치는 영향 제거, 신규 컴포넌트도 Shell 재사용으로 접근성 기준 상속

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

---

## 결과

개별 화면 구현을 넘어, AI 활용·API 설계·계약 검증·공통 UI 운영을 하나의 팀 개발 방식으로 묶은 프로젝트였습니다.

- 구현·검증 시간 약 50% 절감
- 개발 범위 약 50% 증가 상황 대응
- 리뷰 소요 시간 50% 이상 절감
- API 변경 대응·검증 시간 50% 이상 절감
- 목표보다 약 2주 조기 완료
