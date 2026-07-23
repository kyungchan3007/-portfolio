---
sidebar_position: 5
title: 성능 최적화
sidebar_label: 성능 최적화
---

# ⚡ 성능 최적화

**FMS · BEMS · 원격 제어 시스템 공통 적용 · ㈜TSM Technology · FE 개발**

점수가 낮다는 사실만으로는 아무것도 고칠 수 없습니다.
<br/>판단 기준은 **Core Web Vitals(LCP · INP · CLS)와 보조 진단 지표(TTFB · FCP)** 다섯 개로 고정했습니다. 하나만 보면 로딩은 빨라도 조작이 굼뜨거나, 반대로 응답은 빠른데 첫 화면이 늦는 상태를 놓칩니다.
<br/>여기에 지표를 값으로만 보지 않고 **attribution으로 구성 단계와 원인 요소까지 분해해 병목을 먼저 분류한 뒤**, 원인별로 대응하는 절차를 세 서비스에 같은 기준으로 적용했습니다.

## 기술 스택

`Next.js` `React` `TypeScript` `web-vitals` `attribution` `next/dynamic` `Playwright`

---

## 성과 요약

| 항목 | 문제 | 적용 | 결과 |
|---|---|---|---|
| 공통 앱 JS 과적재 | 전역 Provider와 공통 내비게이션 의존성이 모든 페이지에 실림 | 전역 Provider 범위 재설계, 라우트 그룹 단위 재배치 | 3개 서비스 감소 — BEMS **29.7%**, 원격 8.0%, FMS 6.0% |
| 공통 CSS 과적재 | 글로벌 CSS에 페이지 전용 스타일이 누적 | 페이지 전용 스타일을 컴포넌트 로컬로 이동 | 3개 서비스 감소 — BEMS **20.1%**, FMS 10.0%, 원격 5.0% |
| 조작 응답 지연 | 탭·필터가 많은 운영 화면에서 입력 후 반영이 늦음 | 초기 hydration 대상 축소, 비핵심 영역 분리 | 세 서비스 모두 INP를 Good 기준 이내로 유지 |
| 병목 특정 | 지표 값만으로는 어디를 고쳐야 할지 알 수 없음 | attribution으로 지표별 구성 단계와 원인 요소 분해 | 화면 성격별 병목 유형을 분류한 뒤 대응 순서 결정 |
| 회귀 방지 | 최적화 과정에서 기능·타입 회귀 발생 위험 | typecheck + Playwright E2E를 검증 축에 포함 | 성능 개선과 기능 회귀 검증을 함께 운영 |

---

## 실측 성과

### 공통 앱 JS

| 서비스 | 개선 전 | 개선 후 | 감소량 | 감소율 |
| --- | --- | --- | --- | --- |
| FMS | 118,400B (118.4KB) | 111,296B (111.3KB) | 7,104B | 약 6.0% |
| BEMS | 123,200B (123.2KB) | 86,600B (86.6KB) | 36,600B | **약 29.7%** |
| 원격 제어 | 126,250B (126.3KB) | 116,150B (116.2KB) | 10,100B | 약 8.0% |

### 공통 CSS 청크

| 서비스 | 개선 전 | 개선 후 | 감소량 | 감소율 |
| --- | --- | --- | --- | --- |
| FMS | 84,520B (84.5KB) | 76,068B (76.1KB) | 8,452B | 약 10.0% |
| BEMS | 100,277B (100.3KB) | 80,130B (80.1KB) | 20,147B | **약 20.1%** |
| 원격 제어 | 79,860B (79.9KB) | 75,867B (75.9KB) | 3,993B | 약 5.0% |

:::note
번들 수치는 각 서비스의 **빌드 산출물 실측값**으로 개선 전후를 동일 조건에서 비교했습니다.
감소폭 차이는 초기 상태의 차이입니다 — BEMS는 전역 Provider와 공통 내비게이션에 묶인 의존성이 가장 많아 재구성 효과가 컸습니다.
:::

---

## 1. 지표 분해 — 값이 아니라 구성 단계를 본다

`LCP 1.8초`는 느리다는 사실만 알려주고, 어디를 고쳐야 하는지는 말해주지 않습니다. 그래서 **attribution으로 지표를 구성 단계와 원인 요소까지 분해**하는 것을 첫 단계로 고정했습니다.

