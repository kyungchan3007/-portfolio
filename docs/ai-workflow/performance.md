---
sidebar_position: 8
title: 첫 화면 성능 최적화
sidebar_label: 성능 최적화
---

# ⚡ 첫 화면 성능 최적화

**LCP 중심 · 측정 기반 병목 추적**

성능 문제는 "점수가 낮다"로 끝내면 아무것도 고칠 수 없습니다.
Lighthouse·PageSpeed 점수만 보면 *무엇을* 줄여야 할지가 아니라 *점수가 낮다는 사실*만 남습니다.
그래서 저는 첫 화면 체감 속도(LCP)를 기준으로 삼고,
**LCP attribution으로 실제 병목이 이미지인지 텍스트 렌더인지 먼저 분류한 뒤** 원인별로 대응했습니다.

목표는 "무조건 번들 축소"가 아니라 **첫 화면에 필요한 것부터 우선 최적화**하는 것이었습니다.

---

## 접근 방식 — 감이 아니라 데이터로

- **병목부터 분류** — 점수 대신 LCP attribution으로 이미지 병목 / 텍스트 렌더 병목을 구분
- **구조 문제로 해석** — unused CSS·JS를 바로 제거 대상으로 보지 않고 **공용 번들 구조 문제**로 해석
- **분리 측정** — 이미지 문제와 렌더링 문제를 나누고, 모바일·데스크톱을 각각 측정
- **측정 코드 상시화** — `useReportWebVitals`로 페이지별 LCP/FCP/TTFB를 콘솔에서 직접 확인

---

## 측정 결과 — 병목은 이미지가 아니라 렌더 지연이었다

먼저 진단으로 개선 여지를 잡았습니다. 전체 네트워크 페이로드는 약 **6,172KiB**였고,
자동 진단이 지목한 절감 여지는 다음과 같았습니다.

| 진단 항목 | 예상 절감 |
| --- | --- |
| 렌더링 차단 요청 | 약 720ms |
| 이미지 전송 | 약 2,061KiB |
| 비효율 캐시 수명 | 약 3,835KiB |
| 사용하지 않는 JavaScript | 약 51–56KiB |
| 사용하지 않는 CSS | 약 38KiB |

여기서 멈추지 않고 **LCP를 단계별로 분해**했습니다. 그러자 병목이 명확해졌습니다.

| LCP 구성 단계 | 값 |
| --- | --- |
| TTFB | 약 10ms |
| resource load delay | 약 70ms |
| resource load time | 약 80ms |
| **element render delay** | **약 1,170ms** |

LCP의 대부분이 **element render delay**에 몰려 있었습니다.
즉 이미지를 더 빨리 받는 문제가 아니라, **요소가 렌더되기까지의 지연**이 병목이었습니다.
실제로 LCP attribution을 다시 확인했을 때 LCP 대상은 **이미지가 아니라 텍스트 블록**이었습니다.

이 분해가 곧 우선순위였습니다.
이미지 전송량은 페이로드 측면에서 줄이되, **LCP 자체는 렌더 경로를 가볍게 만들어야** 개선된다 —
그래서 `next/dynamic` 분리와 전역 스크립트·CSS 제거(아래 2·3)에 무게를 실었습니다.

### 전후 실측 (web-vitals 콘솔)

| 지표 | 홈 (초기) | /preview/... (개선 후) |
| --- | --- | --- |
| LCP | 820ms | **404ms** |
| FCP | 820ms | 372ms |
| TTFB | 690.6ms | 270.8ms |
| FID | 2.2ms | 1.4ms |

:::note
값은 로컬 재측정 기준이며 페이지·환경에 따라 달라집니다.
핵심은 **분해로 병목을 특정하고, 그 지점을 겨냥해 값을 낮췄다**는 흐름입니다.
:::

---

## 1. 이미지 전송량 축소 — 페이로드를 먼저 줄이다

**문제.** 이미지 전송이 전체 페이로드의 큰 비중(진단상 약 2,061KiB 절감 여지)을 차지했고, PNG 원본이 초기 로드 경로를 무겁게 만들고 있었습니다.

**적용.**

- 홈·프리뷰 주요 이미지 PNG를 **WebP로 교체**
- 히어로 이미지를 **모바일/데스크톱 분기 자산**으로 분리해 화면에 맞는 크기만 내려받게 함
- LCP 후보가 될 수 있는 이미지에 **우선 로드**(`fetchPriority="high"`, `loading="eager"`) 설정

```domain.tsx
// LCP 후보인 히어로 이미지만 우선 로드로 승격
<Image
  src={"화면 폭에 맞춰 고른 WebP 자산"}
  alt={"히어로 대표 이미지"}
  priority          // next/image: preload + fetchPriority=high
  fetchPriority="high"
  loading="eager"
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

**결과.** 첫 화면 LCP 후보가 더 작은 포맷·해상도로 먼저 도착해, 이미지 병목으로 잡히던 LCP가 개선되었습니다.

---

## 2. 초기 렌더 경로 정리 — 비핵심을 뒤로 미루다

**문제.** 홈 첫 화면에 당장 필요 없는 클라이언트 영역까지 초기 JS에 함께 실려, 핵심 콘텐츠 렌더가 뒤로 밀렸습니다.

**적용.**

- 홈 첫 화면의 **비핵심 클라이언트 카드 영역을 `next/dynamic`으로 분리**해 초기 JS 실행량을 줄임
- 프리뷰 페이지 일부를 **SSG(`force-static`)로 전환**해 정적으로 제공

```domain.tsx
import dynamic from "next/dynamic";

