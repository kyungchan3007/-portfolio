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
          ],
        },
        {
          type: 'category',
          label: 'BEMS',
          items: [
            'projects/bems',
            'projects/bems-data-validation',
          ],
        },
        {
          type: 'category',
          label: '원격 제어 시스템',
          items: [
            'projects/hvac-control',
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
  architectureSidebar: [
    {
      type: 'category',
      label: '아키텍처',
      items: [
        'architecture/ssr-auth-rendering',
        'architecture/project-architecture',
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
