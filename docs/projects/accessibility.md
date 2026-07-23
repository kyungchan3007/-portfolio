---
sidebar_position: 4
title: 웹 접근성 개선
sidebar_label: 웹 접근성
---

# ♿ 웹 접근성 개선

**FMS · BEMS · 원격 제어 시스템 공통 적용 · ㈜TSM Technology · FE 개발**

고령 사용자·현장 운영자가 함께 쓰는 세 서비스에서 heading·landmark·ARIA·포커스·색 대비를 전면 정비하고, axe + Playwright 자동 점검으로 회귀를 막는 체계를 같은 기준으로 적용했습니다.

## 기술 스택

`Next.js App Router` `React` `TypeScript` `Semantic HTML` `WAI-ARIA` `focus-visible` `Playwright` `@axe-core/playwright`

---

## 성과 요약

| 항목 | 문제 | 적용 | 결과 |
|---|---|---|---|
| 문서 구조 | heading 순서가 어긋나고 `main` landmark가 중복 | heading 계층 정리, 중복 `main` 제거 및 landmark 재정비 | 스크린리더 탐색 경로 정상화 |
| 탭 UI 관계 | 탭과 탭패널이 시각적으로만 연결되어 보조기기에서 관계 파악 불가 | `role`·`aria-controls`·`aria-labelledby`로 관계 명시 | 탭 전환 시 현재 위치와 대상 패널 전달 |
| 진행 상태 전달 | progressbar에 접근 가능한 이름이 없어 "진행률 몇 %"만 읽힘 | 접근 가능한 이름과 값 속성 부여 | 무엇의 진행 상태인지 음성으로 전달 |
| 키보드 조작 | 링크·버튼 포커스 위치가 화면에서 보이지 않음 | `focus-visible` 기반 포커스 링 스타일 추가 | 마우스 없이도 현재 위치 식별 가능 |
| 가독성 | 요약 카드·푸터·내비게이션의 저대비 텍스트 | 텍스트 색상 대비 개선 | 저시력·고령 사용자 판독성 향상 |
| 회귀 방지 | 화면이 추가될 때마다 접근성 품질이 다시 떨어짐 | `@axe-core/playwright` E2E 자동 점검 도입 | 공개·인증 **주요 8개 경로 점검 통과** |

---

## 맡은 역할

- 접근성을 권장사항이 아니라 **릴리즈 전 확인하는 품질 기준**으로 정의·공유
- 세 서비스의 heading·landmark·ARIA 관계·포커스·색 대비 직접 점검·정비
- axe 기반 자동 점검을 E2E 파이프라인에 연결해 수동 의존 제거

---

## 핵심 문제 — 보이는 것과 쓸 수 있는 것의 간극

세 서비스 모두 화면상으로는 정상 동작했지만, 시각적으로 동작한다는 것이 사용 가능하다는 뜻은 아니었습니다.

- 스크린리더로 읽으면 heading 순서가 어긋나 문서 구조 파악 불가
- 반응형 중심 작업에서 landmark·대비·포커스 상태가 쉽게 누락
- 탭·프로그레스바 같은 상태 UI가 보조기기에 아무 의미도 전달 못 함
- 한 번 고쳐도 다음 화면이 추가되면 같은 문제 재발 → 오조작·업무 지연으로 연결

---

## 1. 문서 구조 정상화 — 스크린리더 탐색 경로 복구

heading을 시각 크기가 아니라 의미 계층 기준으로 재배치하고 landmark를 정리했습니다.

- **문제** — `h1` 다음에 `h4`가 오는 식으로 계층이 어긋나고 `main` landmark가 중복 선언되어, heading 목록으로 훑는 스크린리더 사용자가 구조를 파악 불가
- **적용** — heading을 의미 계층으로 재배치(크기는 스타일로만), 중복 `main` 제거 및 `header`·`nav`·`main`·`footer` 정리, 본문 이동 skip link 추가
- **성과** — 키보드 사용자는 내비게이션을 건너뛰고 본문 진입, 스크린리더 사용자는 heading 목록만으로 구조 파악

```domain.tsx
// 설명용 예시: 실제 레이아웃 구조가 아님
<a href="#main-content" className="skip-link">
  본문으로 바로가기
</a>

<main id="main-content">
  {children}
</main>
```

---

## 2. ARIA 관계 설계 — 상태 UI의 의미 전달

스타일로만 연결돼 있던 탭·진행 상태 UI를 ARIA 속성으로 상호 연결했습니다.

