---
sidebar_position: 2
---

# 🏷️ 버전 관리 전략

Changeset을 사용한 의미 있는 버전 관리 체계입니다.
**Minor/Major 판단은 AI가 자동으로 할 수 없으므로, 개발자의 의도 기반 수동 판단**이 필수입니다.

---

## Changeset이란

코드 변경을 **의미 있는 버전 변경(Semantic Versioning)으로 추적**하는 도구입니다.

```
프로젝트 구조
├── .changeset/
│   ├── config.json          ← Changeset 설정
│   ├── example-1234.md      ← 변경사항 기록 (자동 생성)
│   └── example-5678.md      ← 여러 변경사항 누적
├── CHANGELOG.md             ← 누적된 changelog
└── package.json             ← 버전 정보
```

---

## Minor vs Major 판단 기준

### 🟢 Minor 변경 (기능 추가, 하위 호환 유지)

- ✅ 새로운 기능 추가 (기존 기능은 영향 없음)
- ✅ 성능 개선 (API 변경 없음)
- ✅ UI/UX 개선 (상호작용 방식 변경 없음)
- ✅ 내부 리팩터링 (public API 변경 없음)

**예시**:
```typescript
// ✅ Minor: 새로운 유틸 함수 추가
export function calculateBonus(salary: number): number {
  return salary * 0.1;
}

// ✅ Minor: 기존 함수에 선택적 파라미터 추가
export function fetchUser(id: string, options?: RequestOptions) {
  // ...
}

// ✅ Minor: 내부 구현 개선 (반환값 동일)
function optimizedSort(arr: number[]): number[] {
  return arr.sort((a, b) => a - b); // 더 빠른 알고리즘 적용
}
```

---

### 🔴 Major 변경 (하위 호환성 깨짐)

- ❌ 기존 함수/API 제거
- ❌ 함수 시그니처 변경 (파라미터 제거, 반환값 타입 변경)
- ❌ 필수 파라미터 추가 (기존 호출 코드 깨짐)
- ❌ Enum/Union 타입 변경 (의존하는 코드 깨짐)
- ❌ 기본 동작 변경 (기존 코드가 의도와 다르게 작동)
- ❌ DB 스키마 변경 (마이그레이션 필요)
- ❌ API 응답 구조 변경 (클라이언트 코드 깨짐)

**예시**:
```typescript
// ❌ Major: 기존 함수 제거
// export function calculateBonus(salary: number): number { ... }

// ❌ Major: 파라미터 제거 (기존 호출 코드 깨짐)
export function fetchUser(id: string) { // options 제거
  // ...
}

// ❌ Major: 반환값 타입 변경
export function getUserName(): string | null { // string에서 변경
  // ...
}

// ❌ Major: 필수 파라미터 추가
export function createOrder(items: Item[], userId: string, timezone: string) {
  // timezone 추가로 기존 호출 깨짐
}

// ❌ Major: Enum 값 변경
export enum Status {
  PENDING = 'pending',
  COMPLETED = 'completed',
  ARCHIVED = 'archived', // 새로 추가된 값 — 기존 switch문이 모든 경우를 처리하지 않음
}
```

---

## AI가 자동 판단하기 어려운 이유

### 1️⃣ 비즈니스 의도 파악 불가

```typescript
// 코드만 보면 Minor처럼 보임
export async function getAvailableSlots(
  doctorId: string,
  date: string,
  includeBooked?: boolean  // ← 새로운 파라미터
): Promise<TimeSlot[]> {
  // ...
}
```

**하지만:**
- `includeBooked` 기본값이 `false`면 → **Minor** (하위 호환성 유지)
- `includeBooked` 기본값이 `true`면 → **Major** (기존 동작 변경)
- 기존 클라이언트가 이미 `includeBooked: false`로 호출 중이면 → **Minor**

**AI는 알 수 없음** — 기존 사용 패턴, 비즈니스 요구사항, 영향받는 클라이언트 수 등

---

### 2️⃣ 영향 범위의 불확실성

```typescript
// ❌ Major? Minor?
export function validateEmail(email: string): boolean {
  // 더 엄격한 RFC 5322 검증 추가
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
```

**결정 요소:**
- 이 함수가 얼마나 많은 곳에서 쓰이나? (내부만? API로 노출?)
- 기존 테스트가 새 규칙을 커버하나?
- 회원가입/로그인 같은 핵심 경로에 영향을 주나?

**AI는 알 수 없음** — 의존성 그래프, 프로덕션 사용 통계, 비즈니스 리스크

---

### 3️⃣ 문서화 부재

```diff
- export function processPayment(amount: number): Promise<Result>
+ export function processPayment(
+   amount: number,
+   metadata?: Record<string, any>
+ ): Promise<Result>
```

**코드 diff만으로는:**
- `metadata`가 정말 선택적인가?
- 기존 호출이 깨지지 않는가?
- 타입 체커가 잡아주나?

