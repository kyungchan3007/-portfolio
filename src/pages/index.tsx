import Layout from '@theme/Layout';
import Mermaid from '@theme/Mermaid';
import useBaseUrl from '@docusaurus/useBaseUrl';
import DetailModalButton from '../components/DetailModalButton';
import { MODAL_DETAILS, type ModalKey } from '../components/detailSlides';
import '../css/custom.css';

type Project = {
  label: string;
  title: string;
  summary: string;
  problem: string;
  role: string;
  technologies: Array<{ name: string; why: string; how: string; detail?: ModalKey }>;
  architecture: string;
  code: string;
  result: string;
  metrics: string[];
};

const STRENGTHS = [
  { number: '01', title: 'AI Harness로 개발 방식을 개선합니다', desc: 'AI를 구현·검증·리뷰 흐름에 연결해 팀이 반복해서 사용할 수 있는 기준으로 만듭니다.', proof: '개발 생산성 50% 향상' },
  { number: '02', title: '성능 병목을 측정하고 구조로 해결합니다', desc: 'Web Vitals와 브라우저 지표를 기준으로 렌더링·번들·데이터 흐름을 함께 개선합니다.', proof: '화면 반영 3~5초 → 1초 이내' },
  { number: '03', title: '실시간 제어 흐름을 안정화합니다', desc: 'MQTT 중복 메시지와 WebSocket 연결 문제를 다루며 상태 정합성과 제어 신뢰성을 높입니다.', proof: '제어 지연 5초 → 1초 이내' },
  { number: '04', title: '운영 가능한 품질 체계를 만듭니다', desc: '계약·테스트·CI/CD·모니터링을 연결해 변경과 배포를 반복 가능한 흐름으로 만듭니다.', proof: '장애 대응 3일 → 1일 이내' },
];

