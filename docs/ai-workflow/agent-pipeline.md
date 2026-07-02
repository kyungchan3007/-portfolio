---
sidebar_position: 7
title:  자동화 검증 워크플로우
---

# 검증·리뷰·배포를 하나로 이어붙이다

역할 분리와 스킬 시스템까지 갖추고 나니, 마지막 조각은 이걸 **하나의 파이프라인으로 이어붙이는 것**이었습니다. 구현이 끝난 코드가 검증 → 리뷰 → 배포로 자동으로 흘러가되, 수정 범위에 따라 검증 강도가 달라지도록 설계했습니다. 작은 수정에 무거운 전체 검증을 붙이면 느려지고, 위험한 변경에 가벼운 검증만 붙이면 사고가 나기 때문입니다.

이 파이프라인이 부족한 인력·촉박한 마감 속에서도 품질 기준을 강제하는 마지막 안전망이 되었습니다.

---


## 검증

구현된 코드를 자동으로 실행해 검증하도록 구성했습니다.

```bash
# 검증 실행 순서
npm run type-check          # TypeScript 타입 검사
npm run test:unit           # Vitest 단위 테스트
npm run test:e2e            # Playwright E2E 테스트
npm run build               # 빌드 성공 여부
```

**입력**: PR Draft (구현된 코드)  
**출력**: 검증 결과 (PASS / FAIL + 상세 로그)

---

### 검증 항목 개요

| 항목 | 목적 | 검증 기준 | 판정 |
|------|------|---------|------|
| TypeScript 타입 검사 | 컴파일 타임 타입 안정성 | PASS: exit code 0 | CRITICAL |
| Vitest 단위 테스트 | 함수/컴포넌트 로직 정확성 | PASS: 80% 이상 커버리지 | CRITICAL |
| Playwright E2E 테스트 | 사용자 흐름 정상 작동 | PASS: 모든 시나리오 성공 | CRITICAL |
| npm build | 번들 최적화 & 배포 가능성 | PASS: 번들 크기 임계값 이내 | MAJOR |

---

### TypeScript 타입 검사

**목적**: 컴파일 타임에 타입 불일치, null 참조, 타입 누락 감지

**검증 기준**:
- ✅ **PASS**: `npm run type-check` 성공 (exit code 0)
- ❌ **FAIL**: 타입 오류 존재

**적용 스킬**:
- **code-review-guard**: API 계약 위반 감지 (Zod 스키마 미검증, 타입 불일치)
- **best-practices**: 데이터 패턴 타입 안정성

**실패 시 처리**:
1. TypeScript 컴파일러 에러 로그 수집
2. 오류 파일 + 라인 번호 + 에러 메시지 정리
3. Codex에 전달: "검증 실패: TypeScript 타입 오류"
4. Codex가 타입 수정 후 재커밋
5. delta-only 재검증: 변경된 파일만 타입 검사

**예시**:
```
❌ FAIL
Error: Type 'null | User' is not assignable to type 'User'
  at src/features/auth/model/useAuth.ts:42

Fix: Add null check or use optional chaining
```

---

### Vitest 단위 테스트

**목적**: 함수, 컴포넌트, 훅의 로직이 정확한지 검증

**검증 기준**:
- ✅ **PASS**: 모든 테스트 성공, 커버리지 **80% 이상**
- ⚠️ **WARN**: 커버리지 60~80% (경고만, 병합 가능)
- ❌ **FAIL**: 테스트 실패 또는 커버리지 60% 미만

**적용 스킬**:
- **code-review-guard**: 도메인 로직 & 비즈니스 규칙 검증 여부 확인
- **best-practices**: 데이터 페칭, state 관리 테스트 기준

**실패 시 처리**:
1. 실패한 테스트 케이스 수집
2. 스택 트레이스 + assertion 에러 메시지 정리
3. 영향받은 함수/컴포넌트 파악
4. Codex에 전달: "검증 실패: Vitest 테스트 실패 (3/25)"
5. Codex가 로직 수정 + 테스트 추가/수정
6. delta-only 재검증: 해당 파일의 테스트만 재실행

