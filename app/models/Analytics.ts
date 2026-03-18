export interface MetricData {
  value: number;
  label: string;
  change: number;
  changeType: "increase" | "decrease" | "neutral";
  unit?: string;
}

export interface GlobalAnalytics {
  activeDoctors: MetricData;
  waitingPatients: MetricData;
  avgWaitingTime: MetricData;
  consultationsToday: MetricData;
}

export interface GlobalAnalyticsResponse {
  metrics: GlobalAnalytics;
}
