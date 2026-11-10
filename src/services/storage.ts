import { EvaluationStats, QUESTIONS, SurveyResponse, interpretScore } from '../types';

const STORAGE_KEY = 'training_survey_responses_v1';
const DEVICE_ID_KEY = 'training_survey_device_id';
const SUBMITTED_FLAG_KEY = 'training_survey_has_submitted';
const FIREBASE_CONFIG_KEY = 'training_survey_firebase_config';

const BROADCAST_CHANNEL_NAME = 'training_feedback_sync_channel';

// Realistic sample seed data to demonstrate live dashboard visually
const INITIAL_SEED_RESPONSES: SurveyResponse[] = [
  {
    id: 'seed-1',
    timestamp: Date.now() - 1000 * 60 * 35,
    deviceId: 'dev-seed-01',
    scores: { q1: 5, q2: 5, q3: 4, q4: 5, q5: 5 },
    feedback: 'วิทยากรถ่ายทอดได้ยอดเยี่ยมมากครับ อธิบายเรื่องยากให้เข้าใจง่าย มีตัวอย่างประกอบการทำงานจริง',
  },
  {
    id: 'seed-2',
    timestamp: Date.now() - 1000 * 60 * 30,
    deviceId: 'dev-seed-02',
    scores: { q1: 5, q2: 4, q3: 5, q4: 4, q5: 4 },
    feedback: 'เนื้อหาดีมาก ทันสมัย นำไปปรับใช้กับโปรเจกต์ของทีมได้ทันทีในวันพรุ่งนี้',
  },
  {
    id: 'seed-3',
    timestamp: Date.now() - 1000 * 60 * 25,
    deviceId: 'dev-seed-03',
    scores: { q1: 4, q2: 5, q3: 4, q4: 4, q5: 5 },
    feedback: 'ชอบการทำเวิร์กช็อปกลุ่ม ได้แลกเปลี่ยนมุมมองกับเพื่อนร่วมงานแผนกอื่น',
  },
  {
    id: 'seed-4',
    timestamp: Date.now() - 1000 * 60 * 20,
    deviceId: 'dev-seed-04',
    scores: { q1: 5, q2: 5, q3: 5, q4: 5, q5: 5 },
    feedback: 'ประทับใจมาก เอกสารประกอบและสไลด์สรุปเนื้อหาได้สวยงามและกระชับ',
  },
  {
    id: 'seed-5',
    timestamp: Date.now() - 1000 * 60 * 16,
    deviceId: 'dev-seed-05',
    scores: { q1: 4, q2: 4, q3: 3, q4: 4, q5: 4 },
    feedback: 'อยากให้เพิ่มเวลาในช่วง Q&A เพิ่มอีกสักนิดครับ คำถามน่าสนใจเยอะมาก',
  },
  {
    id: 'seed-6',
    timestamp: Date.now() - 1000 * 60 * 12,
    deviceId: 'dev-seed-06',
    scores: { q1: 5, q2: 4, q3: 4, q4: 5, q5: 5 },
  },
  {
    id: 'seed-7',
    timestamp: Date.now() - 1000 * 60 * 8,
    deviceId: 'dev-seed-07',
    scores: { q1: 5, q2: 5, q3: 4, q4: 4, q5: 5 },
    feedback: 'ระบบและสัญญาณอินเทอร์เน็ตลื่นไหลดี ทีมงานอำนวยความสะดวกดีมากครับ',
  },
  {
    id: 'seed-8',
    timestamp: Date.now() - 1000 * 60 * 3,
    deviceId: 'dev-seed-08',
    scores: { q1: 4, q2: 5, q3: 4, q4: 4, q5: 4 },
    feedback: 'อยากให้จัดหัวข้อขั้นสูง (Advanced Level) ต่อในรุ่นถัดไปครับ',
  },
];

let broadcastChannel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    broadcastChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
  }
} catch (e) {
  console.warn('BroadcastChannel not supported', e);
}