**예시**:
```
❌ FAIL
Expected: true
Received: false

Test: src/features/auth/model/__tests__/verifyToken.test.ts
  ✓ verifyToken returns token payload (45ms)
  ✗ verifyToken rejects expired token (12ms)
  ✗ verifyToken rejects invalid signature (8ms)

Coverage: 72% (warning - increase to 80%+)
```

---

### Playwright E2E 테스트

**목적**: 사용자 흐름이 정상 작동하는지 검증 (네비게이션, 상호작용, 렌더링)

**검증 기준**:
- ✅ **PASS**: 모든 시나리오 테스트 성공
- ⚠️ **WARN**: 시간초과 경고 (일부 장비에서만, 50ms 미만)
- ❌ **FAIL**: 테스트 실패, 스크린샷 불일치, DOM 오류

**적용 스킬**:
- **web-design-guidelines**: UI 렌더링 정확성, 접근성 준수
- **best-practices**: Hydration 오류, 렌더링 성능, layout shift
- **code-review-guard**: UX 안정성 (사용자 상호작용 흐름, 상태 관리)

**실패 시 처리**:
1. 실패한 시나리오 + 오류 메시지 수집
2. 스크린샷 비교 (기대값 vs 실제값) 첨부
3. DOM 스냅샷, 콘솔 에러 수집
4. Codex에 전달: "검증 실패: E2E 테스트 실패 (로그인 흐름)"
5. Codex가 UI/로직 수정
6. delta-only 재검증: 영향받은 사용자 흐름 시나리오만 재실행

**예시**:
```
❌ FAIL
Scenario: User can login and access dashboard

Step: Click login button
  ✓ Navigate to /auth/login
  ✓ Fill email input
  ✓ Fill password input
  ✗ Click submit button
    Expected: Redirect to /dashboard
    Received: Redirect to /auth/login (re-render loop detected)

Screenshot comparison attached (diff: 3.2% pixels)
```

---

### 빌드 성공 여부 (npm build)

**목적**: 전체 번들이 최적화되어 배포 가능한 상태인지 확인

**검증 기준**:
- ✅ **PASS**: 빌드 성공, 번들 크기 임계값 이내
- ⚠️ **WARN**: 번들 크기 증가 10~20% (경고, 리뷰 권장)
- ❌ **FAIL**: 빌드 실패 또는 번들 크기 20% 이상 증가

**적용 스킬**:
- **bundle-size-optimization (best-practices)**: 배럴 파일 제거, dynamic import 사용 여부
- **best-practices**: 번들 크기, 코드 스플리팅, 불필요한 의존성
- **code-review-guard**: dead code, 미사용 import 제거

**실패 시 처리**:
1. 빌드 에러 로그 또는 번들 분석 리포트 수집
2. 크기 증가 항목 파악 (어떤 패키지/모듈이 증가했는가)
3. Codex에 전달: "검증 실패: 번들 크기 25% 증가 (best-practices 위반)"
4. Codex가 최적화 (배럴 import 제거, dynamic import 추가 등)
5. delta-only 재검증: 번들 크기 전체 확인 (영향 광범위)

**예시**:
```
⚠️ WARN
Build successful but bundle size increased

Baseline: 215 KB
Current:  248 KB (+15%)

Top increases:
  - lucide-react: 45 KB (barrel import detected)
  - react-query: 28 KB (unnecessary re-export)
  - @mui/material: 12 KB (unused components)

Action: Review bundle-barrel-imports & bundle-dynamic-imports rules
```

---

### 검증 Agent의 역할 (조정자)

검증 Agent는 **4개 검증 항목을 순차 실행**하고 결과를 종합합니다:

