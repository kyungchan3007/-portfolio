import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  projectsSidebar: [
    {
      type: 'category',
      label: '프로젝트',
      items: [
        'projects/fms',
        'projects/bems',
        'projects/hvac-control',
        'projects/pinhouse',
      ],
    },
  ],
  architectureSidebar: [
    {
      type: 'category',
      label: '아키텍처',
      items: [
        'architecture/layered-to-fsd',
        'architecture/layered-to-vsa',
        'architecture/vsa-parallel-dev',
      ],
    },
  ],
  realtimeSidebar: [
    {
      type: 'category',
      label: '실시간 통신',
      items: [
        'realtime/sse-vs-polling',
        'realtime/aws-iot-control',
        'realtime/dedup-idempotency',
      ],
    },
  ],
  qualitySidebar: [
    {
      type: 'category',
      label: '품질',
      items: [
        'quality/merge-gate-ci',
      ],
    },
  ],
  aiWorkflowSidebar: [
    {
      type: 'category',
      label: 'AI Workflow',
      items: [
        'ai-workflow/harness-engineering',
        'ai-workflow/agent-pipeline',
      ],
    },
  ],
};

export default sidebars;