**AI는 추측만 함** — 개발자의 의도, 호환성 정책, 릴리즈 계획 등

---

## 수동 판단 프로세스

### PR 작성 시

```markdown
## 변경 요약
...

## 버전 변경
- [ ] **Minor**: 새 기능 추가 / 하위 호환 유지
- [ ] **Major**: API 변경 / 하위 호환성 깨짐

## Changeset 생성
> 병합 전에 다음을 실행하세요:
> `npm run changeset`
```

---

### Changeset 작성

```bash
$ npm run changeset
```

**프롬프트:**

```
Which packages would you like to include? 
✔ my-project

Which semver bump type should this be? 
❯ patch (패치 수정)
  minor (기능 추가)
  major (하위 호환성 깨짐)

Write a summary for this change (this will be in the CHANGELOG)
✔ feat: Add timezone support to appointment scheduling
```

**생성된 파일** (`.changeset/bold-tigers-run.md`):

```markdown
---
"my-project": minor
---

Add timezone support to appointment scheduling

- Customers can now specify timezone when booking appointments
- Existing appointments use system default timezone
- No breaking changes to existing API
```

---

### Changeset 검증 체크리스트

병합 전 다음을 확인하세요:

- [ ] **기존 코드가 깨지나?**
  - 타입 체커 (TypeScript) 통과?
  - 기존 호출 코드 수정 필요?

- [ ] **고객/클라이언트 영향?**
  - Mobile app이 이 API 사용?
  - 외부 개발자 의존성?
  - 문서 업데이트 필요?

- [ ] **성능/보안 변화?**
  - DB 쿼리 변경?
  - 인증 로직 변경?
  - 캐시 정책 변경?

- [ ] **롤백 계획?**
  - 문제 발생 시 즉시 롤백 가능?
  - 마이그레이션이 필요한가?

---

## 릴리즈 워크플로우

### 1️⃣ 변경사항 누적

```
개발 과정
├── PR 1: feat: Add timezone support
│   └── .changeset/bold-tigers-run.md (minor)
├── PR 2: fix: Handle null dates
│   └── .changeset/quiet-dogs-sleep.md (patch)
└── PR 3: refactor: Auth flow
    └── .changeset/loud-cats-jump.md (patch)
```

### 2️⃣ 버전 결정 및 Changelog 생성

```bash
$ npm run release
```

**자동으로 실행됨:**
- 모든 `.changeset/*.md` 파일 수집
- Semantic Versioning 계산: `1.2.3` → `1.3.0` (minor 때문에)
- `CHANGELOG.md` 생성
- `.changeset/*.md` 파일 삭제
- `package.json` 버전 업데이트

**생성된 CHANGELOG.md**:

```markdown
# Changelog

## 1.3.0

### Minor Changes
- Add timezone support to appointment scheduling

### Patch Changes
- Fix handling of null dates
- Refactor authentication flow
```

### 3️⃣ 태그 생성 및 배포

```bash
$ git tag v1.3.0
$ git push origin v1.3.0
$ npm publish
```

---

## Best Practices

### ✅ DO

1. **명확한 의도 전달**
   ```markdown
   ---
   "my-project": major
   ---
   
   Breaking: Remove deprecated `getUserById` function
   
   - Use `getUser(id)` instead
   - Migration guide: see MIGRATION.md
   ```

2. **하위 호환성 고려**
   ```typescript
   // Major 대신 Minor로 유지
   - export function setConfig(options: ConfigOptions)
   + export function setConfig(options: ConfigOptions): void
   ```

3. **문서화**
   - Changeset에 마이그레이션 가이드 포함
   - MIGRATION.md 파일 유지

---

### ❌ DON'T

1. **패치 vs Minor 혼동**
   ```typescript
   // ❌ 패치 아님 (새 기능)
   export function newUtility() { }  // minor여야 함
   ```

2. **숨겨진 Major 변경**
   ```typescript
   // ❌ Minor로 표기했지만 실제로는 Major
   export function processPayment(
     amount: number,
     currency: string  // 필수 추가 — Major인데 Minor로 표기
   )
   ```

3. **너무 많은 변경을 한 Changeset**
   ```
   ❌ 한 번에 여러 기능 + 리팩터링 + 버그 수정
   ✅ 기능별로 분리된 PR → 분리된 Changeset
   ```

---

## AI 활용 범위 (제한사항)

### AI가 할 수 있는 것 ✅
- Changeset 파일 형식 검증
- 타입 체커 통과 여부 확인
- 코드 diff 정적 분석

### AI가 할 수 없는 것 ❌
- **의도 기반 판단** → 개발자가 결정
- **영향 범위 파악** → 코드 리뷰어가 판단
- **비즈니스 리스크 평가** → PM/개발 리드가 결정

**결론: Minor/Major 판단은 개발자의 의도와 책임**