| 지표 | attribution이 알려주는 것 | 크면 의심할 곳 |
| --- | --- | --- |
| **TTFB** | waiting / DNS / connection / request 구간 분해 | 서버·네트워크·엣지 응답 |
| **FCP** | TTFB + 첫 페인트까지의 지연, 그 시점의 로드 상태 | 렌더 차단 CSS, 초기 페인트 경로 |
| **LCP** | TTFB / load delay / load time / **render delay** 4단계 + 대상 요소 | 단계별로 전송량 또는 렌더 경로 |
| **INP** | 입력 지연 / 처리 / 표시 구간 + **어떤 인터랙션이 느렸는지** | 이벤트 핸들러, 상태 변경, 리렌더 |
| **CLS** | 가장 크게 밀린 요소와 그 시점 | 크기 미지정 이미지, 비동기 삽입, 폰트 교체 |

분해 결과에 따라 손댈 곳이 달라집니다. LCP가 load time에 몰리면 전송량을, render delay에 몰리면 초기 실행 경로를 봐야 합니다. INP가 나쁘면 번들을 줄여도 소용없고 해당 인터랙션의 처리 구간을 봐야 합니다.

세 서비스 모두 렌더 경로와 초기 실행 구간에 지연이 몰려 있어, 전송량 축소보다 **아래 2·3번에 무게를 실었습니다.**

---

## 2. 초기 렌더 경로 정리

첫 화면에 필요 없는 클라이언트 영역까지 초기 JS에 실려 핵심 콘텐츠 렌더가 밀렸습니다.

- 비핵심 클라이언트 영역을 **`next/dynamic`으로 분리**
- 로그인 이후에만 필요한 기능은 **조건부 분리**해 초기 hydration 대상에서 제외

```domain.tsx
import dynamic from "next/dynamic";

// 첫 화면 밖의 비핵심 영역 — 초기 번들에서 분리
const 보조패널 = dynamic(() => import("./보조패널"), {
  ssr: false,
  loading: () => "자리만 잡아두는 스켈레톤",
});
```

:::note
**정적 생성(SSG)은 원격 제어 시스템에만 적용**했습니다. 사내망 온프레미스로 운영되는 FMS·BEMS는 TTFB 자체가 이미 짧아 얻을 게 없다고 판단해 대상에서 제외했습니다.
:::

---

## 3. 공통 번들 재구성 — 전역을 로컬로

- 전역 주입되던 **상태 관리 범위를 재설계**해 공통 클라이언트 JS를 화면 단위로 분리
- 공통 레이아웃의 기능성 로직을 **라우트 그룹 단위로 재배치**하고 전역 Provider 최소화
- 범용 아이콘·유틸 의존성을 **실제 사용 범위에 맞게 단순화**해 shared chunk 의존성 축소
- 글로벌 CSS의 **페이지 전용 스타일을 컴포넌트 로컬로 이동**
- 화면 밖 섹션에 **`content-visibility: auto`**, **디스플레이 폰트 preload 비활성화**

```domain.tsx
import Script from "next/script";

// 전역이 아니라, 해당 영역이 실제 렌더될 때만 로드
export function 계측영역() {
  return (
    <div className="계측-영역">
      <Script
        src={"서드파티 스크립트 URL"}
        strategy="lazyOnload"   // 초기 렌더 경로에서 제외
        crossOrigin="anonymous"
      />
    </div>
  );
}
```

```domain.css
/* 화면 밖 섹션의 렌더 비용을 뷰포트 진입 전까지 미룸 */
.하단-섹션 {
  content-visibility: auto;
  contain-intrinsic-size: auto 600px; /* 레이아웃 점프 방지용 예상 높이 */
}
```

→ 결과는 위 **실측 성과**의 공통 앱 JS·CSS 표.

---

## 4. 성능 계측 — 병목을 코드로 관찰

"느린 것 같다"로는 원인을 특정할 수 없어, 지표 값과 그 값을 만든 요소를 함께 콘솔에서 관찰하도록 계측 코드를 붙였습니다. 환경변수로 on/off 하고, 팀이 바로 쓸 수 있는 형태로 공유했습니다.