const PROJECTS: Project[] = [
  {
    label: '01 · AI & QUALITY',
    title: 'FMS 시설물 관리 서비스',
    summary: 'AI Harness를 구축해 구현·검증·리뷰 흐름을 표준화하고, 팀의 개발 생산성과 품질 기준을 함께 높였습니다.',
    problem: '도메인이 확장되면서 요구사항, API, 검증 기준이 단계마다 달라졌습니다. 구현 방식이 사람마다 제각각이 되고 반복적인 협의와 QA 비용도 커졌습니다.',
    role: '2인 개발 체제에서 프론트엔드 구조와 AI 협업 프로세스를 주도했습니다.',
    technologies: [
      { name: 'AI Harness', why: 'AI 결과의 편차와 재작업을 줄이고 구현·검증 문맥을 분리하기 위해 선택했습니다.', how: 'Skill·Ontology로 도메인 규칙을 구조화하고 Claude는 구현, Codex는 로직·API·보안·회귀 검증을 담당하도록 나눴습니다.', detail: 'ai-harness' },
      { name: 'OpenAPI · Zod', why: 'API 협의와 수동 타입 작성에서 생기는 계약 불일치를 줄이기 위해 선택했습니다.', how: 'OpenAPI를 계약의 기준으로 삼고 Zod로 런타임 응답까지 검증했습니다.', detail: 'openapi-zod' },
      { name: 'Playwright · Storybook', why: '기능 구현 후 반복되는 사용자 흐름과 공통 UI 회귀를 자동으로 확인하기 위해 선택했습니다.', how: '주요 사용자 흐름은 Playwright로, 공통 컴포넌트는 Storybook과 체크리스트로 검증했습니다.' },
      { name: 'npm Workspaces · Design System', why: '화면별 개별 구현으로 공통 UI가 중복되고 접근성·동작 기준이 흩어졌기 때문에 선택했습니다.', how: 'npm Workspaces 모노레포로 애플리케이션·UI 자산을 분리하고, 디자인 토큰과 Headless UI 패턴으로 스타일과 접근성·동작을 나눴습니다.', detail: 'design-system' },
    ],
    architecture: `flowchart LR
  A[요구사항] --> B[Skill 선택]
  B --> C[Claude 구현]
  C --> D[OpenAPI · Zod 검증]
  D --> E[Codex 리뷰]
  E --> F[Playwright · 품질 체크]
  F --> G[배포]`,
    code: `// 구현과 검증의 책임을 분리한 작업 흐름
const workflow = {
  implement: ['requirements', 'skill', 'claude'],
  verify: ['openapi', 'zod', 'playwright', 'codex'],
};`,
    result: 'AI를 도입한 것이 아니라 팀의 구현·검증 기준으로 정착시켰습니다.',
    metrics: ['개발 생산성 50% 향상', '리드타임 2주 단축', '품질 체크리스트 50% → 90%', '컨텍스트 토큰 비용 30% 이상 절감'],
  },
  {
    label: '02 · PERFORMANCE',
    title: 'BEMS 운영 대시보드',
    summary: '대량의 실시간 데이터를 다루는 운영 화면의 병목을 측정하고 Web Worker와 Next.js 재구축으로 반영 속도를 개선했습니다.',
    problem: '데이터 갱신 시 메인 스레드 연산과 네트워크 요청이 겹쳤습니다. CSR 기반 초기 렌더링까지 더해져 화면 반영이 3~5초 지연되었습니다.',
    role: '상태·캐시 구조 개선, 성능 최적화, React에서 Next.js로의 아키텍처 전환을 주도했습니다.',
    technologies: [
      { name: 'Web Worker', why: '대량 데이터 비교·검증 연산이 메인 스레드를 점유해 UI 반응성을 떨어뜨렸기 때문에 선택했습니다.', how: 'Delta Update 계산과 데이터 검증을 Worker로 분리하고 변경된 patch만 상태에 반영했습니다.' },
      { name: 'Next.js SSR', why: 'React CSR의 mount → fetch → re-render 워터폴이 초기 화면 지연의 구조적 원인이었기 때문에 선택했습니다.', how: '초기 조회·렌더링은 서버 컴포넌트에서 처리하고, 로드 후 실시간 갱신만 Worker가 담당하도록 경계를 나눴습니다.' },
      { name: 'Zustand · TanStack Query · BFF', why: 'UI 상태와 서버 데이터가 섞이고 동일 요청이 반복되는 문제를 줄이기 위해 선택했습니다.', how: 'Zustand는 UI 상태, TanStack Query는 서버 캐시, BFF는 인증과 사용자별 서버 캐시를 담당하도록 분리했습니다.' },
      { name: '반응형 · 크로스브라우저', why: 'Chrome·Edge·Safari·Firefox에서 그리드·차트 데이터 표시와 스크롤 동작이 어긋났기 때문에 대응했습니다.', how: '비동기 상태 반영과 레이아웃 전환 경합을 식별하고, 컨테이너 크기 재계산 로직으로 4대 브라우저 정합성을 확보했습니다.' },
      { name: 'i18n 다국어', why: '영어·한국어 사용 환경을 함께 지원해야 했기 때문에 선택했습니다.', how: 'ko/en 리소스를 분리해 UI 문자열을 국제화하고, 토글·셀렉트 기반 언어 전환 UI를 구현했습니다.' },
    ],
    architecture: `flowchart LR
  A[Next.js Server Component] --> B[초기 데이터 SSR]
  B --> C[React 화면]
  C --> D[실시간 데이터 수신]
  D --> E[Web Worker]
  E --> F[Delta Update 계산]
  F --> G[Zustand patch 반영]`,
    code: `// 변경분만 계산하고 다음 상태에 patch 적용
const nextPatch = calculateDelta(previousData, incomingData);
worker.postMessage({ type: 'APPLY_PATCH', payload: nextPatch });

requestAnimationFrame(() => applyPatch(nextPatch));`,
    result: '클라이언트 코드만 줄이는 데서 멈추지 않고, 측정 결과에 따라 렌더링 아키텍처 자체를 바꿨습니다.',
    metrics: ['화면 반영 3~5초 → 1초 이내', 'JavaScript 29.7% · CSS 20.1% 감소', '네트워크 요청 30% 감소', 'UAT 품질 이슈 500건 → 50건 내외', '4대 브라우저 정합성 확보'],
  },
  {
    label: '03 · REALTIME',
    title: '원격 제어 및 모니터링',
    summary: 'MQTT 멱등성 처리와 WebSocket 구조 개선으로 실시간 제어의 신뢰성과 장애 대응성을 높였습니다.',
    problem: '네트워크 재전송과 중복 메시지로 제어 상태가 어긋났고, 실시간 연결 문제를 추적하는 데 많은 시간이 필요했습니다.',
    role: '실시간 메시지 처리, 소켓 연결 구조, 운영 관측 흐름과 배포 절차를 설계하고 개선했습니다.',
    technologies: [
      { name: 'MQTT 멱등성', why: '동일 명령이 재전송되어도 장비 제어가 한 번만 적용되어야 했기 때문에 선택했습니다.', how: 'messageId를 기준으로 Lambda에서 중복 여부를 검사한 뒤 신규 메시지만 저장·전달했습니다.' },
      { name: 'WebSocket', why: '페이지마다 소켓을 직접 만들면서 중복 구독과 상태 누락이 생겨, 연결 관리를 한 곳으로 모으는 구조 개선이 필요했습니다.', how: '소켓 생성·구독·중복 수신 필터·상태 반영 책임을 분리하고 연결 생명주기를 한 곳에서 관리했습니다.' },
      { name: 'AWS IoT · Lambda · CloudWatch', why: '직접 저장 구조의 중복과 장애 원인 파악 지연을 줄이기 위해 선택했습니다.', how: 'IoT Rule과 Lambda를 중간 계층으로 두고 DynamoDB 저장 전 검증하며 CloudWatch Alarm을 연결했습니다.' },
      { name: 'GitHub Actions CI/CD', why: '수동 배포 공수와 릴리즈 중 서비스 중단 위험을 줄이기 위해 선택했습니다.', how: 'CI 단계에서 E2E·Storybook을 자동 검증하고, 품질 게이트(SonarQube·E2E) 통과 시 AWS로 무중단 자동 배포했습니다.' },
    ],
    architecture: `flowchart LR
  A[장비] --> B[MQTT]
  B --> C[AWS IoT Core]
  C --> D[Lambda]
  D --> E{messageId 중복 검사}
  E -->|신규| F[DynamoDB]
  E -->|중복| G[폐기]
  F --> H[WebSocket]
  H --> I[프론트 상태 반영]`,
    code: `// 동일 명령은 저장·전달하지 않음
if (await alreadyProcessed(message.messageId)) {
  return { statusCode: 200, body: 'duplicate' };
}

await markProcessed(message.messageId);
await saveDeviceState(message);`,
    result: '실시간 기능을 연결 문제로만 보지 않고 메시지 정합성·저장·관측의 흐름으로 분리했습니다.',
    metrics: ['제어 지연 5초 → 1초 이내', '중복 제어 방지', '실시간 반영 지연 50% 이상 개선', '장애 대응 3일 → 1일 이내', 'CI/CD 무중단 배포'],
  },
];

