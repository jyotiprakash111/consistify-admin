export type GrowthPoint = {
  date: string;
  activeUsers: number;
  newUsers: number;
};

export type DropoffStage = {
  stage: string;
  dropOffRate: number;
  notes: string;
};

export type RetentionMetric = {
  cohortLabel: string;
  day1Retention: number;
  day7Retention: number;
  day30Retention: number;
  focusConsistencyScore: number;
};

export type SpacedRepetitionMetric = {
  cadenceDays: number;
  activeLearners: number;
  completionRate: number;
  trophyLabel: string;
};

export type CategoryCount = {
  category: string;
  count: number;
};

export type EisenhowerQuadrant = {
  quadrant: string;
  label: string;
  count: number;
};

export type AnalyticsPayload = {
  success: boolean;
  growthPoints: GrowthPoint[];
  dropoffStages: DropoffStage[];
  retentionMetrics: RetentionMetric[];
  spacedRepetitionMetrics: SpacedRepetitionMetric[];
  eisenhowerTasks: Array<Record<string, unknown>>;
};

export type SubjectsAnalyticsPayload = {
  success: boolean;
  totalSubjects: number;
  schedulingMetrics: {
    scheduledSessions: number;
    completedScheduledSessions: number;
  };
  categoryCounts: CategoryCount[];
  eisenhowerDistribution: EisenhowerQuadrant[];
  recentSubjects: Array<Record<string, unknown>>;
};
