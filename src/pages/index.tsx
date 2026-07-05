import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import '../css/custom.css';

const STRENGTHS = [
  {
    title: '팀을 위한 기준을 만들고 정착시킵니다',
    desc: '검증 기준, 리뷰 방식, 릴리즈 절차를 문서화해 팀원 전체가 같은 방식으로 구현하고 검증할 수 있게 만들었습니다.',
    evidence: '팀 공통 작업 기준과 절차 문서화',
    link: '/intro',
  },
  {
    title: '기술 병목을 측정하고 해결합니다',
    desc: '체감이 아니라 수치로 병목을 확인하고, 브라우저 렌더링과 데이터 정합성 문제를 함께 손봅니다.',
    evidence: 'BEMS 화면 반영 지연 3~5초 → 1초 이내',
    link: '/projects/bems#1-실시간-데이터-전환-및-네트워크-최적화',
  },
  {
    title: 'OpenAPI → Zod로 계약 검증을 자동화합니다',
    desc: '수동 타입 정의 대신 스펙 변경이 타입 생성과 런타임 검증까지 한 번에 이어지도록 연결해 백엔드 소통 비용과 계약 위반 대응을 줄였습니다.',
    evidence: 'FMS에서 OpenAPI → Zod 자동화 적용',
    link: '/projects/fms#3-openapi--zod-타입-자동화',
  },
  {
    title: '실시간 제어 흐름을 안정화합니다',
    desc: '연결 지점, 중복 처리, 저장 구조를 분리해 응답성과 안정성을 높이고, 검증 흐름도 선택적으로 접목했습니다.',
    evidence: '원격 제어 응답 지연 10초+ → 1초 이내',
    link: '/projects/hvac-control#1-소켓-생성-지점-통합',
  },
];

const HIGHLIGHTS = [
  {
    label: 'Workflow',
    title: 'FMS',
    summary: '사이드 프로젝트에서 검증한 AI Agents 워크플로우를 전체 적용해 병렬 개발 구조와 팀 공통 작업 기준을 정착시킨 프로젝트입니다.',
    result: '2인 체제로 설비·ERP 전 도메인 커버',
    tags: ['Next.js', 'VSA', 'Zod', 'Playwright'],
    link: '/projects/fms',
  },
  {
    label: 'Performance',
    title: 'BEMS',
    summary: '실시간 데이터 성능과 정합성 문제를 기술적으로 해결하고, 측정 기반 검증 체계를 만든 프로젝트입니다.',
    result: '화면 반영 3~5초 → 1초 이내',
    tags: ['React', 'TypeScript', 'Web Worker', 'react-query'],
    link: '/projects/bems',
  },
  {
    label: 'Realtime',
    title: '원격 제어 및 모니터링',
    summary: '실시간 제어 구조를 안정화하고, 검증 관련 워크플로우를 부분 접목해 응답성과 신뢰성을 함께 개선한 프로젝트입니다.',
    result: '제어 응답 10초+ → 1초 이내',
    tags: ['AWS IoT Core', 'Lambda', 'DynamoDB', 'Socket'],
    link: '/projects/hvac-control',
  },
];

const SIDE_PROJECTS = [
  {
    label: 'Product',
    title: 'SAJU:ME',
    summary: 'PinHouse에서 다듬은 검증 흐름을 바탕으로 운영 도구, Edge 배포, 릴리즈 구조까지 확장했습니다.',
    result: '검증한 방식을 운영·배포 구조까지 확장',
    tags: ['Next.js 15', 'Cloudflare', 'OpenAPI', 'Zod'],
    link: '/projects/saju',
  },
  {
    label: 'Frontend',
    title: 'PinHouse',
    summary: '검증 흐름을 탐색하며 SSR 경계와 인증 진입 구조의 병목을 찾아 프론트엔드 기준을 다듬었습니다.',
    result: 'SSR 병목 발굴 및 First Load JS 10%+ 절감',
    tags: ['Next.js', 'SSR', 'TanStack Query', 'Zod'],
    link: '/projects/pinhouse',
  },
];

const PORTFOLIO_AREAS = [
  {
    title: '대표 프로젝트',
    desc: '핵심 문제 해결 방식과 결과를 중심으로 정리한 프로젝트 문서입니다.',
    links: [
      { label: '소개', to: '/intro' },
      { label: 'BEMS', to: '/projects/bems' },
      { label: 'FMS', to: '/projects/fms' },
      { label: '원격 제어', to: '/projects/hvac-control' },
    ],
  },
  // Hidden for now due to sensitive architecture/security details.
  // {
  //   title: '구조와 렌더링',
  //   desc: '프로젝트에서 선택한 구조, SSR 경계, 공통 렌더링 기준을 정리한 문서입니다.',
  //   links: [
  //     { label: '프로젝트 아키텍처', to: '/architecture/project-architecture' },
  //     { label: 'SSR 인증/렌더링', to: '/architecture/ssr-auth-rendering' },
  //     { label: 'Merge Gate', to: '/quality/merge-gate-ci' },
  //   ],
  // },
  {
    title: '작업 기준과 자동화',
    desc: '검증 기준, 리뷰 방식, 자동화 흐름을 문서화한 기록입니다.',
    links: [
      { label: '워크플로우 개요', to: '/ai-workflow/overview' },
      { label: '검증 파이프라인', to: '/ai-workflow/agent-pipeline' },
      { label: '스킬 시스템', to: '/ai-workflow/skill-system' },
    ],
  },
];

