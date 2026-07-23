---
sidebar_position: 4
title: PinHouse — 맞춤형 주거 탐색 서비스
sidebar_label: PinHouse
---

# 🏠 PinHouse — 맞춤형 주거 탐색 서비스

**2025.10 – 2026.03 · Pinhouse · FE 개발**

위치·주거 조건 기반 맞춤형 주거 탐색 서비스에서, 페이지마다 달라지는 검색 조건을 상태·Query Key·BFF 캐시 기준으로 일관되게 연결하고, 그 경험을 이후 BEMS 상태·캐시 구조 개선으로 확장했습니다.

## 기술 스택

`Next.js` `TypeScript` `Zustand` `TanStack Query` `BFF` `Zod` `Vitest` `Playwright` `Storybook`

---

## 성과 요약

| 항목 | 문제 | 적용 | 결과 |
|---|---|---|---|
| 검색 조건 상태 | 홈·글로벌 검색·지역 검색마다 조건이 달라 상태가 쉽게 분산됨 | Zustand로 검색 조건과 사용자 선택 상태 관리 | 페이지 간 검색 조건 일관성 확보 |
| 공통 Query Key | 페이지가 달라도 동일 조건 데이터가 반복 요청됨 | 결과를 바꾸는 값을 공통 Query Key에 포함 | 동일 조건 클라이언트 캐시 재사용 |
| BFF 캐시 | 클라이언트 캐시가 없으면 같은 조건도 다시 원본 API 호출 | 정규화된 검색 조건 기준 cache-aside | 조건별 캐시 경계와 재사용 기준 정리 |
| 서비스 품질 | 인증 진입과 초기 로딩 흐름이 비효율적 | 서버 리다이렉트 전환 | First Load JS **10%+ 감소** |

---

## 맡은 역할

- 홈 · 공고 목록 · 글로벌 검색 UX 설계·구현
- Zustand·TanStack Query·BFF 기반 검색 데이터 흐름 설계
- 인증 진입 구조 정리 및 초기 로딩 품질 개선
- 주거 탐색 챗봇과 검색 연결 UX 구현

---

## 핵심 문제 — 페이지마다 흩어진 검색 조건

지역·방 유형·대중교통·자격 조건이 조금만 달라져도 결과가 바뀌는데, 이 기준이 페이지마다 흩어져 있어 같은 데이터를 반복 요청하고 있었습니다.

- 여러 페이지가 서로 다른 검색 조건을 다뤄 상태가 쉽게 분산
- 어떤 상태를 페이지 간 유지하고, 어떤 데이터를 조건이 같을 때만 재사용할지 경계 불명확

---

## 1. 검색 조건 상태 분리 — 페이지 간 일관성 확보

페이지 간 유지할 검색 조건·사용자 선택은 클라이언트 상태로 묶고, 확정 조건으로 서버에서 받는 데이터는 분리했습니다.

- **문제** — 검색 UX가 늘수록 화면 상태와 서버 조회 조건이 뒤섞임
- **적용** — 지역·방 유형·대중교통·자격 조건을 Zustand 검색 상태로 관리, 서버 조회 데이터는 별도 분리
- **성과** — 검색 UX가 늘어도 화면 상태와 조회 조건이 명확히 유지

```ts title="domain.ts"
// 설명용 예시: 실제 Store 이름이 아님
const 검색스토어 = create<{
  region?: string
  roomTypes: string[]
  transitTypes: string[]
  지역설정: (value?: string) => void
}>((set) => ({
  region: undefined,
  roomTypes: [],
  transitTypes: [],
  지역설정: (value) => set({ region: value }),
}))
```

---

## 2. 공통 Query Key 설계 — 동일 조건 캐시 재사용

결과를 바꾸는 값을 모두 Query Key에 포함해, 페이지가 달라도 조건이 같으면 캐시를 재사용하도록 만들었습니다.

- **문제** — 페이지가 다르면 동일 조건 데이터도 반복 요청됨
- **적용** — 지역·방 유형·대중교통·자격 조건을 정규화해 공통 Query Key에 포함
- **성과** — 동일 조건 캐시 재사용, 조건 변경 시에만 새 조회

```text
A 페이지: 서울
B 페이지: 서울
→ 동일 Query Key, 캐시 재사용

B 페이지: 서울 + 지하철
→ 새로운 Query Key, 새 조건 조회
```

```ts title="domain.ts"
// 설명용 예시: 실제 검색 조건·API 이름이 아님
function 조건정규화(입력: {
  region?: string
  roomTypes?: string[]
  transitTypes?: string[]
  eligibility?: string[]
}) {
  return {
    region: 입력.region?.trim().toUpperCase() ?? 'ALL',
    roomTypes: [...new Set(입력.roomTypes ?? [])].sort(),
    transitTypes: [...new Set(입력.transitTypes ?? [])].sort(),
    eligibility: [...new Set(입력.eligibility ?? [])].sort(),
  }
}

export const 검색키 = {
  list: (입력: Parameters<typeof 조건정규화>[0]) =>
    ['search', 조건정규화(입력)] as const,
}
```

---

## 3. BFF 조건별 캐시 경계 — 서버 단 재사용 확보

클라이언트 캐시가 없어도 동일 조건 요청은 서버에서 재사용하도록, 정규화된 조건 기준 cache-aside를 두었습니다.

- **문제** — 클라이언트 캐시가 없으면 같은 조건도 원본 API를 다시 호출
- **적용** — BFF에서 정규화된 검색 조건 기준으로 캐시 조회, 동일 조건 데이터가 없을 때만 원본 API 호출
- **성과** — 페이지 구조를 유지하면서 조건별 캐시 일관성 확보

```ts title="domain.ts"
// 설명용 예시: 실제 BFF 구현과 Key가 아님
export async function 검색결과조회(사용자ID, 원본조건) {
  const 정규화조건 = 조건정규화(원본조건)
  const 캐시키 = "사용자·정규화조건 기준 캐시 키 생성"
  const 캐시값 = await cache.get(캐시키)

  if (캐시값) "캐시된 값 즉시 반환"

  const 원본데이터 = await requestOrigin(정규화조건)
  await cache.set(캐시키, 원본데이터, "TTL 설정")

  return 원본데이터
}
```

---

## 4. BEMS 상태·캐시 구조로 확장 — 현업 반복 요청 정리

여기서 정리한 상태 소유권 분리·공통 Query Key·BFF 캐시 경계 설계를 이후 BEMS 리팩터링에 그대로 연결했습니다.

- **문제** — 검색 화면 하나를 넘어 현업 서비스의 반복 API 요청·상태 구조로 확장 필요
- **적용** — Zustand/TanStack Query 상태 소유권 분리, 공통 Query Key 기준, BFF 캐시 경계 설계를 BEMS 개선에 이식
- **성과** — 현업에서 반복 API 요청과 상태 관리 구조를 더 안정적으로 정리

---

## 5. 서비스 품질 개선 — First Load JS 10%+ 감소

검색 상태·캐시 구조 외에 서비스 품질을 높이는 개선도 병행했습니다.

- 홈·공고 목록·글로벌 검색 UX 설계·구현
- 클라이언트 인증을 Next.js 서버 리다이렉트로 전환 → 인증 Spinner 제거, First Load JS 10% 이상 감소
- 의도 분류·슬롯 추출 기반 주거 탐색 챗봇 구현
