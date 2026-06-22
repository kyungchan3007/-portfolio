---
sidebar_position: 5
title: SAJU:ME
sidebar_label: SAJU:ME
---

# SAJU:ME

**2026.03 – 2026.06 · FE 개발 · 배포**

사용자의 출생 정보로 사주를 분석하고, 일일 에너지를 기반으로 맞춤형 장소를 추천하는 한국식 운세 추천 서비스입니다.
<br/>Admin Dashboard와 Cloudflare Edge 배포로 운영 효율을 확보하고, Changesets 기반 패키지 자동화로 배포 효율을 높였습니다.

## 기술 스택

`Next.js 15` `TypeScript` `Tailwind CSS` `Zustand` `TanStack Query` `FSD` `Vitest` `Playwright` `Storybook` `Spring Boot` `MySQL` `Redis` `AWS` `Cloudflare`

---

## 성과 요약

| 발견 항목 | 문제 | 개선 방향 | 결과 |
|---|---|---|---|
| 관리자 시스템 부재 | 운영·모니터링 수작업 | Admin Dashboard + Kakao OAuth | 관리 효율화 |
| Edge 배포 환경 구성 | Next.js SSR을 서버리스로 배포 불가 | OpenNext.js + Cloudflare Workers + nodejs_compat | **엣지 배포 완성** |
| 패키지 배포 자동화 | 배포 시마다 수동 버전 업데이트 후 배포 | Changesets: 개발자가 버전 선택 → CI/CD 자동 배포 | **배포 프로세스 자동화** |

---

## AI Agent

운영 효율을 높이고, 엣지 배포와 패키지 자동화를 구현했습니다.

### 1. Admin Dashboard 구축

운영팀이 수작업으로 관리하던 사용자, 커뮤니티, 알림, 모니터링을 한눈에 확인하고 관리할 수 있는 Admin Dashboard를 구축했습니다.

```tsx title="dashboar.tsx"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-content-primary">대시보드</h2>
        <p className="mt-1 text-sm text-content-muted">서비스 현황과 실시간 트래픽을 확인합니다.</p>
      </div>
      <DashboardSection />
    </div>
  );
}
```

**관리 기능:**
- 실시간 트래픽 및 요청 통계 (Cloudflare Analytics 연동)
- 커뮤니티 별 코호트 생성·편집
- 푸시 알림 발송 및 이력 관리
- 워커 에러율 및 HTTP 상태 모니터링

**인증:**
- Kakao OAuth 기반 관리자 로그인
- 환경별 (dev/staging/prod) 멀티 테넌트 구조

**결과**: 관리 업무 **자동화**, 실시간 모니터링 확보, 데이터 기반 운영 의사결정 가능

### 2. Cloudflare Edge 런타임 배포 (OpenNext.js + nodejs_compat)

Next.js SSR을 Cloudflare Workers 엣지 런타임에서 실행하기 위해 OpenNext.js와 nodejs_compat 플래그를 활용해 Node.js API 호환성을 확보했습니다.

```toml title="wrangler.toml — Before"
# Workers 런타임에서 Node.js 모듈 미지원
[env.production]
routes = [
  { pattern = "example.com", zone_id = "..." }
]

# Next.js 의존 모듈 중 일부가 Node.js API 사용 불가
```

```toml title="wrangler.toml — After"
# nodejs_compat 플래그로 Node.js 환경 에뮬레이션
[env.production]
compatibility_flags = ["nodejs_compat"]
routes = [
  { pattern = "saju.me", zone_id = "..." }
  { pattern = "docs.saju.me", zone_id = "..." }
]
```

**구현 방식:**
- **OpenNext.js**: Next.js 프로젝트를 Cloudflare Workers 호환 번들로 변환
- **nodejs_compat**: Edge Runtime에서 `crypto`, `stream` 등 Node.js 표준 라이브러리 모듈 지원
- **다중 도메인**: saju.me, docs.saju.me 서브도메인별 독립 배포
- **CAPTCHA**: Cloudflare Turnstile로 봇 공격 차단

**결과**: Next.js SSR **엣지 배포** 완성, **콜드 스타트 제거**, 글로벌 **저지연 응답** 확보

### 3. 패키지 배포 자동화 (Changesets)

패키지별 버전 갱신과 CHANGELOG 작성을 수동으로 하고 배포하던 과정을 Changesets로 체계화했습니다. 개발자가 변경 범위(major/minor/patch)를 선택하면, CI/CD가 버전 갱신·CHANGELOG 생성·배포를 자동으로 처리합니다.

```json title="package.json"
{
  "scripts": {
    "changeset": "changeset",
    "version-packages": "changeset version",
    "release": "changeset publish"
  }
}
```

**구현 방식:**
- **Changesets**: 패키지별 major·minor·patch 변경 이력 관리
- **Monorepo packages**: web, admin, ui, design-tokens 패키지 변경 범위 분리
- **Release workflow**: 변경 이력 기반 버전 갱신과 배포 절차 표준화

**결과**: 버전 결정 프로세스 표준화, 패키지 배포 과정 **자동화**, 변경 이력 추적성 확보
