import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import '../css/custom.css';

const TECH_CARDS = [
  {
    icon: '🏗️',
    title: 'Architecture',
    desc: 'Layered → FSD / VSA 전환. 도메인별 책임 분리와 수정 영향 범위 축소.',
    result: '수정 영향 범위 40% 축소',
    link: '/architecture/layered-to-fsd',
  },
  {
    icon: '📡',
    title: 'SSE 실시간 통신',
    desc: '폴링 방식에서 SSE로 전환. Redux 부분 갱신으로 불필요한 리렌더링 제거.',
    result: '네트워크 요청 60% 감소',
    link: '/realtime/sse-vs-polling',
  },
  {
    icon: '⚡',
    title: 'AWS IoT 제어',
    desc: 'MQTT → IoT Core → Lambda → WebSocket. 멱등성 검증으로 중복 처리 제거.',
    result: '제어 지연 23s → 1s',
    link: '/realtime/aws-iot-control',
  },
  {
    icon: '🔷',
    title: 'OpenAPI → Zod',
    desc: 'HeyAPI로 타입 자동생성. Zod 런타임 검증으로 API 계약 위반 즉시 감지.',
    result: '수동 타입 정의 제거',
    link: '/projects/fms',
  },
  {
    icon: '🚦',
    title: 'Merge Gate (CI)',
    desc: 'Critical / Major / Minor 심각도 판정 기반 병합 자동 차단.',
    result: 'Vitest · Playwright · Chromatic 3중 검증',
    link: '/quality/merge-gate-ci',
  },
  {
    icon: '🤖',
    title: 'AI Agent Workflow',
    desc: 'Claude(UX/UI) + Codex(비즈니스 로직) 역할 분리. AGENTS.md · SKILL.md 하네스 엔지니어링.',
    result: 'Agent 정확도 95% 달성',
    link: '/ai-workflow/agent-pipeline',
  },
];

const PROJECTS = [
  {
    period: '2026.01 — 2026.06',
    title: 'FMS — Facility Management System',
    desc: '시설물 유지보수 업무 디지털화. AI Agent 파이프라인으로 개발 인원 3→2명에도 전 도메인 커버리지 유지.',
    tags: ['Next.js', 'TypeScript', 'Zustand', 'TanStack Query', 'Zod', 'Vitest', 'Playwright'],
    link: '/projects/fms',
  },
  {
    period: '2023.08 — 2025.08',
    title: 'BEMS — Building Energy Management System',
    desc: '건물 에너지 데이터 실시간 수집·시각화. SSE 도입으로 네트워크 요청 60% 감소.',
    tags: ['React', 'TypeScript', 'Redux', 'SSE', 'react-query', 'Styled-components'],
    link: '/projects/bems',
  },
  {
    period: '2024.08 — 2025.12',
    title: '공조기 자동제어 및 모니터링',
    desc: 'AWS IoT Core 기반 공조기 원격 제어. 멱등성 검증으로 제어 지연 23초 → 1초.',
    tags: ['React', 'TypeScript', 'Redux', 'WebSocket', 'AWS IoT Core', 'Lambda', 'DynamoDB'],
    link: '/projects/hvac-control',
  },
];

export default function Home() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout title="포트폴리오" description="박경찬 프론트엔드 엔지니어 포트폴리오">
      {/* Hero */}
      <div className="hero-section">
        <div className="container">
          <div className="hero-badge">Frontend Engineer · 약 4년 경력</div>
          <h1 className="hero-title">
            박경찬<span>.</span>
          </h1>
          <p className="hero-subtitle">
            이력서에 적힌 내용을 코드로 증명하는 포트폴리오
          </p>
          <div className="notice-box">
            <div className="notice-box-label">📌 안내</div>
            <p className="notice-box-text">
              이 사이트의 코드와 문서는 실무 경험을 기반으로 작성된 <strong>예시</strong>입니다.<br />
              회사 규정상 실제 프로젝트 코드를 공개할 수 없어,
              동일한 패턴과 구조로 재현한 예시 코드로 구성했습니다.
            </p>
          </div>
        </div>
      </div>

      {/* 핵심 기술 */}
      <div className="section">
        <div className="container">
          <p className="section-title">핵심 기술</p>
          <div className="card-grid card-grid-3">
            {TECH_CARDS.map((card) => (
              <Link key={card.title} to={card.link} className="tech-card">
                <div className="tech-card-icon">{card.icon}</div>
                <div className="tech-card-title">{card.title}</div>
                <p className="tech-card-desc">{card.desc}</p>
                <div className="tech-card-result">→ {card.result}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <hr className="divider" />

      {/* 프로젝트 */}
      <div className="section">
        <div className="container">
          <p className="section-title">프로젝트</p>
          <div className="card-grid card-grid-3">
            {PROJECTS.map((project) => (
              <Link key={project.title} to={project.link} className="project-card">
                <div className="project-card-period">{project.period}</div>
                <div className="project-card-title">{project.title}</div>
                <p className="project-card-desc">{project.desc}</p>
                <div className="tag-list">
                  {project.tags.map((tag) => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <hr className="divider" />

      {/* 연락처 */}
      <div className="contact-row">
        <a href="mailto:developfff@gmail.com" className="contact-link">
          ✉ developfff@gmail.com
        </a>
        <a href="https://github.com/kyungchan3007" target="_blank" className="contact-link">
          GitHub
        </a>
      </div>
    </Layout>
  );
}
