export type DetailSlide = {
  no: string;
  title: string;
  subtitle: string;
  problem?: string;
  diagram?: string;
  tree?: string;
  code?: string;
  points: { label: string; desc: string }[];
};

export const AI_HARNESS_SLIDES: DetailSlide[] = [
  {
    no: '01',
    title: 'AI 개발 체계 — 4축 설계',
    subtitle: 'Intent · Context · Harness · Orchestration',
    problem:
      '제약 없이 맡긴 AI는 관련 없는 파일까지 읽어 토큰이 늘고, 규칙을 벗어난 코드를 되돌리는 데 시간이 들었습니다. "AI를 어떻게 쓰나"를 엔지니어링 문제로 정의하고 아키텍처를 설계했습니다.',
    diagram: `graph LR
  A[Agentic Engineering] --> I[Intent]
  A --> C[Context]
  A --> H[Harness]
  A --> O[Orchestration]
  I --> I1[PRD · SDD · Acceptance]
  C --> C1[AGENTS.md · Progressive Disclosure]
  H --> H1[Loop · Eval · Guardrails · Observability]
  O --> O1[Subagents · Worktrees · Task DAG]`,
    points: [
      { label: 'Intent', desc: '요구사항·수용 기준을 문서화하고, 구현 전 필수 출력(읽은 문서·레이어 계획)을 고정합니다.' },
      { label: 'Context', desc: '온톨로지로 지식을 분류하고 Progressive Disclosure로 필요한 것만 로드 — 컨텍스트 토큰 30% 절감.' },
      { label: 'Harness', desc: 'Loop(구현→검증→기록)·Eval(prompt-trigger-eval)·Guardrails·Observability로 실행을 감쌉니다.' },
      { label: 'Orchestration', desc: 'Claude(구현)/Codex(검증) 역할 분리, 구현→검증→리뷰→배포 4단계 → CI 자동 배포.' },
    ],
  },
  {
    no: '02',
    title: '검증 가능한 v2 아키텍처',
    subtitle: 'Verification 직교축 · Model/Inference · HITL · prompt-trigger-eval 95%',
    problem:
      'v1을 스트레스 테스트하며 3가지 한계를 발견해, 비용·안전·품질 제약까지 반영한 개선 아키텍처로 전환했습니다.',
    diagram: `graph LR
  I[Intent] --> C[Context] --> H[Harness] --> O[Orchestration]
  H -.검증.-> V[Verification]
  V -.피드백·Spec 갱신.-> C
  M[Model / Inference] -.토큰·캐싱.-> H
  HITL[HITL 게이트] -.승인·중단·롤백.-> O`,
    code: `name: frontend-feature
description: 프론트엔드 기능 구현·변경 요청을 담당한다
references:            # Progressive Disclosure — 필요한 지식만
  - references/state-management.md
  - references/api-contract.md
gates: [domain-rule, api-contract, cache, regression]`,
    points: [
      { label: '한계 1 — 사이클', desc: 'Eval·Observability 결과가 Spec·Context로 되먹임되지 않으면 학습이 안 되는 죽은 구조가 됩니다.' },
      { label: '한계 2 — 과적재', desc: '"실행"(Loop·Tool)과 "믿게 만드는"(Eval·Guardrails) 활동을 Verification 축으로 승격·분리했습니다.' },
      { label: '한계 3 — 빠진 조각', desc: 'Model/Inference(캐싱·토큰 예산)와 HITL(승인·중단·롤백)을 명시했습니다.' },
      { label: '실증', desc: 'prompt-trigger-eval 오탐·미탐 샘플셋으로 경계를 수치화해 작업 완성률 95% 달성.' },
    ],
  },
  {
    no: '03',
    title: '2-AI 협업 시스템',
    subtitle: 'AGENTS.md SSOT · Claude + Codex · TASKS.md · JOURNAL.md · git worktree',
    problem:
      '서로 다른 두 AI(Claude·Codex)가 같은 코드베이스에서 동일 규칙으로 동작해야 했습니다. 도구에 종속되지 않는 단일 규칙 소스와, 둘의 충돌을 막는 조율 장치가 필요했습니다.',
    diagram: `graph LR
  Claude[Claude] --> S[AGENTS.md · SSOT]
  Codex[Codex] --> S
  S --> T[TASKS.md · worktree]
  S --> J[JOURNAL.md]`,
    tree: `AGENTS.md              # 허브 · 두 AI 공통 진입점
agents/
├─ intent/             # PRD · SDD · Acceptance
├─ context/            # architecture · glossary
├─ harness/            # loop · environment
├─ verification/       # Verification 축 (직교 분리)
│  ├─ evals/           # 실행 가능한 게이트
│  ├─ observability.md
│  └─ guardrails.md
└─ orchestration/
   ├─ TASKS.md         # 라이브 작업 보드
   └─ JOURNAL.md       # append-only 공유 로그`,
    points: [
      { label: '단일 진실 소스', desc: '규칙은 agents/ 트리에만, CLAUDE.md·AGENTS.md는 얇은 어댑터 → 두 AI가 같은 규칙을 공유.' },
      { label: '테스크 클레임', desc: 'TASKS.md에 owner·in-progress로 점유, 상대가 점유한 파일은 안 건드림, git worktree로 물리 분리.' },
      { label: '공유 저널', desc: 'JOURNAL.md에 누가·무엇을·왜 했는지 append-only로 기록 → 상대가 맥락을 이어받습니다.' },
    ],
  },
  {
    no: '04',
    title: 'AI 작업 실행 루프',
    subtitle: 'START → PROGRESS → FINISH · checks.sh 게이트 · HITL',
    problem:
      '설계·협업 구조를 실제 태스크의 승인·검증·완료 흐름으로 연결한 운영 규칙입니다. 한 태스크가 3단계를 지나며, PROGRESS는 게이트를 통과할 때까지 작은 변경을 반복합니다.',
    diagram: `graph LR
  S[① START] --> P[② PROGRESS]
  P -.FAIL.-> P
  P -.PASS.-> F[③ FINISH]`,
    points: [
      { label: 'START', desc: 'AC·스펙 확인 → 필요한 맥락만 로드 → TASKS.md CLAIM → task/번호 브랜치 → 계획(위험하면 승인).' },
      { label: 'PROGRESS', desc: '논리 변경 하나씩 → 컨벤션대로 구현 → checks.sh 게이트 통과까지 반복 → 버그는 진단·수정·재검증.' },
      { label: 'FINISH', desc: 'AC 실동작 검증(+스크린샷) → 체크리스트 자기 점검 → JOURNAL·TASKS done → (요청 시) 커밋·PR.' },
      { label: 'HITL 개입', desc: '되돌리기 어려운 동작·계약 변경·큰 비용·취향 개입은 착수 전 승인. 게이트 PASS + AC 충족돼야 "완료".' },
    ],
  },
];

