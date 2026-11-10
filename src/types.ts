export interface EvaluationQuestion {
  id: string;
  title: string;
  category: string;
  description: string;
}

export interface SurveyResponse {
  id: string;
  timestamp: number;
  scores: Record<string, number>; // questionId -> 1..5
  feedback?: string;
  deviceId: string;
}

export interface QuestionStat {
  id: string;
  title: string;
  category: string;
  average: number;
  count: number;
  interpretation: string;
  colorClass: string;
  distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export interface EvaluationStats {
  totalResponses: number;
  overallAverage: number;
  overallInterpretation: string;
  overallColorClass: string;
  questionStats: QuestionStat[];
  feedbackList: Array<{
    id: string;
    text: string;
    timestamp: number;
    averageRating: number;
  }>;
  scoreDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export const QUESTIONS: EvaluationQuestion[] = [
  {
    id: 'q1',
    category: 'ด้านเนื้อหาหลักสูตร',
    title: 'เนื้อหาการอบรมมีความชัดเจน ตรงตามเป้าหมาย และเป็นประโยชน์',
    description: 'ความครบถ้วน เข้าใจง่าย และความทันสมัยของเนื้อหา',
  },
  {
    id: 'q2',
    category: 'ด้านวิทยากร',
    title: 'วิทยากรมีความรู้ความเชี่ยวชาญ และสามารถถ่ายทอดได้เป็นอย่างดี',
    description: 'การอธิบาย การยกตัวอย่าง และการตอบข้อซักถาม',
  },
  {
    id: 'q3',
    category: 'ด้านการจัดเวลาและกิจกรรม',
    title: 'การจัดลำดับเวลาและกิจกรรมฝึกปฏิบัติมีความเหมาะสม',
    description: 'การบริหารเวลา การร่วมกิจกรรม และการแลกเปลี่ยนเรียนรู้',
  },
  {
    id: 'q4',
    category: 'ด้านสถานที่และการจัดการ',
    title: 'บรรยากาศ อุปกรณ์ สัญญาณ และการอำนวยความสะดวกในการอบรม',
    description: 'ความพร้อมของเครื่องมือ ความสะดวกสบาย และการให้บริการ',
  },
  {
    id: 'q5',
    category: 'ด้านการนำไปใช้จริง',
    title: 'ความพร้อมและความมั่นใจในการนำความรู้ไปประยุกต์ใช้ในการทำงาน',
    description: 'สามารถต่อยอด พัฒนางาน และสร้างประโยชน์ต่อองค์กร',
  },
];

export const RATING_LEVELS = [
  {
    score: 1,
    label: 'น้อยที่สุด',
    shortLabel: '1 - น้อยที่สุด',
    emoji: '😡',
    color: '#EF4444',
  },
  {
    score: 2,
    label: 'น้อย',
    shortLabel: '2 - น้อย',
    emoji: '🙁',
    color: '#F97316',
  },
  {
    score: 3,
    label: 'ปานกลาง',
    shortLabel: '3 - ปานกลาง',
    emoji: '😐',
    color: '#EAB308',
  },
  {
    score: 4,
    label: 'มาก',
    shortLabel: '4 - มาก',
    emoji: '😊',
    color: '#10B981',
  },
  {
    score: 5,
    label: 'มากที่สุด',
    shortLabel: '5 - มากที่สุด',
    emoji: '🤩',
    color: '#059669',
  },
];

/**
 * Standard 5-level scale interpretation in Thai education & training standards:
 * 4.51 - 5.00: มากที่สุด (Highest / Excellent)
 * 3.51 - 4.50: มาก (High / Good)
 * 2.51 - 3.50: ปานกลาง (Moderate / Fair)
 * 1.51 - 2.50: น้อย (Low / Poor)
 * 1.00 - 1.50: น้อยที่สุด (Lowest / Very Poor)
 */
export function interpretScore(score: number): {
  text: string;
  level: number;
  colorClass: string;
  badgeBg: string;
  badgeText: string;
} {
  if (score >= 4.51) {
    return {
      text: 'มากที่สุด',
      level: 5,
      colorClass: 'text-emerald-700 dark:text-emerald-400',
      badgeBg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800',
      badgeText: 'text-emerald-700 dark:text-emerald-300',
    };
  }
  if (score >= 3.51) {
    return {
      text: 'มาก',
      level: 4,
      colorClass: 'text-teal-700 dark:text-teal-400',
      badgeBg: 'bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800',
      badgeText: 'text-teal-700 dark:text-teal-300',
    };
  }
  if (score >= 2.51) {
    return {
      text: 'ปานกลาง',
      level: 3,
      colorClass: 'text-amber-700 dark:text-amber-400',
      badgeBg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
      badgeText: 'text-amber-700 dark:text-amber-300',
    };
  }
  if (score >= 1.51) {
    return {
      text: 'น้อย',
      level: 2,
      colorClass: 'text-orange-700 dark:text-orange-400',
      badgeBg: 'bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-800',
      badgeText: 'text-orange-700 dark:text-orange-300',
    };
  }
  return {
    text: 'น้อยที่สุด',
    level: 1,
    colorClass: 'text-rose-700 dark:text-rose-400',
    badgeBg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800',
    badgeText: 'text-rose-700 dark:text-rose-300',
  };
}