- **문제** — 탭/패널이 시각적으로만 연결돼 선택 상태·제어 대상이 보조기기에 전달 안 됨, progressbar도 값만 읽히고 무엇의 진행인지 알 수 없음
- **적용** — 탭 버튼·패널을 `role`·`aria-selected`·`aria-controls`·`aria-labelledby`로 연결, progressbar에 접근 가능한 이름·값 부여, 장식 아이콘은 `aria-hidden`·`focusable="false"`로 제외
- **성과** — 탭 전환 시 현재 선택·대상 패널 함께 전달, 장식 요소가 낭독 흐름을 끊지 않음

```domain.tsx
// 설명용 예시: 실제 컴포넌트 이름이 아님
<button
  id={`tab-${key}`}
  role="tab"
  aria-selected={selected}
  aria-controls={`panel-${key}`}
>
  {label}
</button>

<section
  id={`panel-${key}`}
  role="tabpanel"
  aria-labelledby={`tab-${key}`}
>
  {children}
</section>
```

```domain.tsx
// 장식용 아이콘은 낭독·포커스 대상에서 제외
<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24">
  <path d="..." />
</svg>
```

---

## 3. 키보드 포커스 가시성 확보

기본 아웃라인을 제거한 대신, 키보드 이동 시에만 뜨는 포커스 링을 공통 적용했습니다.

- **문제** — 디자인상 아웃라인을 제거해 키보드 이동 시 현재 위치를 화면에서 확인 불가, 마우스가 어려운 사용자는 조작 불가
- **적용** — `focus-visible` 기반 포커스 링을 공통 스타일로 적용(마우스 클릭 시 미노출, 키보드 이동 시에만 노출), 링크·버튼 등 조작 요소 전반에 동일 기준
- **성과** — 디자인을 해치지 않으면서 키보드 사용자 현재 위치 상시 표시, 포커스 스타일 기준 통일

```domain.tsx
// 설명용 예시: 실제 경로·토큰 이름이 아님
<Link
  href="/domains/sample"
  className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
>
  상세 정보 보기
</Link>
```

---

## 4. 색 대비 개선 — 저시력·고령 판독성 향상

옅은 회색으로 처리돼 사실상 읽히지 않던 보조 정보의 대비를 기준에 맞춰 올렸습니다.

- **문제** — 요약 카드·푸터·내비게이션의 저대비 텍스트가 대비 기준 미달, 저시력·고령 사용자에게 사실상 미판독
- **적용** — 저대비 텍스트 색상 상향, 정보 밀도 높은 영역 우선 정비, 색상만으로 구분하던 상태에 텍스트·아이콘 정보 병행
- **성과** — "보조 정보라 흐리게"라는 관성을 걷어내고 표시된 정보는 실제로 읽을 수 있는 기준 충족

---

## 5. axe + Playwright 회귀 테스트 — 8개 경로 자동 점검

접근성을 사람이 기억해 지키는 항목에서, CI에서 자동으로 걸리는 검증으로 옮겼습니다.

- **문제** — 한 번 고쳐도 화면이 추가되면 재발, 수동 점검으로는 기준 유지 불가
- **적용** — `@axe-core/playwright`를 E2E에 연결, 공개 페이지와 인증 필요 페이지까지 포함해 8개 경로 구성, 위반 발견 시 테스트 실패로 릴리즈 전 차단
- **성과** — 감·개인 역량이 아닌 반복 실행 가능한 검증으로 전환, 공개·인증 8개 경로 통과 유지

```domain.ts
// 설명용 예시: 실제 테스트 경로가 아님
import AxeBuilder from "@axe-core/playwright";

const 점검경로 = ["/", "/domains", "/domains/sample", "/settings"];

for (const 경로 of 점검경로) {
  test(`접근성 점검: ${경로}`, async ({ page }) => {
    await page.goto(경로);

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
}
```

---

## 결과

- **문서 구조 정상화** — heading 계층 정리, 중복 `main` 제거, landmark 재정비
- **상태 UI 의미 전달** — 탭/패널 ARIA 관계 설계, progressbar 접근 가능한 이름 부여
- **키보드 조작 보장** — `focus-visible` 기반 포커스 가시성 공통 적용
- **판독성 개선** — 저대비 텍스트 정비로 저시력·고령 사용자 가독성 향상
- **회귀 방지 체계 구축** — axe + Playwright 자동 점검으로 공개·인증 8개 경로 통과 유지
- **기능 회귀 없이 정리** — UI 리팩토링과 접근성 개선 병행하며 동작 회귀 없이 마무리

같은 기준을 [성능 최적화](/projects/performance)와 함께 운영하면서, 화면 책임과 UI 경계를 더 명확하게 정리할 수 있었습니다.
