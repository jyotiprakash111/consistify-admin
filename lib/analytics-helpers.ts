import type {
  AnalyticsPayload,
  CategoryCount,
  DropoffStage,
  EisenhowerQuadrant,
  GrowthPoint,
  RetentionMetric,
  SpacedRepetitionMetric,
  SubjectsAnalyticsPayload,
} from '@/lib/types/analytics';

export function parseAnalyticsPayload(raw: Record<string, unknown> | null): AnalyticsPayload | null {
  if (!raw) return null;
  return {
    success: Boolean(raw.success),
    growthPoints: (raw.growthPoints as GrowthPoint[]) ?? [],
    dropoffStages: (raw.dropoffStages as DropoffStage[]) ?? [],
    retentionMetrics: (raw.retentionMetrics as RetentionMetric[]) ?? [],
    spacedRepetitionMetrics: (raw.spacedRepetitionMetrics as SpacedRepetitionMetric[]) ?? [],
    eisenhowerTasks: (raw.eisenhowerTasks as Array<Record<string, unknown>>) ?? [],
  };
}

export function parseSubjectsPayload(raw: Record<string, unknown> | null): SubjectsAnalyticsPayload | null {
  if (!raw) return null;
  const scheduling = (raw.schedulingMetrics as Record<string, number>) ?? {};
  return {
    success: Boolean(raw.success),
    totalSubjects: Number(raw.totalSubjects ?? 0),
    schedulingMetrics: {
      scheduledSessions: Number(scheduling.scheduledSessions ?? 0),
      completedScheduledSessions: Number(scheduling.completedScheduledSessions ?? 0),
    },
    categoryCounts: (raw.categoryCounts as CategoryCount[]) ?? [],
    eisenhowerDistribution: (raw.eisenhowerDistribution as EisenhowerQuadrant[]) ?? [],
    recentSubjects: (raw.recentSubjects as Array<Record<string, unknown>>) ?? [],
  };
}