```domain.tsx
import { useReportWebVitals } from "next/web-vitals";

export function 성능계측() {
  useReportWebVitals((metric) => {
    // 디버깅 환경에서만 콘솔로 관찰
    if (process.env.NEXT_PUBLIC_PERF_DEBUG !== "on") return;

    // 지표마다 attribution이 알려주는 정보가 다르므로 나눠서 기록
    switch (metric.name) {
      case "LCP":
        console.log("4단계 분해값과, LCP를 만든 요소(이미지 URL 또는 텍스트 노드)");
        break;
      case "INP":
        console.log("입력 지연·처리·표시 구간과, 느렸던 인터랙션 대상");
        break;
      case "TTFB":
        console.log("waiting·DNS·connection·request 구간 분해값");
        break;
      default:
        console.log("FCP 등 나머지 지표 값과 로드 상태");
    }
  });

  return null;
}
```

---

## 5. 측정 → 리뷰 루프

리포트를 사람이 눈으로 훑고 판단하면 회차마다 기준이 달라집니다. 그래서 Lighthouse CLI로 **리포트 파일을 만들고, 그 파일을 성능 리뷰 입력으로 넣는** 방식으로 돌렸습니다.

```bash
npx lighthouse http://localhost:3000 \
  --preset=desktop \
  --output=html \
  --output-path=./lighthouse-report.html \
  --no-enable-error-reporting
```

`리포트 생성 → 리뷰 입력 → 병목 분류·대응 항목 도출 → 적용 → 재측정`

작업은 항상 **위험도가 낮은 순서로** 진행했습니다. 이미지·페이지 전용 CSS → 비핵심 UI 지연 로드 → 전역 Provider·레이아웃 구조 순입니다. 전역 구조가 효과는 가장 크지만 인증·알림 같은 공통 기능 회귀 위험도 가장 커서 마지막에 뒀습니다.

측정 결과를 워크플로우 입력으로 고정하니 병목 분류와 대응 우선순위가 사람이나 회차에 따라 흔들리지 않았습니다. 판단 기준과 리뷰 구성은 [코드 리뷰](../ai-workflow/code-review.md)에 정리해 두었습니다.

---

## 측정 방법

정적 진단(Lab)과 실제 브라우저 계측(RUM)을 함께 썼습니다. 한쪽만 보면 "점수는 올랐는데 체감은 그대로"이거나 "빨라진 것 같은데 근거가 없는" 상태가 됩니다.

| 축 | 도구 | 확인 내용 |
| --- | --- | --- |
| **Lab** | Lighthouse CLI | 사내 서버 배포본 대상 정적 진단 — LCP·FCP·TTFB, unused CSS/JS, render-blocking 리소스 |
| **RUM** | `useReportWebVitals` 콘솔 계측 | 사내망 배포를 포함한 전 서비스의 라우트별 FCP·LCP·TTFB·INP 실측 |
| **병목 추적** | web-vitals attribution (콘솔 계측) | 각 지표를 만든 요소와 지연 구간 분류 |
| **회귀 검증** | build · typecheck · Playwright E2E | 구조 변경에 따른 타입·기능 회귀 방지 |

**측정 순서** — 사내 서버에 배포 → Lighthouse CLI로 모바일 우선 진단 → 경고 항목을 병목으로 분류 → 계측 코드로 페이지별 실측 → 수정 후 재비교 → 구조 변경이면 build·typecheck·E2E로 회귀 확인

**지표 우선순위** — 화면 성격에 따라 봐야 할 지표가 다릅니다. 운영형 화면에 LCP만 들이대면 정작 조작 지연을 놓칩니다.

| 화면 성격 | 우선 지표 |
| --- | --- |
| 콘텐츠형·랜딩형 | LCP → FCP → TTFB |
| 운영형·상호작용형 | INP → TTFB → LCP |

---

## 결과

- **공통 앱 JS 감소** — BEMS 123.2KB → 86.6KB(29.7%), 원격 8.0%, FMS 6.0%
- **공통 CSS 청크 감소** — BEMS 100.3KB → 80.1KB(20.1%), FMS 10.0%, 원격 5.0%
- **세 서비스 모두 Core Web Vitals Good 기준 충족** — LCP·INP·CLS와 보조 지표(FCP·TTFB)까지 기준 이내로 유지
- **병목을 먼저 분류** — attribution으로 지연 구간과 원인 요소를 구분한 뒤 대응 순서 결정
- **팀 공통 기준화** — 일회성 튜닝이 아니라 세 서비스에 같은 순서로 적용 가능한 절차로 정리