```
Step 1️⃣: npm run type-check
         ↓ (FAIL → Codex에 전달, 재검증 대기)
         ↓ (PASS → 다음 단계)

Step 2️⃣: npm run test:unit
         ↓ (FAIL → Codex에 전달, 재검증 대기)
         ↓ (PASS → 다음 단계)

Step 3️⃣: npm run test:e2e
         ↓ (FAIL → Codex에 전달, 재검증 대기)
         ↓ (PASS → 다음 단계)

Step 4️⃣: npm run build
         ↓ (FAIL → Codex에 전달, 재검증 대기)
         ↓ (PASS → 모든 검증 완료)

✅ 최종 결과: VALIDATION PASS → 리뷰 단계로 진행
```

---

### 실패 후 처리 프로세스 (delta-only 재검증)

```
❌ 검증 Agent가 FAIL 감지 (예: TypeScript 에러)

    ↓ 에러 정보 수집 & 정제
    
📋 상세 정보 구성:
    - 실패 유형 (Type / Unit Test / E2E / Build)
    - 에러 메시지 + 파일 + 라인 번호
    - 스택 트레이스 (테스트 실패 시)
    - 스크린샷 비교 (E2E 실패 시)
    - 번들 분석 (빌드 실패 시)

    ↓ Codex에 전달
    
🔄 Codex:
    - "검증 실패: [실패 타입]"
    - 에러 로그 분석 & 근본 원인 파악
    - 코드 수정 + 테스트 추가/수정
    - 변경 사항 커밋

    ↓ delta-only 재검증 시작
    
🔁 검증 Agent의 최적화된 재검증:
    
    TypeScript 재검증:
    └─ 변경된 파일 + 영향받는 타입 정의만 검사
    
    Vitest 재검증:
    └─ 해당 파일의 테스트만 재실행 (전체 60~90초 → 10~20초)
    
    Playwright 재검증:
    └─ 영향받은 사용자 흐름 시나리오만 실행 (전체 120초 → 20~40초)
    
    npm build:
    └─ 전체 번들 검사 (캐시 활용으로 30~60초)

    ↓ 최종 결과 판정
    
✅ 모든 항목 PASS
   └─ 리뷰 단계로 진행
   
❌ 여전히 FAIL
   └─ 재수정 요청 (검증 Agent → Codex)
   └─ 최대 재시도: 3회 (무한 루프 방지)
```

**delta-only의 효과**:
- 전체 재검증: ~350초 (Type + Unit + E2E + Build)
- delta-only 재검증: ~70초 (60~80% 단축)
- 작은 수정: ~30초 (평균)

---

### 테스트 기준 & 운영 프로세스

#### 테스트 4단계별 기준

변경 유형에 따른 테스트 기준:

| 단계 | 유형 | 기본 검증 | 추가 검증 조건 | 추가 검증 |
|------|------|---------|---------|----------|
| 1단계 | 계산/순수 로직 변경 | 관련 unit test 확인 | 계산 결과가 여러 화면 재사용 / API 매핑 영향 | 영향 화면의 unit test 추가 확인 |
| 2단계 | 계산 결과 → 렌더링 연결 | unit test + 필요시 화면 smoke | CTA 노출 영향 / 사용자 흐름 변경 / 접근성 리스크 | e2e smoke + Storybook 확인 |
| 3단계 | API/캐시/인증 정책 변경 | typecheck + unit test + route/auth 분기 | React Query key 변경 / refresh·redirect·cookie 처리 변경 | e2e 시나리오 확인 |
| 4단계 | UI/UX만 수정 | 화면 smoke + 접근성 기본 확인 | 상태 변화/조건부 렌더 포함 | 2단계 또는 3단계로 승격 |

**3단계 원칙**: `typecheck`와 관련 unit test는 반드시 통과해야 함. **생략 불가**.

---

#### 테스트 파일 규칙

- **위치**: 변경 파일 폴더 아래 `test/` 하위
- **파일명**: `*.test.ts` 또는 `*.test.tsx`
- **최소 기준**: 정상 케이스 1개 + 실패/예외 케이스 1개부터 시작
- **우선 대상**: `shared/utils`, `features/*/model`, `features/*/hooks`, `entities/*/model`
- **제외**: `apps/web/src/generated/api` 아래 파일