// 첫 화면 밖의 비핵심 카드 — 초기 번들에서 분리
const 마케팅카드 = dynamic(() => import("./마케팅카드"), {
  ssr: false,
  loading: () => "자리만 잡아두는 스켈레톤",
});
```

```domain.ts
// 프리뷰 라우트를 빌드 타임 정적 생성으로 고정
export const dynamic = "force-static";
```

**결과.** 초기 JS 실행량이 줄어 핵심 콘텐츠가 먼저 렌더되고, 프리뷰 페이지는 정적 응답으로 첫 응답성이 개선되었습니다.

---

## 3. 공용 레이아웃 부담 축소 — 전역을 로컬로 내리다

**문제.** 전역 레이아웃과 글로벌 CSS에 페이지 전용 자원이 얹혀 있어, **모든 페이지가 쓰지도 않는 CSS/JS 비용**을 함께 부담하고 있었습니다. 이걸 "unused CSS를 지워라"가 아니라 **번들 구조 문제**로 봤습니다.

**적용.**

- 전역 레이아웃에서 **광고 스크립트 전역 주입 제거** → 광고 슬롯이 실제 렌더될 때만 AdSense 스크립트 로드
- 광고·계측 스크립트에 **지연 로드(`lazyOnload`)** 적용
- 글로벌 CSS에 있던 **페이지 전용 스타일을 각 컴포넌트 로컬 스타일로 이동**
- 홈 하단 마케팅 섹션에 **`content-visibility: auto`** 적용해 화면 밖 요소의 렌더 비용을 미룸
- **디스플레이 폰트 preload 비활성화**로 초기 요청 경쟁 완화

```domain.tsx
import Script from "next/script";

// 전역이 아니라, 광고 슬롯이 실제 렌더될 때만 로드
export function 광고슬롯() {
  return (
    <div className="광고-영역">
      <Script
        src={"AdSense 스크립트 URL"}
        strategy="lazyOnload"   // 초기 렌더 경로에서 제외
        crossOrigin="anonymous"
      />
    </div>
  );
}
```

```domain.css
/* 화면 밖 섹션의 렌더 비용을 뷰포트 진입 전까지 미룸 */
.마케팅-섹션 {
  content-visibility: auto;
  contain-intrinsic-size: auto 600px; /* 레이아웃 점프 방지용 예상 높이 */
}
```

**결과.** 공용 레이아웃에 실리던 CSS/스크립트 범위가 줄어, 첫 화면과 무관한 리소스가 초기 로드 경로에서 빠졌습니다.

---

## 4. 성능 계측 — 병목을 코드로 관찰하다

**문제.** "느린 것 같다"는 감으로는 원인을 특정할 수 없었습니다. 페이지별로 LCP/FCP/TTFB를 **실제 값으로** 봐야 했습니다.

**적용.**

- `useReportWebVitals`로 web-vitals를 붙이고, **환경변수 기반**으로 디버거를 on/off
- **LCP attribution**으로 LCP를 만든 요소가 이미지인지 텍스트 렌더인지 직접 분류

```domain.tsx
import { useReportWebVitals } from "next/web-vitals";

export function 성능계측() {
  useReportWebVitals((metric) => {
    // 디버깅 환경에서만 콘솔로 관찰
    if (process.env.NEXT_PUBLIC_PERF_DEBUG !== "on") return;

    // LCP는 attribution으로 병목 요소까지 함께 기록
    if (metric.name === "LCP") {
      console.log("LCP 값과, LCP를 만든 요소(이미지 URL 또는 텍스트 노드)");
      return;
    }
    console.log("FCP/TTFB 등 나머지 지표 값");
  });

  return null;
}
```

**결과.** 페이지별 LCP/FCP/TTFB를 상시 관찰할 수 있게 되어, 최적화 전후를 **값으로 비교**하고 이미지·렌더 병목을 분리해 대응할 수 있었습니다.

---

## 검증 방법

최적화를 감으로 끝내지 않도록, 배포 전에 여러 축으로 확인했습니다.

| 축 | 확인 내용 |
| --- | --- |
| **PageSpeed Insights** | LCP·FCP 등 지표 추이 |
| **web-vitals 콘솔 계측** | 페이지별 LCP/FCP/TTFB 실측값 |
| **LCP attribution** | 병목이 이미지인지 텍스트 렌더인지 분류 |
| **typecheck** | 최적화 과정에서의 타입 회귀 방지 |
| **Playwright E2E** | 렌더·내비게이션 등 핵심 흐름 회귀 검증 |

---

## 결과

- **병목을 정확히 특정** — LCP 분해로 병목이 이미지가 아니라 **element render delay(≈1,170ms)** 임을 확인하고, 그 지점을 겨냥
- **첫 화면 중심 우선순위 최적화** — 무조건 번들 축소가 아니라 병목 순으로 손봄
- **전역 → 로컬 전환** — 공용 레이아웃에 실리던 CSS/스크립트 범위를 축소
- **동적 import로 초기 JS 실행량 감소** — 핵심 콘텐츠 우선 렌더 유도
- **첫 화면 응답성 개선** — 측정 페이지 기준 LCP **820ms → 404ms** 수준으로 단축
- **데이터 기반 최적화** — 측정 코드와 E2E를 함께 써 감이 아니라 값으로 판단