const SIDE_PROJECTS: Project[] = [
  {
    label: '01 · SIDE PROJECT',
    title: 'PinHouse 주거 탐색 서비스',
    summary: '페이지마다 흩어진 검색 조건을 상태·Query Key·BFF 캐시 기준으로 일관되게 연결하고, 그 구조를 이후 BEMS 상태·캐시 개선으로 확장했습니다.',
    problem: '지역·방 유형·대중교통·자격 조건이 조금만 달라도 결과가 바뀌는데, 이 기준이 페이지마다 흩어져 같은 데이터를 반복 요청했습니다. 어떤 상태를 유지하고 어떤 데이터를 재사용할지 경계도 불명확했습니다.',
    role: '홈·공고 목록·글로벌 검색 UX와 Zustand·TanStack Query·BFF 기반 검색 데이터 흐름을 설계·구현하고 인증 진입 구조를 정리했습니다.',
    technologies: [
      { name: 'Zustand', why: '페이지마다 다른 검색 조건 탓에 화면 상태와 서버 조회 조건이 쉽게 뒤섞였기 때문에 선택했습니다.', how: '지역·방 유형·대중교통·자격 조건을 검색 상태로 묶고, 서버에서 받는 조회 데이터는 분리했습니다.' },
      { name: '공통 Query Key', why: '페이지가 달라도 동일 조건 데이터가 반복 요청되는 문제를 줄이기 위해 선택했습니다.', how: '결과를 바꾸는 값을 정규화해 공통 Query Key에 포함하고, 조건이 같으면 캐시를 재사용하도록 만들었습니다.' },
      { name: 'BFF cache-aside', why: '클라이언트 캐시가 없으면 같은 조건도 원본 API를 다시 호출했기 때문에 선택했습니다.', how: '정규화된 조건 기준으로 서버에서 먼저 캐시를 조회하고, 없을 때만 원본 API를 호출했습니다.' },
      { name: 'Middleware 서버 인증', why: '클라이언트 인증 진입의 초기 로딩 비효율을 줄이기 위해 선택했습니다.', how: '인증 진입점을 Next.js Middleware·서버 리다이렉트로 옮겨 hydration 이전에 접근 경로를 결정하고 First Load JS를 줄였습니다.' },
    ],
    architecture: `flowchart LR
  A[검색 조건] --> B[조건 정규화]
  B --> C[공통 Query Key]
  C --> D[클라이언트 캐시]
  D -->|miss| E[BFF 캐시]
  E -->|miss| F[원본 API]`,
    code: `// 결과를 바꾸는 값만 정규화해 공통 Query Key로 묶음
const 정규화조건 = normalize({ region, roomTypes, transitTypes });
const 검색키 = ['search', 정규화조건];`,
    result: '검색 화면 하나에서 멈추지 않고, 상태 소유권 분리·공통 Query Key·BFF 캐시 경계 설계를 BEMS 리팩터링으로 이식했습니다.',
    metrics: ['First Load JS 10% 이상 감소', '동일 조건 클라이언트·서버 캐시 재사용', '검색 조건 페이지 간 일관성 확보', "공모전 '모두의 아이디어' 우수참여자 선정"],
  },
  {
    label: '02 · SIDE PROJECT',
    title: 'SAJU:ME 사주 분석·추천',
    summary: "'오늘의 운세'만 소비하고 이탈하던 퍼널 병목을 게이트 설계와 자체 계측 실험으로 가입 전환까지 끌어올리고, Skill·Ontology 기반 AI Harness를 이후 FMS로 확장했습니다.",
    problem: "두 층위의 문제가 있었습니다. 비회원 유입은 많지만 '오늘의 운세'만 보고 이탈해 가입·오프라인 전환으로 이어지지 않았고, AI 역할·검증 기준이 고정되지 않아 UX 판단·로직·리뷰가 한 흐름에 섞여 결과 편차와 재작업이 컸습니다.",
    role: 'FE 전반(솔로→팀 확장)을 맡아 유입·가입 전환 실험, Workers 기반 자체 계측, AI Harness·검증 구조, Edge 배포까지 설계·구현했습니다.',
    technologies: [
      { name: '선행 게이트', why: "'오늘의 운세'만 보고 이탈하는 흐름을 가입 전환으로 바꾸기 위해 선택했습니다.", how: '무료 풀이를 미끼로 가입 완료 후 열람하는 선행 게이트로 전환하고, 기존 후행 게이트와 전후를 비교했습니다.' },
      { name: 'Cloudflare Workers 계측', why: '별도 분석 툴 없이 어느 게이트가 더 전환되는지 데이터로 판단해야 했기 때문에 선택했습니다.', how: 'Workers 로그에 variant·전환 이벤트를 남기고 집계해 variant별 전환율을 직접 계산했습니다.' },
      { name: 'AI Harness', why: '구현과 검증이 한 문맥에 섞이면 결과 편차와 재작업이 커졌기 때문에 선택했습니다.', how: 'Claude는 구현, Codex는 로직·API·리뷰 검증을 맡기고 Ontology로 규칙을 구조화, prompt-trigger-eval 체크리스트를 자동 실행했습니다.', detail: 'ai-harness' },
    ],
    architecture: `flowchart LR
  A[유입] --> B[무료 풀이 미끼]
  B --> C[가입 게이트]
  C --> D[Workers 로그 계측]
  D --> E[variant 전환율 집계]`,
    code: `// variant·전환 이벤트를 Workers 로그로 남기고 집계
logConversion({ experiment, variant, converted });
const rate = aggregate(logs); // variant별 전환율`,
    result: '서비스 퍼널 실험에서 멈추지 않고, AI Harness와 평가 구조를 팀 공통 AI Workflow(FMS)로 정착시켰습니다.',
    metrics: ['가입 전환율 20% → 30%', '상위 퍼널 관심 15% 증가', 'AI 검증 100건 중 95건 통과', 'SEO·SSR/SSG 렌더링 분리'],
  },
];