export default function Home() {
  return (
    <Layout title="포트폴리오" description="박경찬 프론트엔드 엔지니어 포트폴리오">
      <div className="hero-section">
        <div className="container hero-layout">
          <div className="hero-copy">
            <div className="hero-badge">Frontend Engineer · 약 4년 경력 · 팀 리딩 경험</div>
            <h1 className="hero-title">박경찬 · Frontend Engineer</h1>
            <p className="hero-subtitle">
              팀의 작업 기준을 만들고, 기술 병목을 해결하고, 사이드 프로젝트에서 검증한 방식을
              현업 프로젝트에 전체 또는 부분적으로 접목하는 방식으로 문제를 풀어왔습니다.
            </p>

            <div className="notice-box">
              <div className="notice-box-label">Narrative</div>
              <p className="notice-box-text">
                프로젝트에서 발견한 문제와 해결 방식, 그리고 그 결과를 정리한 포트폴리오입니다.
              </p>
            </div>
          </div>

          <div className="hero-panel">
            <div className="hero-panel-label">Selected Evidence</div>
            <div className="hero-metric">
              <strong>3~5초 → 1초</strong>
              <span>BEMS 렌더링 지연 단축</span>
            </div>
            <div className="hero-metric">
              <strong>10초+ → 1초</strong>
              <span>원격 제어 응답 지연 개선</span>
            </div>
            <div className="hero-metric">
              <strong>2인 체제 유지</strong>
              <span>FMS 병렬 개발 구조 정착</span>
            </div>
            <div className="hero-links">
              <Link to="/intro" className="hero-link-primary">소개</Link>

            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="container">
          <p className="section-title">대표 프로젝트</p>
          <div className="project-group">
            <div className="project-group-head">
              <h2 className="project-group-title">회사 프로젝트</h2>
              <p className="project-group-desc">팀 기준 정착, 기술 병목 해결, AI Workflow 전체 적용과 부분 적용을 보여주는 실무 프로젝트입니다.</p>
            </div>
          <div className="highlight-grid">
            {HIGHLIGHTS.map((item) => (
              <Link key={item.title} to={item.link} className="highlight-card">
                <div className="highlight-label">{item.label}</div>
                <div className="highlight-title">{item.title}</div>
                <p className="highlight-summary">{item.summary}</p>
                <div className="highlight-result">{item.result}</div>
                <div className="tag-list">
                  {item.tags.map((tag) => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
          </div>

          <div className="project-group">
            <div className="project-group-head">
              <h2 className="project-group-title">사이드 프로젝트</h2>
              <p className="project-group-desc">현업에 가져갈 작업 방식과 검증 흐름을 주도적으로 다듬고 검증한 프로젝트입니다.</p>
            </div>
            <div className="highlight-grid highlight-grid-side">
              {SIDE_PROJECTS.map((item) => (
                <Link key={item.title} to={item.link} className="highlight-card">
                  <div className="highlight-label">{item.label}</div>
                  <div className="highlight-title">{item.title}</div>
                  <p className="highlight-summary">{item.summary}</p>
                  <div className="highlight-result">{item.result}</div>
                  <div className="tag-list">
                    {item.tags.map((tag) => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <hr className="divider" />

      <div className="section">
        <div className="container">
          <p className="section-title">핵심 강점</p>
          <div className="strength-grid">
            {STRENGTHS.map((item) => (
              <Link key={item.title} to={item.link} className="strength-card">
                <div className="strength-card-title">{item.title}</div>
                <p className="strength-card-desc">{item.desc}</p>
                <div className="strength-card-evidence">{item.evidence}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <hr className="divider" />

      <div className="section">
        <div className="container">
          <p className="section-title">문서 영역</p>
          <div className="path-grid">
            {PORTFOLIO_AREAS.map((path) => (
              <div key={path.title} className="path-card">
                <div className="path-card-title">{path.title}</div>
                <p className="path-card-desc">{path.desc}</p>
                <div className="path-link-list">
                  {path.links.map((link) => (
                    <Link key={link.to} to={link.to} className="path-link">
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <hr className="divider" />

      <div className="contact-row">
        <a href="mailto:developfff@gmail.com" className="contact-link">
          ✉ developfff@gmail.com
        </a>
        <a href="https://github.com/kyungchan3007" target="_blank" rel="noreferrer" className="contact-link">
          GitHub
        </a>
      </div>
    </Layout>
  );
}