export const OPENAPI_ZOD_SLIDES: DetailSlide[] = [
  {
    no: '01',
    title: 'API 계약 자동화 — 생성부터 검증까지',
    subtitle: 'OpenAPI · codegen · Zod 런타임 검증',
    problem:
      '스택이 바뀔 때마다 타입·클라이언트를 수동 수정해 대응이 느렸고, 계약 위반(백엔드 응답이 스펙과 다름)이 런타임에서야 뒤늦게 발견됐습니다.',
    diagram: `graph LR
  S[OpenAPI Spec] -->|codegen| T[타입 · API 클라이언트]
  T --> A[애플리케이션]
  A --> R[응답 수신]
  R --> Z{Zod 런타임 검증}
  Z -->|일치| OK[정상 처리]
  Z -->|계약 위반| X[수신 시점 차단]`,
    points: [
      { label: '단일 계약 소스', desc: 'OpenAPI를 기준으로 삼아 타입·API 클라이언트를 codegen으로 자동 생성 → 수동 수정 제거.' },
      { label: '수신 시점 검증', desc: '생성 타입에서 끝내지 않고, 수신한 응답을 Zod로 런타임까지 검증합니다.' },
      { label: '조기 발견', desc: '계약 위반을 런타임 진입 지점에서 즉시 차단해 오류 발견 시점을 앞당깁니다.' },
    ],
  },
  {
    no: '02',
    title: '런타임 검증 코드와 설계 원칙',
    subtitle: 'Zod parse · Azure RESTful 가이드 · 시간 재투입',
    problem:
      '타입 생성만으로는 실제 응답이 스펙과 다를 때를 못 잡습니다. 타입은 컴파일 타임, 실제 데이터는 런타임에 도착하기 때문입니다.',
    code: `const DomainSchema = z.object({
  id: z.string(),
  label: z.string(),
  status: z.enum(['active', 'inactive']),
});

export async function getDomain(id: string) {
  const res = await fetch(\`/api/domains/\${id}\`);
  const json: unknown = await res.json();
  return DomainSchema.parse(json); // 스펙과 다르면 여기서 throw
}`,
    points: [
      { label: '원칙 우선', desc: '개인 관습이 아니라 Microsoft Azure Architecture Center RESTful 가이드로 팀 endpoint 원칙을 먼저 고정하고, 그 위에 자동화를 얹었습니다.' },
      { label: '대응 시간 50%↓', desc: 'API 변경에 따른 타입·클라이언트 대응·검증 시간을 50% 이상 줄였습니다.' },
      { label: '수신 시점 차단', desc: '런타임에서야 발견되던 계약 위반을 진입 지점에서 조기 차단합니다.' },
      { label: '협의 감소', desc: 'endpoint 설계 재작업(협의)을 줄이고, 확보한 시간을 테스트·UX에 재투입했습니다.' },
    ],
  },
];

