---
sidebar_position: 2
title: BEMS — Building Energy Management System
sidebar_label: BEMS
---

# BEMS — Building Energy Management System

**2023.08 – 2025.08 · ㈜TSM Technology · 과장 · FE 개발 · 팀 리딩**

:::info 개요
건물 에너지 사용 데이터 실시간 수집·시각화 및 설비 조회·집계 분석 시스템.
클라이언트 요구사항 회의·일정 조율과 팀 리딩·직접 개발을 병행했습니다.
:::

## 기술 스택

`React` `TypeScript` `Redux` `SSE` `react-query` `Styled-components` `SCSS` `Sonar`

---

## 성과 요약

| 지표 | Before | After |
|---|---|---|
| 네트워크 요청 | 폴링 기반 | SSE 전환으로 **60% 감소** |
| 화면 반영 지연 | 3~5초 | **1초 이내** |
| 설비 트리 렌더링 | 전체 재렌더링 | React DevTools 기준 **60% 개선** |
| UAT 버그 | 다수 | 자정 캐시 초기화로 **80% 감소** |

---

## 아키텍처 전환

**Layered Architecture → FSD(Feature-Sliced Design)**

레이어 비대화 한계 도달 후 도메인별 책임 분리를 위해 FSD로 전환.

→ 자세한 내용: [Layered → FSD 전환](/architecture/layered-to-fsd)

---

## 주요 구현

### 1. SSE 실시간 통신

폴링 방식에서 SSE로 전환해 네트워크 요청 60% 감소, 화면 반영 지연 1초 이내 단축.

→ 자세한 내용: [SSE vs 폴링](/realtime/sse-vs-polling)

### 2. 10만+ 설비 트리 렌더링 최적화

```
문제: 노드 상태 변경 시 전체 트리 재렌더링 → 화면 조작 지연
해결: 확장된 서브트리만 상태 유지, 미노출 하위 노드 조건부 unmount
```

### 3. Container-Presenter 패턴

설비 조회 화면을 필터 영역(Container)과 결과 영역(Presenter)으로 분리, 화면 로직과 UI 책임 분리.

```tsx title="FacilityPage (Container)"
export function FacilityPage() {
  const { filters, setFilter } = useFacilityFilters();
  const { data, isLoading } = useFacilityQuery(filters);

  return (
    <FacilityLayout>
      <FacilityFilterPanel filters={filters} onChange={setFilter} />
      <FacilityResultPanel data={data} isLoading={isLoading} />
    </FacilityLayout>
  );
}
```

### 4. React Query 자정 캐시 초기화

```ts title="useMidnightCacheReset.ts"
export function useMidnightCacheReset() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const msUntilMidnight = midnight.getTime() - now.getTime();

    const timer = setTimeout(() => {
      queryClient.invalidateQueries();
    }, msUntilMidnight);

    return () => clearTimeout(timer);
  }, [queryClient]);
}
```

---

## Issue & Resolution

:::danger 문제
10만+ 설비 트리에서 노드 상태 변경 시 전체 트리가 재렌더링되어 화면 조작 지연 발생.
:::

**원인**: 단일 상태 변경이 부모→자식 전체 계층으로 전파되는 구조.

**해결**: 확장된 서브트리만 상태 유지, 미노출 하위 노드 조건부 unmount로 렌더링 범위 제한.

:::tip 결과
React DevTools 기준 속도 60% 개선, 조작 반응 속도 30% 향상.
:::