export function getDeviceId(): string {
  if (typeof window === 'undefined') return 'server';
  let deviceId = localStorage.getItem(DEVICE_ID_KEY);
  if (!deviceId) {
    deviceId = 'dev_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }
  return deviceId;
}

export function hasDeviceSubmitted(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(SUBMITTED_FLAG_KEY) === 'true';
}

export function setDeviceSubmitted(submitted: boolean): void {
  if (typeof window === 'undefined') return;
  if (submitted) {
    localStorage.setItem(SUBMITTED_FLAG_KEY, 'true');
  } else {
    localStorage.removeItem(SUBMITTED_FLAG_KEY);
  }
}

export function getStoredResponses(): SurveyResponse[] {
  if (typeof window === 'undefined') return INITIAL_SEED_RESPONSES;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    // initialize with seed
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEED_RESPONSES));
    return INITIAL_SEED_RESPONSES;
  }
  try {
    return JSON.parse(raw) as SurveyResponse[];
  } catch (err) {
    console.error('Error parsing stored responses', err);
    return INITIAL_SEED_RESPONSES;
  }
}

export function saveResponses(responses: SurveyResponse[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(responses));
  if (broadcastChannel) {
    broadcastChannel.postMessage({ type: 'RESPONSES_UPDATED', responses });
  }
}

export function addSurveyResponse(
  scores: Record<string, number>,
  feedback?: string
): SurveyResponse {
  const deviceId = getDeviceId();
  const responses = getStoredResponses();

  const newResponse: SurveyResponse = {
    id: 'res_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    timestamp: Date.now(),
    scores,
    feedback: feedback?.trim() || undefined,
    deviceId,
  };

  const updated = [newResponse, ...responses];
  saveResponses(updated);
  setDeviceSubmitted(true);

  // Sync to Firebase if configured
  syncToFirebaseIfConfigured(newResponse).catch((e) =>
    console.warn('Firebase sync warning:', e)
  );

  return newResponse;
}

export function resetAllResponses(): void {
  if (typeof window === 'undefined') return;
  saveResponses([]);
  setDeviceSubmitted(false);
}

export function seedSampleResponses(): void {
  if (typeof window === 'undefined') return;
  saveResponses(INITIAL_SEED_RESPONSES);
}

export function calculateStats(responses: SurveyResponse[]): EvaluationStats {
  const total = responses.length;

  if (total === 0) {
    const emptyDist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    return {
      totalResponses: 0,
      overallAverage: 0,
      overallInterpretation: 'ยังไม่มีข้อมูล',
      overallColorClass: 'text-slate-500',
      questionStats: QUESTIONS.map((q) => ({
        id: q.id,
        title: q.title,
        category: q.category,
        average: 0,
        count: 0,
        interpretation: 'ยังไม่มีข้อมูล',
        colorClass: 'text-slate-400',
        distribution: { ...emptyDist },
      })),
      feedbackList: [],
      scoreDistribution: { ...emptyDist },
    };
  }

  const overallDist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let grandTotalScore = 0;
  let totalScoreCount = 0;

  const questionStats = QUESTIONS.map((q) => {
    const qDist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let qTotal = 0;
    let qCount = 0;

    for (const res of responses) {
      const score = res.scores[q.id];
      if (score >= 1 && score <= 5) {
        qDist[score as 1 | 2 | 3 | 4 | 5]++;
        overallDist[score as 1 | 2 | 3 | 4 | 5]++;
        qTotal += score;
        qCount++;
        grandTotalScore += score;
        totalScoreCount++;
      }
    }

    const average = qCount > 0 ? parseFloat((qTotal / qCount).toFixed(2)) : 0;
    const interp = interpretScore(average);

    return {
      id: q.id,
      title: q.title,
      category: q.category,
      average,
      count: qCount,
      interpretation: interp.text,
      colorClass: interp.colorClass,
      distribution: qDist,
    };
  });

  const overallAverage =
    totalScoreCount > 0
      ? parseFloat((grandTotalScore / totalScoreCount).toFixed(2))
      : 0;
  const overallInterp = interpretScore(overallAverage);

  const feedbackList = responses
    .filter((r) => r.feedback && r.feedback.trim().length > 0)
    .map((r) => {
      const scores = Object.values(r.scores);
      const avg =
        scores.length > 0
          ? scores.reduce((a, b) => a + b, 0) / scores.length
          : 0;
      return {
        id: r.id,
        text: r.feedback!,
        timestamp: r.timestamp,
        averageRating: parseFloat(avg.toFixed(1)),
      };
    })
    .sort((a, b) => b.timestamp - a.timestamp);

  return {
    totalResponses: total,
    overallAverage,
    overallInterpretation: overallInterp.text,
    overallColorClass: overallInterp.colorClass,
    questionStats,
    feedbackList,
    scoreDistribution: overallDist,
  };
}

