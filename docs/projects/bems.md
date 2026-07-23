---
sidebar_position: 2
title: BEMS
sidebar_label: BEMS
---

# ⚡ BEMS

**신규 개발 2023.08 – 2025.08 · 운영·리팩터링 2025.09 – 현재 · ㈜TSM Technology · 과장 · FE 개발 · 팀 리딩**

운영 지표 실시간 수집·시각화 및 계층형 조회·집계 시스템에서, 상태·캐시·실시간·렌더링·품질 기준을 하나의 운영 구조로 연결하고, 클라이언트 최적화의 한계를 수치로 확인한 뒤 Next.js SSR로 아키텍처를 일괄 재구축했습니다.

## 기술 스택

`Next.js` `React` `TypeScript` `Zustand` `TanStack Query` `BFF` `Web Worker` `DevExtreme` `Vitest` `Playwright` `Storybook` `SonarQube`

---

## 성과 요약

| 항목 | 문제 | 적용 | 결과 |
|---|---|---|---|
| 상태·캐시 구조 | 동일 데이터를 여러 페이지에서 반복 요청 | Zustand·TanStack Query·BFF로 상태 소유권과 캐시 경계 분리 | 브라우저 API 요청 **40회 → 10회**, **75% 감소** |
| 실시간 처리 | 1분 단위 데이터 전환 시 네트워크와 메인 스레드 병목 발생 | Delta Update + Web Worker 분리 | 네트워크 전송량 **약 60% 감소**, 화면 반영 **3~5초 → 2초** |
| 아키텍처 한계 | 클라이언트 최적화만으로는 더 이상 반영 속도를 줄일 수 없음 | 점진 개선 대신 Next.js SSR로 아키텍처 일괄 재구축 | API 오버페칭 제거, 화면 반영 **2초 → 1초 (약 50% 단축)** |
| 크로스 브라우징 | Worker 반영 이후 Grid·Chart 잘림, 이미지 미노출, 이중 스크롤 발생 | `requestAnimationFrame`, `ResizeObserver`, 레이아웃 보정 | Chrome·Edge·Safari·Firefox 동작 일관성 확보 |
| 품질 검증 | 동일 기준 UAT 품질 이슈가 반복적으로 발생 | SonarQube, AI Reviewer, Vitest, Playwright, Storybook, UAT 연결 | UAT 품질 이슈 **500건 → 10건**, **약 98% 감소** |
| 협업 기준 | 요구사항·검증 기준·변경 이력이 맞지 않아 재작업 발생 | 요구사항 문서화, 검증 결과 기록, 변경 이력 관리 | 정기 협의 회의 **주 3회 → 1회** |
| 인증 보안 | 외부 SP가 SAML 요청-응답 상관관계(UUID)를 검증하지 않아 인증 위조 가능성 존재 | FE-BE 간 별도 state 토큰을 httpOnly 쿠키로 발급·대조하는 검증 계층 추가 | 요청-응답 상관관계 검증 확보, **약 3주 내** 대응 완료 |

---

## 맡은 역할

- 서비스 설계 · 프론트엔드 구현 · 클라이언트 커뮤니케이션 · 일정 조율 주도
- 상태·캐시·실시간·품질을 개별 최적화가 아닌 하나의 운영 구조로 연결
- 요구사항·검증 기준 문서화로 팀 공통 논의 기준 확보

---

## 핵심 문제 — 여러 층에서 동시에 터진 병목

기능 추가보다, 늘어나는 데이터·요구사항 속에서 실시간 서비스의 성능과 정합성을 유지하는 것이 핵심 과제였습니다.

- 서버 데이터와 UI 상태 혼재 → 불필요한 리렌더링
- 동일 API를 여러 페이지에서 반복 호출
- 1분 단위 전환 후 비교·갱신 연산이 메인 스레드 점유
- Worker 결과의 비동기 반영 → Grid·Chart·이미지·스크롤이 브라우저마다 깨짐
- 요구사항·검증 결과·변경 이력 불일치 → 품질 이슈·재작업 누적

---

## 1. 상태·캐시 소유권 분리 — 중복 요청 75% 감소

서버 데이터와 UI 상태를 한 덩어리로 두지 않고 소유권을 분리해, 동일 데이터의 페이지 간 재요청을 없앴습니다.

