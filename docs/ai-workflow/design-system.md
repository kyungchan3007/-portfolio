---
sidebar_position: 5
sidebar_label: 디자인 시스템
---

# 디자인이 확정되기 전에 디자인 시스템을 세운 방법

디자인이 확정되지 않은 상태에서 개발을 시작해야 했습니다. 그렇다고 컴포넌트를 매번 새로 찍어내면 나중에 감당이 안 될 게 뻔했습니다. 그래서 **확정되지 않은 디자인 위에서도 굴러가는 디자인 시스템**을 점진적으로 세우는 전략을 택했습니다.

## 하이브리드 접근 — 급하게 패키지로 쪼개지 않았다

처음부터 `packages/`로 분리하지 않고, `shared` 레이어 안에서 시작해 안정화되면 패키지로 승격하는 방식을 잡았습니다.

```
초기              →              안정화 이후
shared/ui/         →    packages/ui/
shared/design-tokens/ → packages/design-tokens/
```

한 번에 전면 교체하면 확정 전 디자인 변경에 휘둘릴 위험이 컸기 때문에, **점진 교체** 전략을 유지했습니다.

## 단계별로 밟아 나갔다

| 단계 | 작업 | 상태 |
|------|------|------|
| 1️⃣ | UI 인벤토리 수집 (화면별 반복 UI 목록) | ✅ 완료 |
| 2️⃣ | 디자인 토큰 체계 초안 정의 | ✅ 완료 |
| 3️⃣ | 컴포넌트 우선순위 분류 | ✅ 완료 |
| 4️⃣ | FSD 유지 기반 구조 설계 | ✅ 완료 |
| 5️⃣ | Storybook 운영, 배포/버저닝 | 🔜 디자인 확정 후 |

## 컴포넌트에 우선순위를 매겼다

한꺼번에 다 만들지 않고, 자주 쓰이는 것부터 세웠습니다.

**v1 — 핵심 공통 컴포넌트**

Button, Input, Select, Textarea, Badge, Card, Modal

**v2 — 확장 컴포넌트**

Tabs, Toast, Dropdown, DatePicker 등

## 나중을 위해 주석 규칙을 심었다

디자인 시스템 관련 파일을 수정할 때 아래 형식으로 주석을 남기도록 했습니다.

```ts
// [DS] domain:home component:Button ui:button
// [DS] domain:profile component:ProfileModal ui:modal
// [DS] domain:form component:InputField ui:form
```

세 가지를 항상 포함하게 했습니다.

- `domain` — 어느 화면에서 쓰이는지
- `component` — 컴포넌트 이름
- `ui` — UI 타입 (button / modal / form / card)

이 주석을 남겨 둔 덕분에, 나중에 인벤토리를 다시 수집하거나 패키지로 승격할 때 훨씬 수월했습니다.

## 현재 구조

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

디자인이 확정되지 않은 상황을 리스크가 아니라 전제로 놓고 설계한 덕에, 디자인 변경에 흔들리지 않으면서도 시스템을 조금씩 굳혀 갈 수 있었습니다.
