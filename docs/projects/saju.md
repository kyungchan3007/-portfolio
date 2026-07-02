---
sidebar_position: 5
title: SAJU:ME
sidebar_label: SAJU:ME
---

# 🔮 SAJU:ME

**2026.03 – 2026.06 · FE 개발 · 배포**

사용자의 출생 정보로 사주를 분석하고, 일일 에너지를 기반으로 맞춤형 장소를 추천하는 한국식 운세 추천 서비스입니다.
<br/>Admin Dashboard와 Cloudflare Edge 배포로 운영 효율을 확보하고, Changesets 기반 변경 이력 관리와 CI/CD 배포 자동화로 릴리즈 흐름을 표준화했습니다.

## 기술 스택

`Next.js 15` `TypeScript` `Tailwind CSS` `Zustand` `TanStack Query` `OpenAPI` `Zod` `FSD` `Vitest` `Playwright` `Storybook` `Spring Boot` `MySQL` `Redis` `AWS` `Cloudflare`

---

## 성과 요약

| 발견 항목 | 문제 | 개선 방향 | 결과 |
|---|---|---|---|
| 사용자 이탈 | 사주 분석 로딩 시간이 길어 이탈율 높음 | 로딩 중 사주 관련 퀴즈 삽입으로 체류 유도 | 이탈율 **30%+ 감소** |
| 관리자 시스템 부재 | 운영·모니터링 수작업 | Admin Dashboard + Kakao OAuth | 관리 효율화 |
| API 계약 안정성 | 응답 타입 불일치로 인한 런타임 오류 가능성 | OpenAPI 타입 생성 + Zod 런타임 검증 적용 | API 연동 안정성 확보 |
| Edge 배포 환경 구성 | Next.js SSR을 서버리스로 배포 불가 | OpenNext.js + Cloudflare Workers + nodejs_compat | **엣지 배포 완성** |
| 릴리즈 흐름 표준화 | 패키지 변경 이력과 배포 절차가 분리되어 관리됨 | Changesets로 변경 이력 관리, CI/CD로 배포 자동화 | **릴리즈 프로세스 표준화** |

---

## SSR 인증/렌더링
SAJU:ME는 개인화된 결과와 인증 흐름이 많아, 상태 기반 진입 라우팅과 렌더 전 보안 게이트를 서버에서 먼저 처리하는 구조가 필요했습니다. 서버 컴포넌트 인증 판별부터 BFF 토큰 계층까지 이어지는 전체 흐름을 [SSR 인증/렌더링 구조](../architecture/ssr-auth-rendering.md)에 정리해 두었으니, 함께 봐주시면 감사하겠습니다.


---

## AI Agent

운영 효율을 높이고, 엣지 배포와 릴리즈 흐름 표준화를 구현했습니다.

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

### 3. 릴리즈 흐름 표준화 (Changesets + CI/CD)

패키지별 변경 범위와 변경 이력은 개발자가 Changesets로 명시하고, 실제 배포 실행은 CI/CD가 처리하도록 릴리즈 흐름을 분리했습니다.

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
- **Changesets**: 개발자가 패키지별 major·minor·patch 변경 범위와 변경 이력을 명시
- **Monorepo packages**: web, admin, ui, design-tokens 패키지 변경 범위 분리
- **Release workflow**: CI/CD에서 변경 이력 기반 배포 실행

**결과**: 패키지 변경 관리 기준 표준화, 배포 실행 **자동화**, 변경 이력 추적성 확보
