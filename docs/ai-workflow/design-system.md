---
sidebar_position: 5
---

#  디자인 시스템 운영

디자인이 확정되지 않은 상태에서 디자인 시스템을 점진적으로 구축하는 전략입니다.

## 기본 방침 — 하이브리드 접근

처음부터 `packages/`로 분리하지 않고, `shared` 레이어 안에서 시작해서 안정화되면 패키지로 승격합니다.

```
초기              →              안정화 이후
shared/ui/         →    packages/ui/
shared/design-tokens/ → packages/design-tokens/
```

한 번에 전면 교체하지 않고 **점진 교체** 전략을 유지해요.

## 📦 단계별 목표

| 단계 | 작업 | 상태 |
|------|------|------|
| 1️⃣ | UI 인벤토리 수집 (화면별 반복 UI 목록) | ✅ 완료 |
| 2️⃣ | 디자인 토큰 체계 초안 정의 | ✅ 완료 |
| 3️⃣ | 컴포넌트 우선순위 분류 | ✅ 완료 |
| 4️⃣ | FSD 유지 기반 구조 설계 | ✅ 완료 |
| 5️⃣ | Storybook 운영, 배포/버저닝 | 🔜 디자인 확정 후 |

## 🗂️ 컴포넌트 우선순위

**v1 — 핵심 공통 컴포넌트**

Button, Input, Select, Textarea, Badge, Card, Modal

**v2 — 확장 컴포넌트**

Tabs, Toast, Dropdown, DatePicker 등

## 🏷️ DS 주석 규칙

디자인 시스템 관련 파일 수정 시 아래 형식으로 주석을 남깁니다.

```ts
// [DS] domain:home component:Button ui:button
// [DS] domain:profile component:ProfileModal ui:modal
// [DS] domain:form component:InputField ui:form
```

세 가지를 항상 포함해요:
- `domain` — 어느 화면에서 쓰이는지
- `component` — 컴포넌트 이름
- `ui` — UI 타입 (button / modal / form / card)

이 주석이 있으면 나중에 인벤토리 재수집이나 패키지 승격 작업이 훨씬 쉬워집니다.

## 📐 현재 구조

```
shared/
├── design-tokens/   ← CSS 변수 참조
└── ui/
    ├── button/
    ├── input/
    ├── card/
    ├── badge/
    ├── select/
    └── ...

packages/
├── design-tokens/   ← 토큰 패키지 (승격 완료)
└── ui/              ← UI primitive 패키지
```
