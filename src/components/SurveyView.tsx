import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Send, RotateCcw, Sparkles, MessageSquare, ShieldCheck, ArrowRight } from 'lucide-react';
import { QUESTIONS, RATING_LEVELS } from '../types';
import { addSurveyResponse, hasDeviceSubmitted, setDeviceSubmitted } from '../services/storage';

interface SurveyViewProps {
  onSuccessSubmitted?: () => void;
  onGoToDashboard?: () => void;
}

export const SurveyView: React.FC<SurveyViewProps> = ({ onSuccessSubmitted, onGoToDashboard }) => {
  const [alreadySubmitted, setAlreadySubmitted] = useState<boolean>(() => hasDeviceSubmitted());
  const [scores, setScores] = useState<Record<string, number>>({
    q1: 0,
    q2: 0,
    q3: 0,
    q4: 0,
    q5: 0,
  });
  const [feedback, setFeedback] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [submittedSummary, setSubmittedSummary] = useState<{
    scores: Record<string, number>;
    feedback?: string;
  } | null>(null);

  const answeredCount = Object.values(scores).filter((v) => v > 0).length;
  const isComplete = answeredCount === QUESTIONS.length;

  const handleSelectScore = (questionId: string, value: number) => {
    setScores((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isComplete) {
      const firstUnanswered = QUESTIONS.find((q) => !scores[q.id]);
      if (firstUnanswered) {
        alert(`กรุณาตอบคำถาม: "${firstUnanswered.title}" ก่อนส่งครับ`);
      }
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate micro latency for good tactile feedback
      await new Promise((r) => setTimeout(r, 450));

      addSurveyResponse(scores, feedback);
      setAlreadySubmitted(true);
      setSubmittedSummary({ scores: { ...scores }, feedback });
      setShowSuccessModal(true);

      // Trigger Confetti Celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0d9488', '#0284c7', '#6366f1', '#10b981', '#f59e0b'],
        });
      } catch (err) {
        console.warn('Confetti error:', err);
      }

      if (onSuccessSubmitted) {
        onSuccessSubmitted();
      }
    } catch (err) {
      console.error('Failed to submit response:', err);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForTesting = () => {
    setDeviceSubmitted(false);
    setAlreadySubmitted(false);
    setShowSuccessModal(false);
    setScores({ q1: 0, q2: 0, q3: 0, q4: 0, q5: 0 });
    setFeedback('');
    setSubmittedSummary(null);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6 md:py-8 space-y-6">

      {/* Workshop Information Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden transition-colors">
        <div className="flex items-center gap-2 text-xs font-semibold text-teal-600 dark:text-teal-400 mb-2">
          <ShieldCheck className="w-4 h-4" />
          <span>แบบสำรวจแบบไม่ระบุตัวตน (Anonymous)</span>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2 leading-tight">
          แบบประเมินความพึงพอใจการอบรม
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          ความคิดเห็นของท่านมีคุณค่าอย่างยิ่งในการพัฒนาเนื้อหาและวิทยากรในรุ่นถัดไป
          โปรดเลือกคะแนนตามความพึงพอใจจริงของท่าน (1 = น้อยที่สุด, 5 = มากที่สุด)
        </p>

        {/* Progress Tracker */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              ความคืบหน้า:
            </span>
            <span className="text-xs font-bold text-teal-600 dark:text-teal-400 font-mono">
              {answeredCount} จาก {QUESTIONS.length} ข้อ
            </span>
          </div>

          <div className="w-36 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-600 dark:bg-teal-500 rounded-full transition-all duration-300"
              style={{ width: `${(answeredCount / QUESTIONS.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Already Submitted Warning Banner */}
      {alreadySubmitted && !showSuccessModal && (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-5 text-center">
          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-emerald-900 dark:text-emerald-200 mb-1">
            อุปกรณ์นี้ได้ส่งแบบประเมินแล้ว
          </h2>
          <p className="text-xs text-emerald-700 dark:text-emerald-400 mb-4 max-w-sm mx-auto">
            ระบบทำการล็อคไม่ให้ส่งซ้ำจากเครื่องเดิมเพื่อความแม่นยำของผลวิจัย ท่านสามารถดูคะแนนสดบนจอได้ทันที
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
            {onGoToDashboard && (
              <button
                type="button"
                onClick={onGoToDashboard}
                className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all"
              >
                <span>ดู Dashboard คะแนนสด</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="button"
              onClick={handleResetForTesting}
              className="w-full sm:w-auto px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5 transition-all"
            >
              <RotateCcw className="w-3 h-3" />
              <span>รีเซ็ตเพื่อทดสอบใหม่</span>
            </button>
          </div>
        </div>
      )}

      {/* Success Modal View */}
      {showSuccessModal && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-5 animate-in fade-in duration-300">
          <div className="w-16 h-16 bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <Sparkles className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-1.5">
              ส่งแบบประเมินเรียบร้อยแล้ว!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              ขอบคุณสำหรับความคิดเห็น ข้อมูลได้ถูกประมวลผลขึ้น Dashboard จอใหญ่แบบเรียลไทม์แล้ว
            </p>
          </div>

          {submittedSummary && (
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 text-left border border-slate-200/80 dark:border-slate-700/80 space-y-2 text-xs">
              <div className="font-semibold text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider mb-2">
                คะแนนที่คุณได้ให้:
              </div>
              {QUESTIONS.map((q) => {
                const s = submittedSummary.scores[q.id] || 0;
                const level = RATING_LEVELS.find((l) => l.score === s);
                return (
                  <div key={q.id} className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-700/40 last:border-0">
                    <span className="text-slate-700 dark:text-slate-300 truncate max-w-[70%]">
                      {q.title}
                    </span>
                    <span className="font-bold text-teal-700 dark:text-teal-400 shrink-0 flex items-center gap-1 font-mono">
                      <span>{level?.emoji}</span>
                      <span>{s} / 5</span>
                    </span>
                  </div>
                );
              })}
              {submittedSummary.feedback && (
                <div className="pt-2 mt-2 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 dark:text-slate-400">ข้อเสนอแนะ:</span>
                  <p className="italic text-slate-800 dark:text-slate-200 mt-1">
                    "{submittedSummary.feedback}"
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            {onGoToDashboard && (
              <button
                type="button"
                onClick={onGoToDashboard}
                className="w-full sm:w-auto px-6 py-3 bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-2"
              >
                <span>เปิดดูผลสรุปบน Dashboard จอสด</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={handleResetForTesting}
              className="w-full sm:w-auto px-4 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium text-xs rounded-xl transition-all"
            >
              ทดสอบส่งใหม่อีกครั้ง
            </button>
          </div>
        </div>
      )}

      {/* Main Form */}
      {(!alreadySubmitted || (!showSuccessModal && alreadySubmitted)) && (
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Question Cards 1 to 5 */}
          {QUESTIONS.map((question, index) => {
            const currentScore = scores[question.id] || 0;
            return (
              <div
                key={question.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs transition-colors"
              >
                {/* Question Header */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-7 h-7 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider block">
                      {question.category}
                    </span>
                    <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                      {question.title}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {question.description}
                    </p>
                  </div>
                </div>

                {/* Rating Scale Buttons (1-5) */}
                <div className="grid grid-cols-5 gap-1.5 sm:gap-2 pt-2">
                  {RATING_LEVELS.map((level) => {
                    const isSelected = currentScore === level.score;
                    return (
                      <button
                        key={level.score}
                        type="button"
                        onClick={() => handleSelectScore(question.id, level.score)}
                        className={`min-h-[58px] sm:min-h-[64px] flex flex-col items-center justify-center py-2 px-1 rounded-2xl border transition-all active:scale-95 ${
                          isSelected
                            ? 'bg-teal-600 dark:bg-teal-500 text-white border-teal-600 dark:border-teal-500 shadow-md shadow-teal-600/30 font-bold scale-[1.03]'
                            : 'bg-slate-50/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                        }`}
                        aria-pressed={isSelected}
                      >
                        <span className="text-xl sm:text-2xl mb-0.5 leading-none" role="img" aria-label={level.label}>
                          {level.emoji}
                        </span>
                        <span className="text-xs sm:text-sm font-extrabold leading-tight">
                          {level.score}
                        </span>
                        <span
                          className={`text-[9px] sm:text-[10px] truncate max-w-full font-medium ${
                            isSelected ? 'text-teal-100' : 'text-slate-400 dark:text-slate-500'
                          }`}
                        >
                          {level.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Feedback Section (Optional) */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <label htmlFor="feedback-input" className="text-sm font-bold text-slate-900 dark:text-white">
                ข้อเสนอแนะเพิ่มเติม
              </label>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-normal">
                (ไม่บังคับ)
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              สิ่งที่ท่านประทับใจ หรือข้อแนะนำเพื่อให้เราพัฒนาหลักสูตรและการจัดอบรมให้ดียิ่งขึ้น
            </p>
            <textarea
              id="feedback-input"
              rows={3}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="พิมพ์ข้อเสนอแนะหรือความคิดเห็นของท่านที่นี่..."
              className="w-full text-xs sm:text-sm p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none"
              maxLength={500}
            />
            <div className="text-right text-[10px] text-slate-400 mt-1">
              {feedback.length} / 500 ตัวอักษร
            </div>
          </div>

          {/* Submit Action CTA */}
          <div className="pt-2 sticky bottom-4 z-20">
            <button
              type="submit"
              disabled={isSubmitting || !isComplete}
              className={`w-full min-h-[50px] py-3.5 px-6 rounded-2xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                isComplete
                  ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-600/30'
                  : 'bg-slate-300 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>กำลังส่งแบบประเมิน...</span>
                </>
              ) : (
                <>
                  <span>
                    {isComplete
                      ? 'ส่งแบบประเมินความพึงพอใจ'
                      : `กรุณาตอบให้ครบ ${QUESTIONS.length} ข้อ (เหลืออีก ${QUESTIONS.length - answeredCount} ข้อ)`}
                  </span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

        </form>
      )}

      {/* Footer Note */}
      <footer className="text-center text-xs text-slate-400 dark:text-slate-500 pb-8">
        ข้อมูลถูกเข้ารหัสและส่งตรงไปยัง Realtime Dashboard ทันที
      </footer>

    </div>
  );
};
