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
          label: '원격 제어 시스템',
          items: [
            'projects/hvac-control',
            'architecture/layered-to-vsa',
            'realtime/aws-iot-control',
            'realtime/dedup-idempotency',
          ],
        },
        'projects/pinhouse',
        'projects/saju',
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
