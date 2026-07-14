---
sidebar_position: 4
title: PinHouse — 맞춤형 주거 탐색 서비스
sidebar_label: PinHouse
---

# 🏠 PinHouse — 맞춤형 주거 탐색 서비스

**2025.10 – 2026.03 · Pinhouse · FE 개발**

PinHouse는 사용자의 위치와 주거 조건을 기반으로 공공/민간 주거 공고를 탐색하고, 조건에 맞는 매물을 비교·검색할 수 있는 맞춤형 주거 탐색 서비스입니다.
<br/>이 프로젝트에서는 페이지마다 달라지는 검색 조건을 상태, Query Key, BFF 캐시 기준으로 일관되게 연결해 검색 데이터 흐름을 정리했고, 그 경험을 이후 BEMS 상태·캐시 구조 개선으로 확장했습니다.

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

## 이 프로젝트에서 맡은 역할

- 홈, 공고 목록, 글로벌 검색 UX 설계 및 구현
- Zustand·TanStack Query·BFF 기반 검색 데이터 흐름 설계
- 인증 진입 구조 정리와 초기 로딩 품질 개선
- 주거 탐색 챗봇과 검색 연결 UX 구현

---

## 핵심 문제

PinHouse에서는 홈, 글로벌 검색, 지역 검색처럼 여러 페이지가 서로 다른 검색 조건을 다루고 있었습니다. 지역, 방 유형, 대중교통, 사용자 자격 조건이 조금만 달라져도 조회 결과가 바뀌는데, 이 기준이 페이지마다 흩어져 있으면 같은 데이터를 반복 요청하게 됩니다.

이 프로젝트에서는 **어떤 상태는 페이지 간 유지해야 하고, 어떤 데이터는 조건이 같을 때만 재사용해야 하는지**를 분리해 검색 데이터 흐름을 정리했습니다.

---

## 1. Zustand 기반 검색 조건 상태 관리

페이지 간 유지해야 하는 검색 조건과 사용자 선택 상태는 클라이언트 상태로 묶고, 확정된 조건에 따라 서버에서 받아오는 데이터는 별도로 분리했습니다.

- 지역
- 방 유형
- 대중교통
- 사용자 자격 조건

이 기준을 먼저 나누어 두었기 때문에, 검색 UX가 늘어나도 어떤 값이 화면 상태인지, 어떤 값이 서버 조회 조건인지 명확하게 유지할 수 있었습니다.

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

## 2. TanStack Query 공통 Query Key 설계

조회 결과를 바꾸는 값은 모두 Query Key에 들어가야, 페이지가 달라도 조건이 같으면 같은 캐시를 재사용하고 조건이 달라지면 새로운 데이터를 조회할 수 있습니다.

PinHouse에서는 지역, 방 유형, 대중교통, 자격 조건처럼 결과를 바꾸는 값을 공통 Query Key에 포함했습니다.

### 조건별 동작

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

## 3. BFF 기반 조건별 캐시 경계

클라이언트 캐시가 없을 때도, 조건이 같은 요청이라면 서버 단에서 다시 재사용할 수 있어야 합니다. 그래서 BFF에서는 정규화된 검색 조건을 기준으로 조건별 캐시를 조회하고, 동일 조건 데이터가 없을 때만 원본 API를 호출하도록 정리했습니다.

이 구조 덕분에 페이지 구조를 유지하면서도 조건별 캐시 일관성을 확보할 수 있었습니다.

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

## 4. BEMS 상태·캐시 구조로 확장

PinHouse에서 정리한 것은 검색 화면 하나를 위한 구조가 아니었습니다. 상태 소유권 분리, 공통 Query Key, BFF 캐시 경계 설계는 이후 BEMS 리팩터링에서도 그대로 활용할 수 있는 기준이었습니다.

그래서 다음 요소를 BEMS 개선에 연결했습니다.

- Zustand와 TanStack Query의 상태 소유권 분리
- 공통 Query Key 기준
- BFF 캐시 경계 설계

이 경험을 바탕으로 현업에서 반복 API 요청과 상태 관리 구조를 더 안정적으로 정리할 수 있었습니다.

---

## 5. 추가로 구현한 서비스 품질 개선

PinHouse는 검색 상태와 캐시 구조가 핵심이었지만, 서비스 품질을 높이기 위한 다른 개선도 함께 진행했습니다.

- 홈·공고 목록·글로벌 검색 UX 설계·구현
- 클라이언트 인증을 Next.js 서버 리다이렉트로 전환
- 인증 Spinner 제거, First Load JS 10% 이상 감소
- 의도 분류·슬롯 추출 기반 주거 탐색 챗봇
