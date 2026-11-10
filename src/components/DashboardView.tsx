import React, { useState } from 'react';
import {
  Users,
  Star,
  Award,
  MessageSquare,
  QrCode,
  Download,
  PlusCircle,
  RotateCcw,
  Sparkles,
  TrendingUp,
  SlidersHorizontal,
  ChevronRight,
  Clock,
} from 'lucide-react';
import { EvaluationStats, QUESTIONS, RATING_LEVELS, SurveyResponse } from '../types';
import {
  addSurveyResponse,
  exportResponsesToCSV,
  resetAllResponses,
  seedSampleResponses,
} from '../services/storage';

interface DashboardViewProps {
  stats: EvaluationStats;
  responses: SurveyResponse[];
  onOpenQr: () => void;
  onGoToSurvey: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  responses,
  onOpenQr,
  onGoToSurvey,
}) => {
  const [selectedQuestionFilter, setSelectedQuestionFilter] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Quick Simulation for Live Testing on Projector
  const handleSimulateOneAttendee = () => {
    setIsSimulating(true);

    const randomScores: Record<string, number> = {};
    QUESTIONS.forEach((q) => {
      // Skew positive 4 or 5 mostly, with realistic variation
      const rand = Math.random();
      const val = rand > 0.45 ? 5 : rand > 0.15 ? 4 : rand > 0.05 ? 3 : 2;
      randomScores[q.id] = val;
    });

    const sampleFeedbacks = [
      'ประทับใจการอธิบายของวิทยากรมากครับ เข้าใจง่ายและเห็นภาพการนำไปใช้',
      'เวิร์กช็อปสนุก ได้ฝึกทำจริง อยากให้มีหลักสูตรภาคต่อเร็วๆ นี้ครับ',
      'เอกสารประกอบดีมาก กิจกรรมกลุ่มช่วยให้เข้าใจเนื้อหาได้ลึกซึ้งยิ่งขึ้น',
      'เนื้อหากระชับ ตรงจุด บรรยากาศเป็นกันเองมาก ขอบคุณทีมงานครับ',
      'อยากให้เพิ่มเวลาในการซักถามและแลกเปลี่ยนกับวิทยากรอีกนิดครับ',
      'นำเครื่องมือที่สอนไปประยุกต์ใช้กับงานที่บริษัทได้ทันทีในสัปดาห์นี้ครับ',
    ];

    const hasFeedback = Math.random() > 0.4;
    const randomFeedback = hasFeedback
      ? sampleFeedbacks[Math.floor(Math.random() * sampleFeedbacks.length)]
      : undefined;

    setTimeout(() => {
      addSurveyResponse(randomScores, randomFeedback);
      setIsSimulating(false);
    }, 250);
  };

  const handleResetData = () => {
    if (window.confirm('คุณต้องการล้างข้อมูลคำตอบทั้งหมดเพื่อเริ่มการอบรมรอบใหม่หรือไม่?')) {
      resetAllResponses();
    }
  };

  const handleSeedData = () => {
    seedSampleResponses();
  };

  const totalFeedbackCount = stats.feedbackList.length;
  const feedbackRate =
    stats.totalResponses > 0
      ? Math.round((totalFeedbackCount / stats.totalResponses) * 100)
      : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-6">

      {/* Top Banner / Projector Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Real-time Live Sync
            </span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              หน้าจอสำหรับฉายโปรเจกเตอร์
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            ผลการประเมินความพึงพอใจการอบรมสด (Live Dashboard)
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            ผลลัพธ์คำนวณและแสดงผลทันทีที่มีผู้เข้าร่วมอบรมส่งแบบสอบถามผ่านมือถือ
          </p>
        </div>

        {/* Toolbar Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          {/* QR Code Big Button */}
          <button
            onClick={onOpenQr}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-95 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm shadow-teal-600/20 transition-all"
          >
            <QrCode className="w-4 h-4" />
            <span>แสดง QR Code ขึ้นจอ</span>
          </button>

          {/* Export CSV Button */}
          <button
            onClick={() => exportResponsesToCSV(responses)}
            disabled={stats.totalResponses === 0}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all border border-slate-200/80 dark:border-slate-700/80"
          >
            <Download className="w-4 h-4" />
            <span>ดาวน์โหลด CSV</span>
          </button>

          {/* Simulate +1 Attendee */}
          <button
            onClick={handleSimulateOneAttendee}
            disabled={isSimulating}
            className="px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-teal-50 dark:hover:bg-teal-950/40 text-slate-700 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-400 text-xs font-medium border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-1.5"
            title="จำลองคำตอบ 1 คนเพื่อทดสอบการตอบสนองบนจอโปรเจกเตอร์"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>จำลอง +1 คน</span>
          </button>

          {/* Reset / Clear Data */}
          {stats.totalResponses > 0 ? (
            <button
              onClick={handleResetData}
              className="p-2.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              title="ล้างข้อมูลทั้งหมดเพื่อเริ่มรอบใหม่"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSeedData}
              className="px-3 py-2.5 rounded-xl text-teal-600 dark:text-teal-400 text-xs font-medium hover:bg-teal-50 dark:hover:bg-teal-950/40 transition-colors"
            >
              ใส่ข้อมูลตัวอย่าง
            </button>
          )}
        </div>
      </div>

      {/* 4 Giant KPI Cards for Projector View */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* KPI 1: Total Respondents */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">จำนวนผู้ตอบทั้งหมด</span>
            <Users className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums tracking-tight">
              {stats.totalResponses}
            </span>
            <span className="text-xs sm:text-sm text-slate-500 font-medium">คน</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-teal-600 dark:text-teal-400">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
            <span>อัปเดตอัตโนมัติแบบเรียลไทม์</span>
          </div>
        </div>

        {/* KPI 2: Overall Mean Score */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">คะแนนเฉลี่ยรวมทุกข้อ</span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-5xl font-extrabold text-teal-600 dark:text-teal-400 font-mono tabular-nums tracking-tight">
              {stats.overallAverage > 0 ? stats.overallAverage.toFixed(2) : '0.00'}
            </span>
            <span className="text-xs sm:text-sm text-slate-400 font-medium">/ 5.00</span>
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs text-amber-500">
            {'★'.repeat(Math.round(stats.overallAverage || 0))}
            {'☆'.repeat(5 - Math.round(stats.overallAverage || 0))}
            <span className="text-[11px] text-slate-400 ml-1">
              ({stats.overallAverage > 0 ? `${((stats.overallAverage / 5) * 100).toFixed(0)}%` : '0%'})
            </span>
          </div>
        </div>

        {/* KPI 3: Level Interpretation */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">ระดับความพึงพอใจ</span>
            <Award className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight pt-1">
            {stats.overallInterpretation}
          </div>
          <div className="mt-3 text-[11px] text-slate-500 dark:text-slate-400">
            เกณฑ์มาตรฐานสถิติ 5 ระดับ
          </div>
        </div>

        {/* KPI 4: Feedback Comments Count */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">ข้อเสนอแนะเพิ่มเติม</span>
            <MessageSquare className="w-4 h-4 text-sky-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums tracking-tight">
              {totalFeedbackCount}
            </span>
            <span className="text-xs sm:text-sm text-slate-500 font-medium">ข้อความ</span>
          </div>
          <div className="mt-3 text-[11px] text-slate-500 dark:text-slate-400">
            คิดเป็น {feedbackRate}% ของผู้ตอบ
          </div>
        </div>

      </div>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Question-by-Question Breakdown (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <span>คะแนนความพึงพอใจรายข้อ (สเกล 1-5)</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                เปรียบเทียบค่าเฉลี่ยและสัดส่วนคะแนนในแต่ละมิติของการจัดอบรม
              </p>
            </div>
          </div>

          {/* Question Bars */}
          <div className="space-y-5">
            {stats.questionStats.map((item, idx) => {
              const percentage = (item.average / 5) * 100;
              return (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-2.5 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 text-[11px] font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span className="text-[11px] font-semibold text-teal-600 dark:text-teal-400">
                          {item.category}
                        </span>
                      </div>
                      <h3 className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                        {item.title}
                      </h3>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-lg sm:text-xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                        {item.average > 0 ? item.average.toFixed(2) : '0.00'}
                        <span className="text-xs text-slate-400 font-normal ml-1">/ 5</span>
                      </div>
                      <span className={`text-[11px] font-semibold ${item.colorClass}`}>
                        {item.interpretation}
                      </span>
                    </div>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="w-full h-3 bg-slate-200 dark:bg-slate-700/60 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${item.average > 0 ? percentage : 0}%` }}
                    />
                  </div>

                  {/* Score Distribution Breakdown Mini-Pills */}
                  <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 pt-1">
                    <span className="font-medium">การกระจายคะแนน:</span>
                    <div className="flex items-center gap-1.5 sm:gap-2 font-mono">
                      {[5, 4, 3, 2, 1].map((s) => {
                        const count = item.distribution[s as 1 | 2 | 3 | 4 | 5] || 0;
                        return (
                          <span
                            key={s}
                            className={`px-1.5 py-0.5 rounded text-[10px] tabular-nums ${
                              count > 0
                                ? 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700'
                                : 'text-slate-400 dark:text-slate-600'
                            }`}
                          >
                            {s}★: <span className="font-bold">{count}</span>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Standard Interpretation Guide Footer Box */}
          <div className="p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200/60 dark:border-teal-800/60 text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
            <div className="font-semibold text-teal-800 dark:text-teal-300">
              เกณฑ์การแปลผลคะแนนเฉลี่ยความพึงพอใจ:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px]">
              <div>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">4.51 - 5.00</span>
                <span className="block text-slate-500 dark:text-slate-400">มากที่สุด</span>
              </div>
              <div>
                <span className="font-bold text-teal-600 dark:text-teal-400">3.51 - 4.50</span>
                <span className="block text-slate-500 dark:text-slate-400">มาก</span>
              </div>
              <div>
                <span className="font-bold text-amber-600 dark:text-amber-400">2.51 - 3.50</span>
                <span className="block text-slate-500 dark:text-slate-400">ปานกลาง</span>
              </div>
              <div>
                <span className="font-bold text-orange-600 dark:text-orange-400">1.51 - 2.50</span>
                <span className="block text-slate-500 dark:text-slate-400">น้อย</span>
              </div>
              <div>
                <span className="font-bold text-rose-600 dark:text-rose-400">1.00 - 1.50</span>
                <span className="block text-slate-500 dark:text-slate-400">น้อยที่สุด</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Score Distribution & Live Feedback Stream (5 cols) */}
        <div className="lg:col-span-5 space-y-6">

          {/* Overall Rating Distribution Histogram */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>สัดส่วนคะแนนทั้งหมด (1-5)</span>
              </h2>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                รวม {stats.totalResponses * 5} คำตอบ
              </span>
            </div>

            <div className="space-y-2.5">
              {[5, 4, 3, 2, 1].map((score) => {
                const count = stats.scoreDistribution[score as 1 | 2 | 3 | 4 | 5] || 0;
                const totalVotes = stats.totalResponses * 5 || 1;
                const pct = Math.round((count / totalVotes) * 100);
                const level = RATING_LEVELS.find((r) => r.score === score);

                return (
                  <div key={score} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <span>{level?.emoji}</span>
                        <span>ระดับ {score} ({level?.label})</span>
                      </span>
                      <span className="font-mono text-slate-600 dark:text-slate-400 tabular-nums">
                        {count} ครั้ง ({pct}%)
                      </span>
                    </div>

                    <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: level?.color || '#0d9488',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live Recent Feedback Stream */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  ข้อเสนอแนะล่าสุด
                </h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 border border-teal-200/60 dark:border-teal-800/60">
                  {stats.feedbackList.length}
                </span>
              </div>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>สด</span>
              </span>
            </div>

            {stats.feedbackList.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-700">
                <MessageSquare className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  ยังไม่มีข้อเสนอแนะเพิ่มเติมในขณะนี้
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  เมื่อมีผู้พิมพ์ความคิดเห็นในแบบสอบถาม ข้อความจะปรากฏที่นี่ทันที
                </p>
              </div>
            ) : (
              <div className="max-h-[380px] overflow-y-auto space-y-3 pr-1 scrollbar-thin">
                {stats.feedbackList.map((fb) => (
                  <div
                    key={fb.id}
                    className="p-3.5 rounded-2xl bg-slate-50/90 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-xs space-y-2 hover:border-teal-300 dark:hover:border-teal-700 transition-colors"
                  >
                    <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
                      "{fb.text}"
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 pt-1 border-t border-slate-200/50 dark:border-slate-700/50">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(fb.timestamp).toLocaleTimeString('th-TH')}</span>
                      </span>
                      <span className="font-mono text-teal-600 dark:text-teal-400 font-semibold">
                        ให้เฉลี่ย {fb.averageRating.toFixed(1)} ★
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
