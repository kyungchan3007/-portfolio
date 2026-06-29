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
        {
          type: 'doc',
          id: 'projects/pinhouse',
          label: 'PinHouse',
        },
        {
          type: 'doc',
          id: 'projects/saju',
          label: 'SAJU:ME',
        },
      ],
    },
  ],
  qualitySidebar: [
    {
      type: 'category',
      label: '품질',
      items: [
        {
          type: 'category',
          label: 'Merge Gate',
          items: ['quality/merge-gate-ci'],
        },
        {
          type: 'category',
          label: '버전 관리',
          items: ['quality/version-management'],
        },
      ],
    },
  ],
  aiWorkflowSidebar: [
    {
      type: 'category',
      label: 'AI Workflow',
      items: [
        'ai-workflow/overview',
        'ai-workflow/agents',
        'ai-workflow/harness-ontology',
        'ai-workflow/skill-system',
        'ai-workflow/design-system',
        'ai-workflow/code-review',
        'ai-workflow/agent-pipeline',
      ],
    },
  ],
};

export default sidebars;
