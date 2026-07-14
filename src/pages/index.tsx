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
    link: '/projects/bems',
  },
  {
    title: 'API 계약과 설계 기준을 정리합니다',
    desc: 'OpenAPI, Zod, RESTful endpoint 기준을 연결해 계약 검증과 API 설계 협의 비용을 줄였습니다.',
    evidence: 'FMS에서 OpenAPI → Zod 자동화 적용',
    link: '/projects/fms',
  },
  {
    title: '실시간 제어 흐름을 안정화합니다',
    desc: '연결 지점, 중복 처리, 저장 구조를 분리해 응답성과 안정성을 높이고, 운영 관측 체계도 함께 정리했습니다.',
    evidence: '원격 제어 응답 지연 10초+ → 1초 이내',
    link: '/projects/hvac-control',
  },
];

const HIGHLIGHTS = [
  {
    label: 'Workflow',
    title: 'FMS',
    summary: 'AI Workflow와 RESTful endpoint 설계 기준을 팀 공통 방식으로 정리해, 도메인 확장 상황에서도 같은 기준으로 구현·검증할 수 있게 만든 프로젝트입니다.',
    result: '구현·검증 시간 약 50% 절감',
    tags: ['OpenAPI', 'Zod', 'REST API', 'Playwright'],
    link: '/projects/fms',
  },
  {
    label: 'Performance',
    title: 'BEMS',
    summary: '상태·캐시·실시간 처리·품질 검증 기준을 함께 정리해 운영 가능한 프론트엔드 구조로 개선한 프로젝트입니다.',
    result: '화면 반영 3~5초 → 1초 이내',
    tags: ['Zustand', 'TanStack Query', 'BFF', 'Web Worker'],
    link: '/projects/bems',
  },
  {
    label: 'Realtime',
    title: '원격 제어 및 모니터링',
    summary: '실시간 제어 구조와 운영 관측 체계를 함께 정리해 응답성과 신뢰성을 개선한 프로젝트입니다.',
    result: '제어 응답 10초+ → 1초 이내',
    tags: ['AWS IoT Core', 'Lambda', 'WebSocket', 'CloudWatch'],
    link: '/projects/hvac-control',
  },
];

const SIDE_PROJECTS = [
  {
    label: 'Workflow',
    title: 'SAJU:ME',
    summary: 'Skill·Ontology 기반 AI Agent Harness와 평가 구조를 만들고, 그 기준을 이후 FMS 개발 프로세스로 확장한 프로젝트입니다.',
    link: '/projects/saju',
  },
  {
    label: 'State & Cache',
    title: 'PinHouse',
    summary: 'Zustand·TanStack Query·BFF 기반 검색 상태와 캐시 구조를 정리하고, 그 기준을 이후 BEMS 개선으로 연결한 프로젝트입니다.',
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
              팀의 작업 기준을 만들고, 기술 병목을 해결하고, 사이드 프로젝트에서 정리한 기준을
              현업 프로젝트 품질 개선으로 연결하는 방식으로 문제를 풀어왔습니다.
            </p>

            <div className="notice-box">
              <div className="notice-box-label">Narrative</div>
              <p className="notice-box-text">
                프로젝트에서 발견한 문제와 해결 방식, 그리고 그 결과를 정리한 포트폴리오입니다.
              </p>
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
              <p className="project-group-desc">팀 기준 정착, 상태·캐시·실시간 처리 개선, 운영 품질 향상을 보여주는 실무 프로젝트입니다.</p>
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
              <p className="project-group-desc">공부와 시행착오를 통해 만든 기준을 실제 서비스 품질 개선으로 연결한 프로젝트입니다.</p>
            </div>
            <div className="highlight-grid highlight-grid-side">
              {SIDE_PROJECTS.map((item) => (
                <Link key={item.title} to={item.link} className="highlight-card">
                  <div className="highlight-label">{item.label}</div>
                  <div className="highlight-title">{item.title}</div>
                  <p className="highlight-summary">{item.summary}</p>
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
