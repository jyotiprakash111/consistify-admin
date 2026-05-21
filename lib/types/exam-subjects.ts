export type SubjectQuadrant = 'UI' | 'UNI' | 'NUI' | 'NUNI';

export type ExamSubjectTemplate = {
  id: string;
  examGroup: string;
  name: string;
  quadrant: SubjectQuadrant;
  sortOrder: number;
};

export const QUADRANT_OPTIONS: { value: SubjectQuadrant; label: string }[] = [
  { value: 'UI', label: 'UI — Important & Urgent' },
  { value: 'UNI', label: 'UNI — Important, not urgent' },
  { value: 'NUI', label: 'NUI — Urgent, not important' },
  { value: 'NUNI', label: 'NUNI — Neither urgent nor important' },
];
