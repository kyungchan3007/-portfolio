import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  projectsSidebar: [
    {
      type: 'category',
      label: '대표 프로젝트',
      items: [
        'intro',
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
      label: '검증과 릴리즈',
      items: [
        {
          type: 'category',
          label: '테스트 기반 개발',
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
      label: '구조와 렌더링',
      items: [
        'architecture/ssr-auth-rendering',
        'architecture/project-architecture',
      ],
    },
  ],
  aiWorkflowSidebar: [
    {
      type: 'category',
      label: '작업 기준과 자동화',
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
