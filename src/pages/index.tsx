import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import '../css/custom.css';

const STRENGTHS = [
  {
    title: '성능 병목을 측정하고 줄입니다',
    desc: '체감이 아니라 수치로 병목을 확인하고, 브라우저 렌더링과 네트워크 흐름을 함께 손봅니다.',
    evidence: 'BEMS 화면 반영 지연 3~5초 -> 1초 이내',
    link: '/projects/bems',
  },
  {
    title: '복잡한 실시간 흐름을 안정화합니다',
    desc: '이벤트가 꼬이는 시스템일수록 연결 지점, 중복 처리, 저장 흐름을 구조로 분리합니다.',
    evidence: '원격 제어 응답 지연 10초+ -> 1초 이내',
    link: '/projects/hvac-control',
  },
  {
    title: '반복 작업을 자동화해 팀 속도를 높입니다',
    desc: 'OpenAPI 계약, CI, 작업 기준 문서를 정리해 재작업과 검증 비용을 줄입니다.',
    evidence: 'FMS 2인 체제로 전 도메인 병렬 개발 유지',
    link: '/projects/fms',
  },
  {
    title: 'SSR 경계와 렌더링 병목을 다듬습니다',
    desc: 'PinHouse에서 인증 진입, SSR 경계, React Query 캐시 구조를 실험하며 렌더링 병목을 확인하고 개선 기준을 정리했습니다.',
    evidence: 'PinHouse 실험으로 SSR 개선 기준 정리',
    link: '/projects/pinhouse',
  },
  {
    title: '실험한 방식을 실제 현업에 연결합니다',
    desc: 'PinHouse와 SAJU:ME에서 AI Agents와 검증 흐름을 실험했고, 그 결과를 실제 현업의 작업 기준과 자동화 방식에 접목했습니다.',
    evidence: '사이드 프로젝트 실험을 현업 검증 흐름에 반영',
    link: '/projects/saju',
  },
];

const HIGHLIGHTS = [
  {
    label: 'Performance',
    title: 'BEMS',
    summary: '실시간 데이터 비교·검증 연산을 Web Worker로 분리해 메인 스레드 부하를 줄였습니다.',
    result: '화면 반영 3~5초 -> 1초 이내',
    tags: ['React', 'TypeScript', 'Web Worker', 'react-query'],
    link: '/projects/bems',
  },
  {
    label: 'Realtime',
    title: '원격 제어 및 모니터링',
    summary: 'AWS IoT Core direct write 구조를 Lambda 중간 계층과 멱등성 검증 구조로 재구성했습니다.',
    result: '제어 응답 10초+ -> 1초 이내',
    tags: ['AWS IoT Core', 'Lambda', 'DynamoDB', 'Socket'],
    link: '/projects/hvac-control',
  },
  {
    label: 'System',
    title: 'FMS',
    summary: '도메인 확장과 인원 축소가 동시에 일어난 상황에서 VSA와 검증·작업 기준을 팀 공통 구조로 정리했습니다.',
    result: '2인 체제로 설비·ERP 전 도메인 커버',
    tags: ['Next.js', 'VSA', 'Zod', 'Playwright'],
    link: '/projects/fms',
  },
];

const SIDE_PROJECTS = [
  {
    label: 'Product',
    title: 'SAJU:ME',
    summary: 'PinHouse에서 다듬은 검증 흐름을 바탕으로 운영 도구, Edge 배포, 릴리즈 구조까지 확장했습니다.',
    result: '실험 범위를 운영·배포 구조까지 확장',
    tags: ['Next.js 15', 'Cloudflare', 'OpenAPI', 'Zod'],
    link: '/projects/saju',
  },
  {
    label: 'Frontend',
    title: 'PinHouse',
    summary: '검증 흐름을 실험하며 SSR 경계와 인증 진입 구조의 병목을 찾아 프론트엔드 기준을 다듬었습니다.',
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
  {
    title: '구조와 렌더링',
    desc: '프로젝트에서 선택한 구조, SSR 경계, 공통 렌더링 기준을 정리한 문서입니다.',
    links: [
      { label: '프로젝트 아키텍처', to: '/architecture/project-architecture' },
      { label: 'SSR 인증/렌더링', to: '/architecture/ssr-auth-rendering' },
      { label: 'Merge Gate', to: '/quality/merge-gate-ci' },
    ],
  },
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
            <h1 className="hero-title">복잡해지는 운영 서비스를 <br/>구조로 정리하는 <br/>프론트엔드 엔지니어</h1>
            <p className="hero-subtitle">
              성능 병목, 실시간 동기화, 품질 검증, 협업 비용을 분리해서 보고
              구조와 기준으로 다시 묶는 방식으로 문제를 풀어왔습니다.
            </p>

            <div className="notice-box">
              <div className="notice-box-label">Narrative</div>
              <p className="notice-box-text">
                이 포트폴리오는 프로젝트를 나열하기보다 어떤 문제를 발견했고,
                왜 그 방식으로 풀었으며, 팀과 서비스에 어떤 기준을 남겼는지 보여주기 위해 정리했습니다.
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
              <Link to="/projects/fms" className="hero-link-secondary">FMS</Link>
            </div>
          </div>
        </div>
      </div>

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
          <p className="section-title">대표 프로젝트</p>
          <div className="project-group">
            <div className="project-group-head">
              <h2 className="project-group-title">회사 프로젝트</h2>
              <p className="project-group-desc">실무 환경에서 성능, 실시간 처리, 구조 설계를 해결한 프로젝트입니다.</p>
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
              <p className="project-group-desc">주도적으로 설계하고 실험한 서비스와 프론트엔드 개선 사례입니다.</p>
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