---

#### e2e 승격 기준

아래 중 **하나라도 해당**하면 unit test만으로는 부족하고 e2e를 추가:

1. **인증 흐름** (로그인, 리프레시, 리다이렉트) 변경
2. **핵심 사용자 흐름** 변경
3. **CAPTCHA 검증 흐름** 변경
4. **사용자가 직접 겪는 에러 처리 흐름** 변경

**실행 명령**:
```bash
# 전체 E2E
npm run test:e2e

# 특정 시나리오 (chromium)
npm run test:e2e -- <spec> --project=chromium

# 모바일 환경
npm run test:e2e -- <spec> --project=mobile-chrome
```

---

#### 검증 → 리뷰 운영 프로세스

검증이 모두 통과하면, 검증 Agent는 코드를 **Reviewer Agent에 자동 전달**합니다.

```
검증 완료 (모두 PASS)
    ↓
📋 변경 분석:
    - 변경 유형을 4단계 중 하나로 분류
    - gate-matrix 기준으로 필수 스킬 결정
    - 추가 검증 조건 확인
    ↓
🔄 Reviewer Agent 트리거:
    - 해당 단계의 필수 스킬 순서 적용
    - 추가 조건 발견 시 추가 스킬로 승격
    ↓
📊 최종 판정:
    - MERGE: PASS → 병합 진행
    - MERGE: HOLD → Codex에 수정 요청
    ↓
🔁 오류 시 delta-only 재검증:
    - 변경된 부분만 재검증 (효율성 ↑)
    - Critical/Major 미해결 항목 재확인
    ↓
✅ PASS 달성 → 병합 진행
```

**4단계 분류 기준**:

| 단계 | 유형 | 필수 스킬 | 추가 가능 스킬 |
|------|------|---------|--------------|
| 1단계 | 계산/순수 로직 | `code-review-guard` | `best-practices` |
| 2단계 | 계산→렌더링 | `code-review-guard`, `best-practices` | `web-design-guidelines` |
| 3단계 | API/캐시/인증 | `code-review-guard`, `best-practices` | `best-practices` |
| 4단계 | UI/UX만 수정 | `web-design-guidelines` | 다른 단계로 승격 |

---

## 리뷰

검증 Agent가 검증 단계를 통과한 코드를 Reviewer Agent에 전달합니다.
**변경 유형에 맞는 최소 검증부터 시작하고, 추가 리스크 발견 시 상위 단계로 승격합니다.**

---

### 4단계 검증 기준

| 단계    | 유형 | 필수 스킬 | 기본 검증 | 추가 검증 조건 | 추가 스킬 |
|-------|------|---------|---------|---------|----------|
| 1단계   | 계산/순수 로직 변경 | `code-review-guard` | 관련 unit test | 계산 결과가 여러 화면 재사용 / API 매핑 영향 / 캐시 키 연결 | `best-practices` |
| 2단계   | 계산 결과 → 렌더링 연결 | `code-review-guard`, `best-practices` | unit test + 화면 smoke | CTA 노출 영향 / 사용자 흐름 변경 / 접근성 리스크 | `web-design-guidelines`, `caveman-review` |
| 3단계   | API/캐시/인증 정책 변경 | `code-review-guard`, `best-practices` | typecheck, unit test, route/auth 분기 | React Query key/invalidation 변경 / refresh·redirect·cookie 처리 변경 | `best-practices`, `caveman-review` |
| 4단계   | UI/UX만 수정 | `web-design-guidelines` | 화면 smoke, 접근성 기본 확인 | 상태 변화/조건부 렌더 포함 / metadata·layout·route 영향 | 2단계 또는 3단계로 승격 |

**3단계 원칙**: 기본적으로 가장 보수적으로 검증합니다. typecheck 통과는 필수입니다.

---

### 단계 승격 규칙

