import Layout from '@theme/Layout';
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
  technologies: Array<{ name: string; why: string | string[]; how: string | string[]; detail?: ModalKey }>;
  architecture: string;
  code: string;
  result: string;
  metrics: string[];
  improvements?: { intro: string; items: { title: string; points: string[] }[] };
  tradeoff?: { title: string; points: string[] };
};

const STRENGTHS = [
  { number: '01', title: '팀의 기준과 구조를 설계한 팀 리드', desc: '요구사항 정의부터 아키텍처 설계, 코드 리뷰, 테스트·배포 자동화까지 개발 전 주기를 주도했습니다. 개인의 감각보다 팀이 함께 사용할 수 있는 기준과 구조를 만드는 역할에 집중했습니다.', proof: '팀 리딩 2년 · 개발 전 주기 주도' },
  { number: '02', title: 'AI 협업 체계를 설계한 엔지니어', desc: 'AI 하네스와 온톨로지 기반 체계를 직접 설계해, AI가 먼저 작업하고 사람이 검증·승인하는 협업 구조를 만들었습니다. 결과 편차를 줄이고 개발 생산성을 높일 수 있는 실행 기준을 정착시켰습니다.', proof: '개발 생산성 50% 향상 · 토큰 비용 30% 절감' },
  { number: '03', title: '성능 병목을 계측하고 재구축까지 이끈 프론트엔드 개발자', desc: 'Lighthouse와 Web Vitals로 병목을 진단하고, React 구조 개선과 Next.js SSR 재구축까지 직접 주도했습니다. 화면 반영 지연, 번들 크기, 렌더링 부담을 수치로 확인하고 구조 변경으로 이어갔습니다.', proof: '화면 반영 3~5초 → 1초 이내 · JS 29.7% 감소' },
  { number: '04', title: '실시간 제어 구조를 설계하고 직접 구현한 개발자', desc: 'MQTT/WebSocket 기반 실시간 제어 구조와 장애 관측 체계를 설계하고, 테스트·CI/CD 게이트로 품질 검증 흐름까지 연결했습니다. 중복, 누락, 지연이 발생하던 제어 흐름을 정리해 실제 운영에서 더 안정적으로 동작하도록 개선했습니다.', proof: '제어 지연 5초 → 1초 이내 · 장애 대응 3일 → 1일' },
];

const HERO_INTRO = [
  '팀장으로 일하며, 개인의 감각보다 팀이 함께 사용할 수 있는 기준과 구조를 만드는 데 집중해 왔습니다.',
  '팀을 이끌 때는 먼저 실행해보고, 그 결과에서 나온 근거로 방향을 설명하고 설득하는 편입니다.',
  '여러 사람이 함께 만드는 서비스일수록, 병목과 위험 요소를 미리 보고 흐름을 정리하는 역할이 중요하다고 생각합니다.',
  '책임감 있게 끝까지 가져가되, 혼자 잘하는 것보다 팀이 안정적으로 결과를 낼 수 있는 구조를 만드는 데 강점이 있습니다.',
];

