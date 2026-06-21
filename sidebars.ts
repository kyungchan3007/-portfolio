import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  projectsSidebar: [
    {
      type: 'category',
      label: '프로젝트',
      items: [
        {
          type: 'category',
          label: 'FMS',
          items: [
            'projects/fms',
            'architecture/vsa-parallel-dev',
          ],
        },
        {
          type: 'category',
          label: 'BEMS',
          items: [
            'projects/bems',
            'architecture/layered-to-fsd',
          ],
        },
        {
          type: 'category',
          label: '공조기',
          items: [
            'projects/hvac-control',
            'architecture/layered-to-vsa',
          ],
        },
        'projects/pinhouse',
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