- 작업이 여러 단계에 걸치면 **가장 위험한 단계**를 기준으로 선택
- UI만 수정이라고 판단했더라도 **상태 연결, 조건부 렌더, 라우트 연관이 발견되면 즉시 승격**
- 3단계는 기본적으로 가장 보수적으로 검증
- 검증을 생략한 경우 **생략 사유와 잔여 리스크를 결과에 명시**

---

### 세부 작업 유형 매핑


| 작업 | 단계 | 필수 검증 | 추가 검증 |
|------|------|---------|---------|
| 순수 유틸/모델 계산 | 1단계 | unit test | - |
| 기능 구현/리팩터 (렌더 연결) | 2단계 | unit test, typecheck | 화면 smoke |
| 입력 폼 흐름 변경 | 2단계 | 입력/제출 unit | pending form 흐름 |
| 결과 조회 변경 | 2~3단계 | result unit, typecheck | e2e smoke |
| 상태관리/캐시 변경 | 3단계 | query unit, typecheck | e2e 시나리오 |
| BFF/API route 변경 | 3단계 | route handler unit | 실패 응답/쿠키 분기 |
| 인증/권한/로그인 흐름 변경 | 3단계 | typecheck, 인증 unit | e2e 검증 |
| 쿠키/세션/민감정보 처리 | 3단계 | cookie 옵션, console 노출 확인 | typecheck |
| UI/디자인 수정 | 4단계 | 화면 smoke | 접근성 |
| 디자인 시스템/토큰 변경 | 4단계 | Storybook build, typecheck | - |
| 성능 개선 | 2단계 | 변경 지점 성능 근거 | typecheck |
| 릴리즈 직전 통합 점검 | 전 단계 | 모든 단계 검증 적용 | 핵심 unit/e2e |

---

### Reviewer Agent 판정 기준

최종 판정은 다음 기준으로 결정합니다:

```markdown
## Critical (병합 차단)
- [ ] 런타임 에러 가능성 (null 참조, 타입 불일치)
- [ ] 보안 취약점 (XSS, 인증 누락, 민감정보 노출)
- [ ] 테스트 없는 도메인 로직
- [ ] API 계약 위반 (Zod 스키마 미검증)

## Major (병합 차단)
- [ ] 성능 문제 (불필요한 전체 리렌더링, 번들 크기 과다)
- [ ] 운영 규칙 위반
- [ ] 슬라이스 경계 위반 (index.ts 우회)
- [ ] 3단계에서 typecheck 미통과

## Minor (경고만)
- [ ] 네이밍 컨벤션 불일치
- [ ] 접근성 기본 요구사항 위반
- [ ] 코드 중복 또는 불필요한 복잡도

## 판정
- **MERGE: PASS** → 병합 허용
- **MERGE: HOLD** → Critical/Major 미해결 시 병합 차단, 수정 요청
```

---

## 배포

Reviewer Agent가 `MERGE: PASS` 판정 시 배포 Agent가 GitHub Actions를 트리거합니다.

```yaml title="deploy.yml"
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run build
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./out
```

---

## delta-only 재검증

수정 후 변경된 부분만 재검증해 불필요한 전체 재실행을 피합니다.

```
HOLD 판정 → 수정 →
  변경된 파일 범위 파악 →
  해당 슬라이스 테스트만 재실행 →
  Reviewer Agent 변경 부분만 재판정 →
  PASS 시 병합
```

---

## 이 파이프라인으로 얻은 것

처음엔 오히려 사람보다 느렸던 AI 개발이, 이 파이프라인을 갖추고 나서는 마감을 지키는 무기가 됐습니다.

- **생산성 회복** — 검증·리뷰·배포 사이클을 이어붙여 왕복 시간을 줄였습니다.
- **작업 완성율 95% 이상** — 단계별 책임 분리와 반복 튜닝으로 도달했습니다.
- **검증 효율** — delta-only 재검증으로 수정 범위만 다시 확인했습니다.
- **품질 강제** — Critical/Major를 자동 차단해, 손이 부족해도 기준이 무너지지 않게 했습니다.