const PROJECTS: Project[] = [
  {
    label: '01 · AI & QUALITY',
    title: 'FMS 시설물 관리 서비스',
    summary: 'AI Harness를 구축해 구현·검증·리뷰의 기준을 통일하고, 팀의 개발 생산성과 품질을 함께 높였습니다.',
    problem: '도메인이 확장되면서 요구사항, API, 검증 기준이 단계마다 달라졌습니다. 구현 방식이 사람마다 제각각이 되고 반복적인 협의와 QA 비용도 커졌습니다.',
    role: '2인 개발 체제에서 프론트엔드 구조와 AI 협업 프로세스를 주도했습니다.',
    technologies: [
      { name: 'AI Harness', why: ['같은 지시에도 AI의 결과 편차가 컸고, 작업 경계가 명확하지 않으면 결과를 통제하기 어려웠습니다.', '기성 프레임워크나 에이전트는 빠르게 시작할 수 있지만, 컨텍스트가 늘어날수록 작업자의 의도와 결과를 맞추기 어려웠습니다.', '초기 구축 비용을 감수하더라도 규칙을 정형화한 체계가 필요하다고 판단했습니다.'], how: ['aiagent.yaml 온톨로지로 개념과 규칙을 정형화하고, 4개 역할의 에이전트를 evidence-gated 8단계 루프로 구성했습니다.', 'Claude는 UI/UX, Codex는 비즈니스 로직을 담당하도록 역할을 나누고, 단일 진실 소스를 기준으로 병렬 협업했습니다.', '역할에 필요한 컨텍스트만 불러와 토큰 비용을 약 30% 줄였습니다.'], detail: 'ai-harness' },
      { name: 'OpenAPI · Zod', why: ['API 규약이 사람마다 달라 생기는 계약 불일치를 사전에 없애기 위해 선택했습니다.'], how: ['OpenAPI·Zod로 API 규약을 정의하고, 계약 테스트로 프론트와 백엔드의 어긋남을 배포 전에 차단했습니다.'], detail: 'openapi-zod' },
      { name: 'Playwright · Storybook', why: ['운영 결함은 수정 비용이 크고, 사람의 리뷰만으로는 반복적으로 검증하기 어려웠습니다.', '품질 검증을 자동화된 게이트로 만들어 같은 기준을 반복 적용해야 한다고 판단했습니다.'], how: ['Vitest·Playwright에 하네스 완료 판정(Eval) 게이트를 추가해, 검증을 통과한 변경만 머지되도록 구성했습니다.', 'Storybook으로 공통 UI를 검증해 품질 체크리스트 90% 달성 기간을 1개월에서 2주로 단축했습니다.'] },
      { name: 'pnpm 모노레포 · Design System', why: ['화면마다 UI와 API 규약을 따로 관리해 공통 자원을 재사용하기 어려웠습니다.', '팀이 함께 사용할 수 있는 공통 기반을 표준화해야 개발 속도와 품질을 함께 높일 수 있다고 판단했습니다.'], how: ['pnpm 모노레포로 디자인 토큰·UI·계약 패키지를 분리했습니다.', 'Headless UI로 공통 UI 동작을 재사용하고, Storybook의 접근성 애드온으로 ARIA·키보드 동작을 검증했습니다.'], detail: 'design-system' },
      { name: 'GitHub Actions · PR 자동 리뷰', why: ['모든 PR을 사람이 처음부터 검토하면 시간이 오래 걸리고, AI에게 최종 승인을 맡기는 것은 위험하다고 판단했습니다.', 'AI가 1차 검토를 담당하고 최종 판단은 사람이 내리는 구조가 적절하다고 판단했습니다.'], how: ['GitHub Actions·OpenAI로 PR diff를 자동 리뷰하고, 실행 가능한 지적만 인라인 코멘트로 남겨 팀이 최종 승인하도록 구성했습니다.', '보안을 위해 코드를 실행하지 않는 pull_request_target에서 diff와 메타데이터만 읽도록 제한했습니다.'] },
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
    result: 'AI를 단순한 도구로 사용하는 데서 그치지 않고, 팀의 구현·검증 기준으로 정착시켰습니다.',
    metrics: ['개발 생산성 50% 향상', '프로젝트 기간 5개월 → 3개월', '품질 체크리스트 50% → 90%', '컨텍스트 토큰 비용 30% 이상 절감'],
    improvements: {
      intro: '하네스는 한 번 설계하고 끝나는 구조가 아니라, 운영 중 발견한 실패를 다음 기준에 반영하며 개선했습니다.',
      items: [
        { title: '실패를 기록하고 분류했습니다', points: ['먼저 관측 로그와 실패 유형을 정의해 반복되는 문제를 같은 기준으로 기록했습니다.', '같은 유형의 실패가 두 번 이상 반복되면 개선 후보로 올렸습니다.', '분류한 실패를 지침 개선으로 연결해 다음 작업에 반영했습니다.'] },
        { title: '컨텍스트 선택 기준을 만들었습니다', points: ['실패를 분석하는 과정에서, 작업자마다 필요한 문서를 선택하는 기준이 달라질 수 있음을 확인했습니다.', '작업 유형·트리거·필요 문서를 표준 매트릭스로 매핑했습니다.', '이 기준을 시작 전 프리플라이트 체크에 연결해 필요한 문서만 불러오도록 했습니다.'] },
        { title: '작업 규모에 따라 루프를 나눴습니다', points: ['컨텍스트 기준을 적용해 보니, 작은 수정에도 8단계 루프를 모두 실행하면 문서 비용이 구현 비용보다 커졌습니다.', '작업 시작 시 Quick과 Full 중 하나를 선택하도록 바꿨습니다.', '작업 범위가 커지면 Quick에서 Full로 승격하도록 경량 루프를 분리했습니다.'] },
        { title: '문서 변경을 자동으로 추적했습니다', points: ['루프를 나눈 뒤 문서가 늘어나면서, 어떤 문서를 함께 수정해야 하는지 추적하는 비용이 커졌습니다.', 'docs-lint와 owner·last_reviewed·depends_on 메타 필드를 도입해 문서 간 의존성을 관리했습니다.', '깨진 참조와 미사용 문서를 자동 탐지해 앞 단계의 기준이 오래된 문서에 남지 않도록 보완했습니다.'] },
      ],
    },
    tradeoff: {
      title: '검증 게이트의 한계',
      points: [
        '단위 테스트·E2E·PR AI 리뷰를 검증 게이트로 연결해 반복 결함의 80% 이상을 차단했습니다.',
        '공용 함수 중복이나 아키텍처 경계 위반처럼 역할 분리가 필요한 문제는 AI만으로 판단하기 어려워, 사람이 PR에서 최종 확인했습니다.',
      ],
    },
  },
  {
    label: '02 · PERFORMANCE',
    title: 'BEMS 운영 대시보드',
    summary: '대량의 실시간 데이터를 다루는 운영 화면의 병목을 측정하고 Web Worker와 Next.js 재구축으로 반영 속도를 개선했습니다.',
    problem: '데이터 갱신 시 메인 스레드 연산과 네트워크 요청이 겹쳤습니다. CSR 기반 초기 렌더링까지 더해져 화면 반영이 3~5초 지연되었습니다.',
    role: '상태·캐시 구조 개선, 성능 최적화, React에서 Next.js로의 아키텍처 전환을 주도했습니다.',
    technologies: [
      { name: 'Web Worker', why: ['실시간 대량 데이터를 메인 스레드에서 수신·가공하면서 차트 렌더링과 사용자 인터랙션이 끊겼습니다.', '특히 냉방 수요가 집중되는 시기에 데이터 처리량이 늘어 문제가 두드러졌습니다.'], how: ['Web Worker를 데이터 레이어로 두고 fetch ReadableStream으로 데이터를 청크 단위로 수신·가공했습니다.', '화면에 필요한 범위인 3시간·약 1,000포인트만 전달해 렌더링 부하의 상한을 고정했습니다.'] },
      { name: 'Next.js SSR · SSE', why: ['Web Worker로 렌더링 끊김은 줄였지만, 첫 화면이 표시되기까지 3~5초가 걸렸습니다.', '최초 조회 데이터와 지속적으로 들어오는 데이터를 같은 통로로 처리하면서 병목이 발생했습니다.'], how: ['초기 화면을 SSR로 서버에서 렌더링해 첫 화면 표시 시간을 1초 이내로 단축했습니다.', 'API를 초기 3시간 조회와 실시간 SSE 스트림으로 분리하고, 클라이언트의 Web Worker 의존성을 줄였습니다.'] },
      { name: 'BFF 정적 데이터 캐싱', why: ['통계·목표·기준정보처럼 정적인 데이터를 화면마다 원본 API에서 다시 조회하는 것은 비효율적이었습니다.', '데이터의 성격에 따라 실시간 데이터와 정적 데이터의 패칭 전략을 나눌 필요가 있었습니다.'], how: ['정적 데이터는 BFF 계층에서 캐싱해 여러 화면이 재사용하도록 구성했습니다.', '클라이언트 쿼리 캐시 대신 서버·BFF 단의 fetch 기반 캐싱을 사용해 데이터 일관성을 유지했습니다.'] },
      { name: '반응형 · 크로스브라우저', why: ['Chrome·Edge·Firefox에서 그리드와 차트 데이터의 표시 방식, 스크롤 동작이 서로 달랐습니다.'], how: ['비동기 상태 반영과 레이아웃 전환의 경합을 찾아내고, reset·normalize 기반 스모크 테스트로 주요 브라우저의 표시 오류를 방지했습니다.'] },
      { name: 'i18n 다국어', why: ['영어·한국어 사용 환경을 함께 지원해야 했기 때문에 선택했습니다.'], how: ['ko/en 리소스를 분리해 UI 문자열을 국제화하고, 토글·셀렉트 기반 언어 전환 UI를 구현했습니다.'] },
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
    metrics: ['화면 반영 3~5초 → 1초 이내', 'JavaScript 29.7% · CSS 20.1% 감소', 'UAT 품질 이슈 500건 → 50건 내외', 'Chrome·Edge·Firefox 정합성 확보'],
  },
  {
    label: '03 · REALTIME',
    title: '원격 제어 및 모니터링',
    summary: 'MQTT 멱등성 처리와 WebSocket 구조 개선으로 실시간 제어의 신뢰성과 장애 대응성을 높였습니다.',
    problem: '네트워크 재전송과 중복 메시지로 제어 상태가 어긋났고, 실시간 연결 문제를 추적하는 데 많은 시간이 필요했습니다.',
    role: '실시간 메시지 처리, 소켓 연결 구조, 운영 관측 흐름과 배포 절차를 설계하고 개선했습니다.',
    technologies: [
      { name: 'MQTT 멱등성', why: ['MQTT의 at-least-once 특성 때문에 제어 응답이 장비별로 중복 도착했고, 장비가 10대를 넘으면 처리량이 빠르게 늘어났습니다.', '중복을 클라이언트마다 처리하기보다 서버에서 한 번 정리해야 상태 정합성을 유지할 수 있었습니다.'], how: ['AWS Lambda에서 하드웨어 ID·시간·컬럼을 기준으로 중복 응답을 제거해 웹 제어 반영 시간을 5초에서 1초 이내로 단축했습니다.'] },
      { name: 'WebSocket', why: ['브라우저가 IoT Core를 직접 구독하고 컴포넌트마다 소켓을 열어, 필요하지 않은 메시지까지 모든 화면이 처리하고 있었습니다.', '구독을 한 곳에서 관리하고 필요한 화면에만 전달하는 구조가 필요했습니다.'], how: ['Node.js WebSocket 게이트웨이에서 topic별 구독을 관리하고, 명시적 구독·해제·ack·재연결 시 재구독을 처리했습니다.', '단일 사용자 환경에 맞춰 topic을 화면 단위로 전달하도록 설계했습니다.'] },
      { name: 'S3 · Athena · CloudWatch 관측', why: ['장애 원인을 파악하는 데 며칠이 걸렸지만, 상시 서버 관측을 도입하기에는 비용 부담이 컸습니다.', '이벤트성 로그는 서버리스 환경에서 정기적으로 분석하는 편이 효율적이라고 판단했습니다.'], how: ['제어·상태 로그를 S3에 적재하고 CloudWatch 스케줄로 Lambda와 Athena를 정기 실행했습니다.', '이상 징후를 Slack으로 선제 알림해 장애 대응 시간을 3일에서 1일로 단축했습니다.'] },
      { name: 'GitHub Actions CI/CD', why: ['수동 배포는 느리고 실수가 발생하기 쉬웠으며, 서비스 중단 없이 변경 사항을 반영해야 했습니다.', '구성 요소의 특성에 맞춰 자동 배포와 무중단 배포를 적용해야 한다고 판단했습니다.'], how: ['GitHub Actions에서 단위 테스트·E2E·AI 리뷰를 거친 뒤 EC2로 자동 배포하도록 구성했습니다.', '소켓 서버는 PM2 graceful reload로 다운타임을 없애고, 프론트엔드는 nginx 교체 방식으로 배포했습니다.'] },
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
    metrics: ['제어 지연 5초 → 1초 이내', '중복 제어 방지', '실시간 반영 지연 50% 이상 개선', '장애 대응 3일 → 1일 이내', 'CI/CD 자동 배포'],
  },
];

const SIDE_PROJECTS: Project[] = [
  {
    label: '01 · SIDE PROJECT',
    title: 'PinHouse 주거 탐색 서비스',
    summary: '조건 기반 임대 주거 탐색 웹앱에서 BFF 도입부터 검색 아키텍처까지 주도하고, 상태를 성격별로 분리해 검색·필터·지도 기능을 구성했습니다.',
    problem: '첫 진입 화면에서 클라이언트가 여러 API를 순차로 조회해 그리다 보니 초기 렌더링이 무거웠고, 검색·필터의 공유 조건·임시 입력·서버 데이터가 뒤섞이기 쉬웠습니다.',
    role: '프론트엔드 개발자로 BFF 도입부터 검색 관련 아키텍처 구성까지 주도하고, 주소 검색·지역 필터·방 검색·홈 대중교통 표시·지도 매핑을 구현했습니다.',
    technologies: [
      { name: 'BFF 도입', why: ['공고 탐색·리스트·검색은 첫 화면에 표시할 데이터가 많아 초기 렌더링이 느렸습니다.', '여러 API를 순차 조회하기보다 서버에서 데이터를 조합해 완성된 형태로 내려주는 편이 유리하다고 판단했습니다.'], how: ['Next.js가 HTML을 생성하는 시점에 서버에서 데이터를 조합해 내려주도록 BFF 계층을 추가했습니다.', 'BFF를 단순 프록시가 아니라 인증 전달·조건 검증·데이터 정규화·원본 API 호출을 담당하는 경계로 구성했습니다.'] },
      { name: '상태 4계층 분리', why: ['공유 조건·임시 입력·서버 데이터가 섞이면 캐시가 꼬이고 UI 상태가 서버 데이터에 영향을 줄 수 있었습니다.', '상태를 성격별로 나눠야 각 계층의 책임과 캐시를 정확히 관리할 수 있다고 판단했습니다.'], how: ['명시 조건은 URL, UI 상태는 Zustand, 서버 조회·캐시는 TanStack Query, 인증·검증·서버 캐시는 BFF로 분리했습니다.', '필터는 draft와 applied로 나누고 Query Key 팩토리에서 정규화해 같은 조건이 같은 캐시를 사용하도록 했습니다.'] },
      { name: 'FSD 기능 분리', why: ['주소 검색·지역 필터·방 검색·대중교통·지도 매핑은 각각 로직과 UI가 커 서로 얽히기 쉬웠습니다.', '화면이 아니라 기능 단위로 경계를 나눠야 독립적으로 개발하고 유지보수할 수 있다고 판단했습니다.'], how: ['FSD 하이브리드 구조로 기능별 model·hooks·ui·server를 슬라이스로 관리했습니다.', '방 검색은 예산·조건·거리·집 유형 등의 단계로 나누고, 홈의 대용량 데이터는 BFF에서 미리 조합했습니다.'] },
      { name: 'AI 챗봇 npm 패키지', why: ['챗봇을 앱 코드에 직접 넣으면 다른 서비스에서 재사용하기 어렵고 유지보수 경계도 흐려졌습니다.', '독립 패키지로 분리해 배포 단위와 책임을 명확히 하는 편이 유리하다고 판단했습니다.'], how: ['OpenAI 기반 챗봇을 별도로 구현해 npm 패키지로 배포했습니다.', '실시간 소켓 대신 요청·응답 방식으로 구성하고, 서버에서 프롬프트 규칙에 따라 응답을 생성했습니다.'] },
    ],
    architecture: `flowchart LR
  URL[URL 명시 조건] --> Q[TanStack Query]
  UI[Zustand UI 상태]
  Q --> BFF[BFF 조합·검증·캐시]
  BFF --> API[원본 API]
  BFF --> SSR[SSR 완성형 첫 화면]`,
    code: `// 적용된(applied) 조건만 정규화해 Query Key 팩토리로
const 검색키 = (필터) => ['search', 정규화(필터.applied)];
const { data } = useQuery({ queryKey: 검색키(필터), queryFn });`,
    result: '실서비스 전 단계이므로 수치 대신, BFF 도입과 상태 4계층 분리로 초기 렌더링과 캐시 정합성을 안정적으로 확보한 과정을 보여줍니다.',
    metrics: ['초기 렌더링 체감 속도 개선', '상태 4계층 캐시 정합성 확보', 'FSD 기능 단위 독립성', "공모전 '모두의 아이디어' 우수참여자 선정"],
  },
  {
    label: '02 · SIDE PROJECT',
    title: 'SAJU:ME 사주 분석·추천',
    summary: "'오늘의 운세'만 소비하고 이탈하던 퍼널을 게이트 설계와 자체 계측으로 개선했습니다. 이 과정에서 정리한 Skill·Ontology 기반 AI Harness는 이후 FMS의 팀 공통 워크플로로 확장했습니다.",
    problem: "비회원 유입은 많았지만 '오늘의 운세'만 본 뒤 이탈해 가입과 오프라인 전환으로 이어지지 않았습니다. 동시에 AI의 역할과 검증 기준이 고정되지 않아 UX 판단·로직 구현·리뷰가 한 흐름에 섞였고, 결과 편차와 재작업이 커졌습니다.",
    role: 'FE 전반(솔로→팀 확장)을 맡아 유입·가입 전환 실험, Workers 기반 자체 계측, AI Harness·검증 구조, Edge 배포까지 설계·구현했습니다.',
    technologies: [
      { name: '선행 게이트', why: ['기능을 늘리기보다 방문자가 가입까지 이어지는 흐름을 먼저 개선해야 했습니다.', '무료 체험으로 가치를 먼저 경험시키면 전환이 높아질 것이라는 가설을 세웠습니다.'], how: ['무료 풀이를 가입 앞단의 선행 게이트로 배치해 가치를 먼저 경험하게 했고, 가입 전환율을 20%에서 30%로 높였습니다.'] },
      { name: 'Cloudflare Workers 계측', why: ['실험 효과를 판단할 지표가 필요했지만, 외부 도구만으로는 필요한 수준의 세밀한 계측이 어려웠습니다.', '실험에 필요한 지표를 직접 수집하고 확인할 수 있는 체계가 필요했습니다.'], how: ['Cloudflare Workers로 전환 로그를 수집하고 관리자 대시보드에서 지표를 시각화해, 실험 결과를 확인하고 다음 실험을 결정했습니다.'] },
      { name: 'AI Harness', why: ['AI가 한 번 좋은 결과를 내는 것과 일정한 품질을 반복해서 내는 것은 달랐습니다.', '결과를 반복 평가하고 실패 유형을 체계에 반영해야 개선을 이어갈 수 있다고 판단했습니다.'], how: ['트리거 평가를 100건 반복 실행해 검증 통과율 95%를 확인했습니다.', '실패를 작업 실패·의도 이탈·범위 초과로 분류해 Skill·Ontology·지침서에 반영했습니다.'] },
    ],
    architecture: `flowchart LR
  A[유입] --> B[무료 풀이 선행]
  B --> C[가입 게이트]
  C --> D[Workers 로그 계측]
  D --> E[variant 전환율 집계]`,
    code: `// variant·전환 이벤트를 Workers 로그로 남기고 집계
logConversion({ experiment, variant, converted });
const rate = aggregate(logs); // variant별 전환율`,
    result: '퍼널 실험에서 정리한 AI 역할과 평가 기준을 바탕으로, AI Harness를 FMS의 팀 공통 워크플로로 확장했습니다.',
    metrics: ['가입 전환율 20% → 30%', '상위 퍼널 관심 15% 증가', 'AI 검증 100건 중 95건 통과', 'SEO·SSR/SSG 렌더링 분리'],
  },
];

const SUPPORTING_PROJECTS = [
  { title: '웹 접근성 개선', tech: 'Semantic HTML · WAI-ARIA · focus-visible · axe-core · Playwright', reason: '화면을 고치는 데서 끝내지 않고 모든 서비스에 반복 적용할 수 있는 접근성 품질 기준을 만들기 위해 진행했습니다.', result: '8개 경로 자동 점검 체계 유지', detail: 'heading·landmark 구조, 탭과 패널의 ARIA 관계, 키보드 포커스, 저대비 텍스트를 정비하고 axe와 Playwright를 릴리즈 전 검증에 연결했습니다.' },
  { title: '성능 최적화', tech: 'Lighthouse · Web Vitals · Performance API · CI 검증', reason: '성능 점수보다 실제 사용자의 첫 화면 경험을 끌어올리고, 그 결과를 반복 측정하기 위해 진행했습니다.', result: '전후 성능 리포트와 회귀 검증 체계 구축', detail: 'LCP·First Load JS·공통 Provider·이미지·전역 스크립트를 분해하고 Lighthouse 리포트와 기능 테스트를 함께 관리했습니다.' },
];

const EXPERIENCE = [
  {
    company: '㈜티에스엠테크놀로지',
    en: 'TSM Technology',
    period: '2022.10 – 2026.07',
    role: '프론트엔드 개발자 · 과장 · 팀 리더 (2024.07~)',
    points: [
      'FMS 시설물 관리 — AI 하네스·품질 검증 체계 설계',
      'BEMS 운영 대시보드 — 성능 2단계 재구축 (React → Next.js)',
      '원격 제어·모니터링 — 실시간 제어 구조·CI/CD',
    ],
    stack: 'Next.js · TypeScript · AI Harness · OpenAPI/Zod · pnpm · CI/CD',
  },
  {
    company: '기흥그룹',
    en: 'HarleyDavidson-Korea',
    period: '2020.12 – 2022.03',
    role: 'ERP 개발자 · 사원',
    points: [
      '카드 매출 통계 · 바코드 재고 관리 · 중고차 거래 전산 (SQL 프로시저)',
    ],
    stack: '',
  },
];

function Reason({ label, content }: { label: string; content: string | string[] }) {
  if (Array.isArray(content)) {
    return (
      <div className="tech-reason">
        <b>{label}</b>
        <ul>{content.map((item) => <li key={item}>{item}</li>)}</ul>
      </div>
    );
  }
  return <p><b>{label}</b> {content}</p>;
}

export default function Home() {
  const profileImage = useBaseUrl('/img/profile.jpeg');

  return (
    <Layout title="박경찬 · Frontend Engineer" description="박경찬 프론트엔드 엔지니어 포트폴리오">
      <main>
        <section className="portfolio-hero">
          <div className="container">
            <div className="hero-copy">
              <p className="eyebrow">Frontend Engineer · 4 years · Team Lead</p>
              <h1>지속 가능한 구조와 검증 가능한 품질 기준을 만들며, 실제 운영 문제를 해결하는 프론트엔드 엔지니어를 지향합니다.</h1>
            </div>

            <div className="hero-intro-layout">
              <div className="hero-profile-block">
                <div>
                  <div className="hero-portrait-wrap">
                    <div className="portrait-glow" />
                    <img className="hero-portrait" src={profileImage} alt="프론트엔드 엔지니어 박경찬" />
                  </div>
                  <div className="portrait-caption">
                    <strong>Park Kyungchan</strong>
                    <span>Frontend Engineer</span>
                  </div>
                </div>

                <div className="hero-contact-card">
                  <div className="hero-contact-item">
                    <span className="hero-contact-label">Email</span>
                    <a href="mailto:developfff@gmail.com">developfff@gmail.com</a>
                  </div>
                  <div className="hero-contact-item">
                    <span className="hero-contact-label">GitHub</span>
                    <a href="https://github.com/kyungchan3007" target="_blank" rel="noreferrer">
                      github.com/kyungchan3007
                    </a>
                  </div>
                  <div className="hero-contact-item">
                    <span className="hero-contact-label">Focus</span>
                    <p>React · Next.js · TypeScript · AI Workflow · Realtime UX</p>
                  </div>
                </div>
              </div>

              <div className="hero-introduce">
                <h2>About</h2>
                <ul>
                  {HERO_INTRO.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            </div>

          </div>
        </section>

        <section className="portfolio-section"><div className="container"><div className="section-heading section-heading-left"><p className="eyebrow">Strengths</p><h2>주요 역할</h2></div><div className="strength-list">{STRENGTHS.map((item) => <article className="strength-item" key={item.number}><span className="item-number">{item.number}</span><div><h3>{item.title}</h3><p>{item.desc}</p><strong>{item.proof}</strong></div></article>)}</div></div></section>

        <section className="portfolio-section projects-section" id="projects"><div className="container"><div className="section-heading section-heading-left"><p className="eyebrow">Selected work</p><h2>대표 프로젝트</h2></div><div className="project-list">{PROJECTS.map((project) => <article className="project-item project-detail-item" key={project.title}><div className="project-index">{project.label}</div><div className="project-main"><h3>{project.title}</h3><p className="project-summary">{project.summary}</p><div className="project-context"><div><small>Problem</small><p>{project.problem}</p></div><div><small>My role</small><p>{project.role}</p></div></div><div className="technology-proof"><h4>담당 역할과 구현</h4>{project.technologies.map((technology) => <div className="technology-item" key={technology.name}><div className="technology-text"><strong>{technology.name}</strong><Reason label="선택 이유" content={technology.why} /><Reason label="적용 방식" content={technology.how} /></div></div>)}</div>{project.improvements && <div className="ops-block"><h4>운영 개선</h4><p className="ops-intro">{project.improvements.intro}</p><div className="ops-list">{project.improvements.items.map((item) => <div className="ops-item" key={item.title}><strong>{item.title}</strong><ul>{item.points.map((pt) => <li key={pt}>{pt}</li>)}</ul></div>)}</div></div>}{project.tradeoff && <div className="ops-block"><h4>{project.tradeoff.title}</h4><ul className="tradeoff-list">{project.tradeoff.points.map((pt) => <li key={pt}>{pt}</li>)}</ul></div>}{project.technologies.some((technology) => technology.detail) && <div className="modal-card-row">{project.technologies.filter((technology) => technology.detail).map((technology) => <DetailModalButton key={technology.detail} {...MODAL_DETAILS[technology.detail!]} />)}</div>}<div className="project-bottom"><div className="project-details">{project.metrics.map((metric) => <span key={metric}>{metric}</span>)}</div></div><p className="project-result-line"><span>Result</span>{project.result}</p></div></article>)}</div></div></section>

        <section className="portfolio-section side-projects-section"><div className="container"><div className="section-heading section-heading-left"><p className="eyebrow">Side projects</p><h2>사이드 프로젝트</h2></div><div className="project-list">{SIDE_PROJECTS.map((project) => <article className="project-item project-detail-item" key={project.title}><div className="project-index">{project.label}</div><div className="project-main"><h3>{project.title}</h3><p className="project-summary">{project.summary}</p><div className="project-context"><div><small>Problem</small><p>{project.problem}</p></div><div><small>My role</small><p>{project.role}</p></div></div><div className="technology-proof"><h4>담당 역할과 구현</h4>{project.technologies.map((technology) => <div className="technology-item" key={technology.name}><div className="technology-text"><strong>{technology.name}</strong><Reason label="선택 이유" content={technology.why} /><Reason label="적용 방식" content={technology.how} /></div></div>)}</div>{project.improvements && <div className="ops-block"><h4>운영 개선</h4><p className="ops-intro">{project.improvements.intro}</p><div className="ops-list">{project.improvements.items.map((item) => <div className="ops-item" key={item.title}><strong>{item.title}</strong><ul>{item.points.map((pt) => <li key={pt}>{pt}</li>)}</ul></div>)}</div></div>}{project.tradeoff && <div className="ops-block"><h4>{project.tradeoff.title}</h4><ul className="tradeoff-list">{project.tradeoff.points.map((pt) => <li key={pt}>{pt}</li>)}</ul></div>}{project.technologies.some((technology) => technology.detail) && <div className="modal-card-row">{project.technologies.filter((technology) => technology.detail).map((technology) => <DetailModalButton key={technology.detail} {...MODAL_DETAILS[technology.detail!]} />)}</div>}<div className="project-bottom"><div className="project-details">{project.metrics.map((metric) => <span key={metric}>{metric}</span>)}</div></div><p className="project-result-line"><span>Result</span>{project.result}</p></div></article>)}</div></div></section>

        <section className="portfolio-section supporting-section"><div className="container"><div className="section-heading section-heading-left"><p className="eyebrow">Cross-cutting work</p><h2>전 서비스에 공통 적용한 개선</h2></div><div className="supporting-list">{SUPPORTING_PROJECTS.map((project) => <article className="supporting-item" key={project.title}><div><span className="project-index">{project.tech}</span><h3>{project.title}</h3><p>{project.detail}</p></div><div className="supporting-proof"><small>Why</small><p>{project.reason}</p><strong>{project.result}</strong></div></article>)}</div></div></section>

        <section className="portfolio-section experience-section"><div className="container"><div className="section-heading section-heading-left"><p className="eyebrow">Experience</p><h2>경력</h2></div><div className="experience-list">{EXPERIENCE.map((exp) => <article className="experience-item" key={exp.company}><div className="experience-head"><div><strong>{exp.company}</strong><span className="experience-en">{exp.en}</span><p className="experience-role">{exp.role}</p></div><span className="experience-period">{exp.period}</span></div><ul className="experience-points">{exp.points.map((point) => <li key={point}>{point}</li>)}</ul>{exp.stack && <p className="experience-stack"><span>Stack</span>{exp.stack}</p>}</article>)}</div></div></section>

        <footer className="portfolio-footer"><div className="container footer-inner"><div><p className="eyebrow">Let&apos;s work together</p></div><div className="footer-links"><a href="mailto:developfff@gmail.com">developfff@gmail.com</a><a href="https://github.com/kyungchan3007" target="_blank" rel="noreferrer">GitHub ↗</a></div></div></footer>
      </main>
    </Layout>
  );
}