export const DESIGN_SYSTEM_SLIDES: DetailSlide[] = [
  {
    no: '01',
    title: '공통 UI·토큰의 제품화 — 구조',
    subtitle: 'Monorepo · apps / packages · 단일 소스',
    problem:
      '화면이 늘수록 유사 컴포넌트가 도메인별로 중복 생성되고, 색상·간격·반경 등 디자인 기준이 분산돼 공통 변경 한 건이 여러 곳의 수정을 유발했습니다.',
    diagram: `graph LR
  W[web] --> UI[ui · 공통 컴포넌트]
  AD[admin] --> UI
  UI --> DT[design-tokens · CSS 변수]`,
    points: [
      { label: '선택적 승격', desc: '모든 UI가 아니라 여러 화면에서 반복 쓰는 것만 패키지로 승격했습니다.' },
      { label: '단일 참조', desc: 'web·admin이 ui를 공유하고, ui는 design-tokens를 단일 소스로 참조합니다.' },
      { label: '파급', desc: '토큰 한 곳의 변경이 전 화면에 반영됩니다.' },
    ],
  },
  {
    no: '02',
    title: '디자인 토큰 — 색·간격·반경의 단일 소스',
    subtitle: 'design-tokens · CSS Variables',
    code: `:root {
  --color-primary: 10 143 120;   /* 팀 공통 accent */
  --radius-md: 0.75rem;
  --radius-lg: 1rem;
  --z-modal: 200;
}`,
    points: [
      { label: '중앙화', desc: '색·간격·반경·z-index를 CSS 변수 토큰으로 한 곳에 정의합니다.' },
      { label: '일관성', desc: '공통 컴포넌트는 배럴 엔트리·Storybook으로 관리해 재사용 기준을 명확히 했습니다.' },
      { label: '변경 범위', desc: '공통 UI 변경이 어디에 영향을 주는지 토큰 기준으로 예측 가능해집니다.' },
    ],
  },
  {
    no: '03',
    title: 'Changesets — 릴리즈 이력과 영향 범위 추적',
    subtitle: 'Changesets · 버전 · 영향 범위',
    code: `---
"ui": patch
"design-tokens": minor
---
디자인 토큰 값 변경에 따른 공통 UI 패키지 반영`,
    points: [
      { label: '이력 추적', desc: '패키지별 버전 변경(patch/minor)과 사유를 Changesets로 기록합니다.' },
      { label: '영향 범위', desc: '어떤 패키지가 어떻게 바뀌는지 릴리즈 전에 명확히 확인합니다.' },
      { label: '결과', desc: '단일 소스 · 재사용 기준 · 릴리즈 이력 추적을 함께 확보했습니다.' },
    ],
  },
];

export const MODAL_DETAILS = {
  'ai-harness': {
    eyebrow: 'AI Engineering',
    label: 'AI 개발 체계 — 4단계 아키텍처',
    slides: AI_HARNESS_SLIDES,
  },
  'openapi-zod': {
    eyebrow: 'Contract & Validation',
    label: 'API 계약 자동화 — 생성·검증',
    slides: OPENAPI_ZOD_SLIDES,
  },
  'design-system': {
    eyebrow: 'Design System',
    label: '공통 UI·토큰 — 모노레포 체계',
    slides: DESIGN_SYSTEM_SLIDES,
  },
} as const;

export type ModalKey = keyof typeof MODAL_DETAILS;