- **문제** — 상태 혼재로 변경 범위가 불명확하고 같은 데이터를 여러 화면에서 다시 조회
- **적용** — Zustand(UI 상태) / TanStack Query(서버 데이터·캐싱·리페치) 분리, 공통 Query Key로 페이지 간 재사용, BFF에 인증·사용자별 서버 캐시 위임
- **성과** — 동일 플로우 브라우저 API 요청 40회 → 10회(중복 75% 감소), 새로고침·토큰 갱신 시 Origin 재호출 방지

```ts title="domain.ts"
// 설명용 예시: 실제 Store·Query 이름이 아님
const 도메인스토어 = create<{
  선택값: string | null
  선택값설정: (id: string) => void
}>((set) => ({
  선택값: null,
  선택값설정: (id) => set({ 선택값: id }),
}))

export const 도메인키 = {
  detail: (id: string) => ['domain', 'detail', id] as const,
}
```

```ts title="domain.ts"
// 설명용 예시: 실제 캐시 구현·Key가 아님
export async function 데이터조회(사용자ID, 대상ID) {
  const 캐시키 = "사용자·대상 기준 캐시 키 생성"
  const 캐시값 = await cache.get(캐시키)

  if (캐시값) "캐시된 값 즉시 반환"

  const 원본데이터 = await requestOrigin(대상ID)
  await cache.set(캐시키, 원본데이터, "TTL 설정")

  return 원본데이터
}
```

---

## 2. Delta Update·Web Worker — 전송량 60%↓, 반영 3~5초→2초

15분 주기를 1분 단위로 바꾸는 요구에 대응하기 위해, 변경분만 주고받고 무거운 연산을 메인 스레드 밖으로 옮겼습니다.

- **문제** — 1분 단위 전면 수신 시 전송량 급증, 4,400개 비교·캐싱 연산이 메인 스레드를 점유해 UI 블로킹
- **적용** — 이전 결과 캐싱 후 변경분만 갱신하는 Delta Update, 시간·컬럼 단위 비교로 시계열 오염 방지, 비교·검증을 Web Worker로 분리, `performance.now()`·`requestAnimationFrame()`으로 수신·반영 시점 측정
- **성과** — 네트워크 전송량 약 60% 감소, 화면 반영 3~5초 → 2초, 메인 스레드 점유 최소화

여기까지가 **클라이언트 최적화의 한계**였고, 초기 조회·렌더링이 브라우저에 남아 있는 한 2초 아래로는 내려가지 않아 이후 아키텍처 재구축(4번)의 출발점이 됐습니다.

```ts title="domain.ts"
// 설명용 예시: 실제 Worker 메시지와 데이터 구조가 아님
self.onmessage = ({ data }) => {
  const 변경목록 = data.next.filter((항목) => "이전 값과 비교해 변경된 항목만 추출")

  self.postMessage({ changed: 변경목록 })
}
```

```ts title="domain.ts"
// 설명용 예시: 실제 React 상태 갱신 코드가 아님
worker.onmessage = ({ data }) => {
  setRows((현재값) => 행병합(현재값, data.changed))

  requestAnimationFrame(() => {
    grid.updateDimensions()
  })
}
```

---

## 3. 크로스 브라우징 렌더링 정리 — 4개 브라우저 동작 일관성 확보

Worker의 비동기 반영과 레이아웃 변경이 겹쳐 브라우저마다 깨지던 렌더링을, DOM 반영 이후 후속 처리를 예약하는 방식으로 정리했습니다.

- **문제** — Grid·Chart 잘림, 이미지 미노출, 이중 스크롤, Resize 이후에만 정상 표시
- **적용** — DOM 반영 후 `requestAnimationFrame`으로 후속 처리 예약, `ResizeObserver`로 컨테이너 변경 감지 후 Grid·Chart 재계산, flex 자식에 `min-width/height: 0` 명시
- **성과** — Chrome·Edge·Safari·Firefox에서 Grid·Chart·이미지·스크롤 동작 일관성 확보

```ts title="domain.ts"
// 설명용 예시: 실제 Grid API와 변수명이 아님
useEffect(() => {
  const 대상요소 = containerRef.current
  if (!대상요소) return

  const observer = new ResizeObserver(() => {
    requestAnimationFrame(() => grid.updateDimensions())
  })

  observer.observe(대상요소)
  return () => observer.disconnect()
}, [])
```

```css title="domain.css"
/* 설명용 예시: 실제 Class 이름이 아님 */
.domain-layout__content {
  flex: 1;
  min-width: 0;
  min-height: 0;
  overflow: auto;
}
```

---

## 4. SSR 아키텍처 재구축 — 화면 반영 2초→1초

남은 지연이 개별 코드가 아니라 CSR 구조 자체에서 나온다고 판단하고, 점진 개선 대신 아키텍처를 일괄 재구축했습니다.