export function subscribeToResponses(
  callback: (responses: SurveyResponse[]) => void
): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleMessage = (event: MessageEvent) => {
    if (event.data && event.data.type === 'RESPONSES_UPDATED') {
      callback(event.data.responses || getStoredResponses());
    }
  };

  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      callback(getStoredResponses());
    }
  };

  if (broadcastChannel) {
    broadcastChannel.addEventListener('message', handleMessage);
  }
  window.addEventListener('storage', handleStorage);

  return () => {
    if (broadcastChannel) {
      broadcastChannel.removeEventListener('message', handleMessage);
    }
    window.removeEventListener('storage', handleStorage);
  };
}

export function exportResponsesToCSV(responses: SurveyResponse[]): void {
  if (responses.length === 0) {
    alert('ยังไม่มีข้อมูลสำหรับดาวน์โหลด');
    return;
  }

  const headers = [
    'ลำดับ',
    'รหัสการตอบ',
    'วันเวลาที่ตอบ',
    'ข้อ 1 (เนื้อหาหลักสูตร)',
    'ข้อ 2 (วิทยากร)',
    'ข้อ 3 (เวลาและกิจกรรม)',
    'ข้อ 4 (สถานที่และการจัดการ)',
    'ข้อ 5 (การนำไปใช้จริง)',
    'คะแนนเฉลี่ย',
    'ระดับความพึงพอใจ',
    'ข้อเสนอแนะเพิ่มเติม',
  ];

  const rows = responses.map((r, index) => {
    const scores = [
      r.scores.q1 || '',
      r.scores.q2 || '',
      r.scores.q3 || '',
      r.scores.q4 || '',
      r.scores.q5 || '',
    ];
    const numericScores = Object.values(r.scores).filter(
      (v) => typeof v === 'number'
    );
    const avg =
      numericScores.length > 0
        ? (
            numericScores.reduce((a, b) => a + b, 0) / numericScores.length
          ).toFixed(2)
        : '';
    const interp = avg ? interpretScore(parseFloat(avg)).text : '';
    const dateStr = new Date(r.timestamp).toLocaleString('th-TH');
    const escapedFeedback = r.feedback
      ? `"${r.feedback.replace(/"/g, '""')}"`
      : '""';

    return [
      index + 1,
      r.id,
      `"${dateStr}"`,
      ...scores,
      avg,
      `"${interp}"`,
      escapedFeedback,
    ].join(',');
  });

  // \uFEFF BOM for Excel UTF-8 support
  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  const now = new Date();
  const dateSuffix = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
  link.setAttribute('download', `ผลประเมินความพึงพอใจการอบรม_${dateSuffix}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Optional Firebase Realtime Database direct sync helper
export interface FirebaseDbConfig {
  databaseURL: string;
}

export function getFirebaseConfig(): FirebaseDbConfig | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(FIREBASE_CONFIG_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setFirebaseConfig(config: FirebaseDbConfig | null): void {
  if (typeof window === 'undefined') return;
  if (!config) {
    localStorage.removeItem(FIREBASE_CONFIG_KEY);
  } else {
    localStorage.setItem(FIREBASE_CONFIG_KEY, JSON.stringify(config));
  }
}

async function syncToFirebaseIfConfigured(
  response: SurveyResponse
): Promise<void> {
  const config = getFirebaseConfig();
  if (!config?.databaseURL) return;

  const url = config.databaseURL.replace(/\/$/, '') + '/responses.json';
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(response),
  });
}