const SUPPORTING_PROJECTS = [
  { title: '웹 접근성 개선', tech: 'Semantic HTML · WAI-ARIA · focus-visible · axe-core · Playwright', reason: '화면을 고치는 데서 끝내지 않고 모든 서비스에 반복 적용할 수 있는 접근성 품질 기준을 만들기 위해 진행했습니다.', result: '8개 경로 자동 점검 체계 유지', detail: 'heading·landmark 구조, 탭과 패널의 ARIA 관계, 키보드 포커스, 저대비 텍스트를 정비하고 axe와 Playwright를 릴리즈 전 검증에 연결했습니다.' },
  { title: '성능 최적화', tech: 'Lighthouse · Web Vitals · Performance API · CI 검증', reason: '성능 점수보다 실제 사용자의 첫 화면 경험을 끌어올리고, 그 결과를 반복 측정하기 위해 진행했습니다.', result: '전후 성능 리포트와 회귀 검증 체계 구축', detail: 'LCP·First Load JS·공통 Provider·이미지·전역 스크립트를 분해하고 Lighthouse 리포트와 기능 테스트를 함께 관리했습니다.' },
];

export default function Home() {
  const profileImage = useBaseUrl('/img/profile.jpeg');

  return (
    <Layout title="박경찬 · Frontend Engineer" description="박경찬 프론트엔드 엔지니어 포트폴리오">
      <main>
        <section className="portfolio-hero"><div className="container hero-grid"><div className="hero-copy"><p className="eyebrow">Frontend Engineer · 4 years · Team Lead</p><h1>성능 병목, 실시간 데이터, 품질 문제를 측정하고 구조적으로 해결해 온 프론트엔드 엔지니어입니다.</h1><p className="hero-detail">React·Next.js 기반 서비스에서 AI Harness·Web Worker·MQTT·WebSocket을 실제 운영 문제에 연결하고 결과를 수치로 남겼습니다.</p></div><div className="hero-portrait-wrap"><div className="portrait-glow" /><img className="hero-portrait" src={profileImage} alt="프론트엔드 엔지니어 박경찬" /><div className="portrait-caption"><strong>Park Kyungchan</strong></div></div></div><div className="container metric-strip" aria-label="주요 성과"><div><strong>29.7%</strong><span>JavaScript 감소</span></div><div><strong>30%</strong><span>네트워크 요청 감소</span></div><div><strong>50%</strong><span>개발 생산성 향상</span></div><div><strong>1초 이내</strong><span>실시간 화면 반영</span></div></div></section>

        <section className="portfolio-section"><div className="container"><div className="section-heading"><p className="eyebrow">What I solve</p><h2>기술보다 문제 해결 방식으로 증명합니다.</h2></div><div className="strength-list">{STRENGTHS.map((item) => <article className="strength-item" key={item.number}><span className="item-number">{item.number}</span><div><h3>{item.title}</h3><p>{item.desc}</p><strong>{item.proof}</strong></div></article>)}</div></div></section>

        <section className="proof-section"><div className="container proof-layout"><div><p className="eyebrow">Measured outcomes</p><h2>개선 전후를 숫자로 남깁니다.</h2></div><div className="proof-grid"><div><strong>3~5초 → 1초</strong><span>BEMS 화면 반영 지연</span></div><div><strong>5초 → 1초</strong><span>원격 제어 응답 지연</span></div><div><strong>3일 → 1일</strong><span>장애 대응 시간</span></div><div><strong>50% → 90%</strong><span>품질 체크리스트 적용률</span></div></div></div></section>

        <section className="portfolio-section projects-section" id="projects"><div className="container"><div className="section-heading section-heading-left"><p className="eyebrow">Selected work</p><h2>대표 프로젝트</h2></div><div className="project-list">{PROJECTS.map((project) => <article className="project-item project-detail-item" key={project.title}><div className="project-index">{project.label}</div><div className="project-main"><h3>{project.title}</h3><p className="project-summary">{project.summary}</p><div className="project-context"><div><small>Problem</small><p>{project.problem}</p></div><div><small>My role</small><p>{project.role}</p></div></div><div className="technology-proof"><h4>기술 선택과 구현</h4>{project.technologies.map((technology) => <div className={technology.detail ? 'technology-item technology-item--action' : 'technology-item'} key={technology.name}><div className="technology-text"><strong>{technology.name}</strong><p><b>선택 이유</b> {technology.why}</p><p><b>적용 방식</b> {technology.how}</p></div>{technology.detail && <DetailModalButton {...MODAL_DETAILS[technology.detail]} />}</div>)}</div><div className="architecture-block"><h4>Architecture</h4><Mermaid value={project.architecture} /></div><div className="code-block"><h4>Implementation excerpt</h4><pre><code>{project.code}</code></pre></div><div className="project-bottom"><div className="project-details">{project.metrics.map((metric) => <span key={metric}>{metric}</span>)}</div></div><p className="project-result-line"><span>Result</span>{project.result}</p></div></article>)}</div></div></section>

        <section className="portfolio-section side-projects-section"><div className="container"><div className="section-heading section-heading-left"><p className="eyebrow">Side projects</p><h2>사이드 프로젝트</h2></div><div className="project-list">{SIDE_PROJECTS.map((project) => <article className="project-item project-detail-item" key={project.title}><div className="project-index">{project.label}</div><div className="project-main"><h3>{project.title}</h3><p className="project-summary">{project.summary}</p><div className="project-context"><div><small>Problem</small><p>{project.problem}</p></div><div><small>My role</small><p>{project.role}</p></div></div><div className="technology-proof"><h4>기술 선택과 구현</h4>{project.technologies.map((technology) => <div className={technology.detail ? 'technology-item technology-item--action' : 'technology-item'} key={technology.name}><div className="technology-text"><strong>{technology.name}</strong><p><b>선택 이유</b> {technology.why}</p><p><b>적용 방식</b> {technology.how}</p></div>{technology.detail && <DetailModalButton {...MODAL_DETAILS[technology.detail]} />}</div>)}</div><div className="architecture-block"><h4>Architecture</h4><Mermaid value={project.architecture} /></div><div className="code-block"><h4>Implementation excerpt</h4><pre><code>{project.code}</code></pre></div><div className="project-bottom"><div className="project-details">{project.metrics.map((metric) => <span key={metric}>{metric}</span>)}</div></div><p className="project-result-line"><span>Result</span>{project.result}</p></div></article>)}</div></div></section>

        <section className="portfolio-section supporting-section"><div className="container"><div className="section-heading section-heading-left"><p className="eyebrow">Cross-cutting work</p><h2>전 서비스에 공통 적용한 개선</h2></div><div className="supporting-list">{SUPPORTING_PROJECTS.map((project) => <article className="supporting-item" key={project.title}><div><span className="project-index">{project.tech}</span><h3>{project.title}</h3><p>{project.detail}</p></div><div className="supporting-proof"><small>Why</small><p>{project.reason}</p><strong>{project.result}</strong></div></article>)}</div></div></section>

        <footer className="portfolio-footer"><div className="container footer-inner"><div><p className="eyebrow">Let&apos;s work together</p></div><div className="footer-links"><a href="mailto:developfff@gmail.com">developfff@gmail.com</a><a href="https://github.com/kyungchan3007" target="_blank" rel="noreferrer">GitHub ↗</a></div></div></footer>
      </main>
    </Layout>
  );
}