- **문제** — `렌더→mount→fetch→재렌더` 워터폴 누적, 화면별 오버페칭 반복, Worker로 옮겨도 연산이 브라우저에 남아 기기 성능 편차 발생
- **적용** — Next.js SSR로 초기 조회·렌더링을 서버로 이동해 워터폴 제거, 서버·클라이언트 책임 경계(SoC) 재정의, 화면이 쓰는 데이터만 조회하도록 API 계약 재정의, 서버 확정 데이터 제공으로 Worker 클라이언트 연산 제거
- **성과** — 전 페이지 화면 반영 2초 → 1초 이내(약 50% 단축), 오버페칭 제거로 정합성 확보, 기기 성능 편차 해소, 팀 스택 Next.js 통일

이 재구축의 의미는 속도 수치보다, **클라이언트 최적화의 한계를 수치로 확인한 뒤 구조를 바꾸는 판단을 내렸다는 점**에 있습니다. 2초까지는 코드로 줄였고, 그 아래는 아키텍처를 바꿔야 닿는 구간이었습니다.

---

## 5. 품질 검증 체계화 — UAT 이슈 500건→10건

문제를 나중에 잡지 않고, 변경이 들어올 때 어떤 계층에서 무엇을 먼저 막을지 검증 흐름을 구조화했습니다.

- **문제** — 성능을 개선해도 동일 기준 UAT 품질 이슈가 반복
- **적용** — SonarQube(정적 분석), AI Reviewer(로직·보안·캐시 사전 점검), Vitest(함수·상태), Playwright(사용자 흐름), Storybook(UI 회귀), UAT(최종 확인)를 계층으로 연결
- **성과** — 동일 기준 UAT 품질 이슈 500건 → 10건(약 98% 감소)

---

## 6. 협업 기준 문서화 — 정기 회의 주3회→1회

요구사항과 검증 기준이 어긋나면 성능보다 커뮤니케이션 비용이 커지는 문제를, 기준 문서화로 줄였습니다.

- **문제** — 변경이 잦을수록 요구사항·검증 기준 불일치로 재작업 발생
- **적용** — 요구사항 문서화, 검증 결과 기록, 변경 이력 관리, 개발 컨벤션 정리
- **성과** — 정기 협의 회의 주 3회 → 1회, 반복 확인·오해로 인한 재작업 감소

---

## 7. SAML 요청-응답 검증 계층 — 인증 위조 방어선 확보

외부 SP가 검증하지 않는 SAML 요청-응답 상관관계를, 애플리케이션 레벨의 자체 state 토큰 대조로 보완했습니다.

- **문제** — 외부 제어 시스템 SP가 응답의 UUID(요청 상관관계)를 검증하지 않아, 정당한 요청 없이도 응답 위조로 접근 가능한 갭을 코드 분석으로 확인
- **적용** — SP 코드 수정 불가 상황에서 별도 검증 계층 추가: 로그인 시 BEMS 사용자 여부 선확인 → `random` state 값을 httpOnly 쿠키에 저장(SAML 왕복과 무관한 FE-BE 전용 채널) → IdP 인증 결과 수신 후 쿠키 state와 문자열 비교로 최종 로그인 결정 (OAuth state 파라미터와 동일 원리)
- **성과** — 외부 SP가 안 하는 요청-응답 바인딩을 자체 확보, httpOnly 쿠키로 state XSS 탈취 차단, 코드 분석부터 적용까지 약 3주 내 대응

```ts title="domain.ts"
// 설명용 예시: 실제 API·쿠키 이름이 아님

// 1. 사용자 확인 — 등록된 사용자인지 확인
export async function 로그인요청(사용자ID) {
  const 등록여부 = await 사용자확인(사용자ID)

  if (!등록여부) "미등록 사용자 오류로 종료"

  // 2. state 값 생성 후 httpOnly 쿠키에 저장
  "randomBytes 기반 state 값 생성"
  "httpOnly 쿠키에 저장"

  "IdP로 리다이렉트"
}

// 3. IdP 응답 이후 콜백에서 검증
export function 콜백검증(인증성공, 응답값) {
  const 저장값 = "쿠키에서 state 값 조회"
  return 인증성공 && "저장값과 응답값 일치 여부 비교"
}
```

---

BEMS는 성능만 올린 프로젝트가 아니라, 기능·품질·협업 기준을 함께 정리해 운영 가능한 프론트엔드 구조를 만든 프로젝트였습니다.
