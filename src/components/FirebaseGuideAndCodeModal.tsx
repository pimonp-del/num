import React, { useState } from 'react';
import {
  Code2,
  FileCode,
  Download,
  Copy,
  Check,
  Flame,
  CheckCircle2,
  Globe,
  ExternalLink,
  ShieldAlert,
  Server,
  Layers,
} from 'lucide-react';

export const FirebaseGuideAndCodeModal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'survey' | 'dashboard' | 'guide'>('guide');
  const [copiedSurvey, setCopiedSurvey] = useState(false);
  const [copiedDashboard, setCopiedDashboard] = useState(false);
  const [copiedRules, setCopiedRules] = useState(false);

  // Standalone code strings
  const surveyCode = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>แบบประเมินความพึงพอใจการอบรม</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js"></script>
  <style>body { font-family: 'Prompt', sans-serif; -webkit-tap-highlight-color: transparent; }</style>
</head>
<body class="bg-slate-50 text-slate-800 min-h-screen pb-16 antialiased">
  <header class="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
    <div class="max-w-md mx-auto px-4 py-3.5 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-sm">TP</div>
        <div>
          <h1 class="text-sm font-bold text-slate-900 leading-tight">แบบประเมินการอบรม</h1>
          <p class="text-xs text-slate-500">ตอบแบบไม่ระบุชื่อ (Anonymous)</p>
        </div>
      </div>
      <div class="text-xs text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full font-medium" id="progress-indicator">
        ตอบแล้ว 0/5 ข้อ
      </div>
    </div>
  </header>

  <main class="max-w-md mx-auto px-4 py-5">
    <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs mb-5">
      <h2 class="text-base font-bold text-slate-900 mb-1">แบบประเมินความพึงพอใจการอบรม</h2>
      <p class="text-xs text-slate-600 leading-relaxed">
        โปรดให้คะแนนความพึงพอใจตามความเป็นจริง (1 = น้อยที่สุด, 5 = มากที่สุด)
      </p>
    </div>

    <div id="already-submitted-banner" class="hidden bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center mb-5">
      <h3 class="text-base font-bold text-emerald-900 mb-1">คุณได้ส่งแบบประเมินเรียบร้อยแล้ว</h3>
      <p class="text-xs text-emerald-700 mb-3">ขอบคุณสำหรับความคิดเห็นอันมีค่า ระบบได้บันทึกคะแนนขึ้น Dashboard แล้ว</p>
      <button type="button" onclick="resetSubmissionForTest()" class="text-xs text-emerald-800 underline font-medium">(ทดสอบ) ส่งใหม่อีกครั้ง</button>
    </div>

    <form id="survey-form" onsubmit="submitSurvey(event)" class="space-y-4">
      <!-- ข้อ 1 ถึง ข้อ 5: ดูไฟล์เต็มที่ /standalone/survey.html -->
      <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs" data-q="q1">
        <h3 class="text-sm font-semibold text-slate-900 mb-2">1. เนื้อหาการอบรมมีความชัดเจน ตรงตามเป้าหมาย และเป็นประโยชน์</h3>
        <div class="grid grid-cols-5 gap-1.5" data-question="q1">
          <button type="button" onclick="selectScore('q1', 1)" class="score-btn py-2.5 rounded-xl border border-slate-200 text-xs" data-val="1">😡 1</button>
          <button type="button" onclick="selectScore('q1', 2)" class="score-btn py-2.5 rounded-xl border border-slate-200 text-xs" data-val="2">🙁 2</button>
          <button type="button" onclick="selectScore('q1', 3)" class="score-btn py-2.5 rounded-xl border border-slate-200 text-xs" data-val="3">😐 3</button>
          <button type="button" onclick="selectScore('q1', 4)" class="score-btn py-2.5 rounded-xl border border-slate-200 text-xs" data-val="4">😊 4</button>
          <button type="button" onclick="selectScore('q1', 5)" class="score-btn py-2.5 rounded-xl border border-slate-200 text-xs" data-val="5">🤩 5</button>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs" data-q="q2">
        <h3 class="text-sm font-semibold text-slate-900 mb-2">2. วิทยากรมีความรู้ความเชี่ยวชาญ และสามารถถ่ายทอดได้เป็นอย่างดี</h3>
        <div class="grid grid-cols-5 gap-1.5" data-question="q2">
          <button type="button" onclick="selectScore('q2', 1)" class="score-btn py-2.5 rounded-xl border border-slate-200 text-xs" data-val="1">😡 1</button>
          <button type="button" onclick="selectScore('q2', 2)" class="score-btn py-2.5 rounded-xl border border-slate-200 text-xs" data-val="2">🙁 2</button>
          <button type="button" onclick="selectScore('q2', 3)" class="score-btn py-2.5 rounded-xl border border-slate-200 text-xs" data-val="3">😐 3</button>
          <button type="button" onclick="selectScore('q2', 4)" class="score-btn py-2.5 rounded-xl border border-slate-200 text-xs" data-val="4">😊 4</button>
          <button type="button" onclick="selectScore('q2', 5)" class="score-btn py-2.5 rounded-xl border border-slate-200 text-xs" data-val="5">🤩 5</button>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs" data-q="q3">
        <h3 class="text-sm font-semibold text-slate-900 mb-2">3. การจัดลำดับเวลาและกิจกรรมฝึกปฏิบัติมีความเหมาะสม</h3>
        <div class="grid grid-cols-5 gap-1.5" data-question="q3">
          <button type="button" onclick="selectScore('q3', 1)" class="score-btn py-2.5 rounded-xl border border-slate-200 text-xs" data-val="1">😡 1</button>
          <button type="button" onclick="selectScore('q3', 2)" class="score-btn py-2.5 rounded-xl border border-slate-200 text-xs" data-val="2">🙁 2</button>
          <button type="button" onclick="selectScore('q3', 3)" class="score-btn py-2.5 rounded-xl border border-slate-200 text-xs" data-val="3">😐 3</button>
          <button type="button" onclick="selectScore('q3', 4)" class="score-btn py-2.5 rounded-xl border border-slate-200 text-xs" data-val="4">😊 4</button>
          <button type="button" onclick="selectScore('q3', 5)" class="score-btn py-2.5 rounded-xl border border-slate-200 text-xs" data-val="5">🤩 5</button>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs" data-q="q4">
        <h3 class="text-sm font-semibold text-slate-900 mb-2">4. บรรยากาศ อุปกรณ์ และการอำนวยความสะดวกในการอบรม</h3>
        <div class="grid grid-cols-5 gap-1.5" data-question="q4">
          <button type="button" onclick="selectScore('q4', 1)" class="score-btn py-2.5 rounded-xl border border-slate-200 text-xs" data-val="1">😡 1</button>
          <button type="button" onclick="selectScore('q4', 2)" class="score-btn py-2.5 rounded-xl border border-slate-200 text-xs" data-val="2">🙁 2</button>
          <button type="button" onclick="selectScore('q4', 3)" class="score-btn py-2.5 rounded-xl border border-slate-200 text-xs" data-val="3">😐 3</button>
          <button type="button" onclick="selectScore('q4', 4)" class="score-btn py-2.5 rounded-xl border border-slate-200 text-xs" data-val="4">😊 4</button>
          <button type="button" onclick="selectScore('q4', 5)" class="score-btn py-2.5 rounded-xl border border-slate-200 text-xs" data-val="5">🤩 5</button>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs" data-q="q5">
        <h3 class="text-sm font-semibold text-slate-900 mb-2">5. ความพร้อมและความมั่นใจในการนำความรู้ไปประยุกต์ใช้จริง</h3>
        <div class="grid grid-cols-5 gap-1.5" data-question="q5">
          <button type="button" onclick="selectScore('q5', 1)" class="score-btn py-2.5 rounded-xl border border-slate-200 text-xs" data-val="1">😡 1</button>
          <button type="button" onclick="selectScore('q5', 2)" class="score-btn py-2.5 rounded-xl border border-slate-200 text-xs" data-val="2">🙁 2</button>
          <button type="button" onclick="selectScore('q5', 3)" class="score-btn py-2.5 rounded-xl border border-slate-200 text-xs" data-val="3">😐 3</button>
          <button type="button" onclick="selectScore('q5', 4)" class="score-btn py-2.5 rounded-xl border border-slate-200 text-xs" data-val="4">😊 4</button>
          <button type="button" onclick="selectScore('q5', 5)" class="score-btn py-2.5 rounded-xl border border-slate-200 text-xs" data-val="5">🤩 5</button>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
        <label for="feedback" class="block text-sm font-semibold text-slate-900 mb-1">ข้อเสนอแนะเพิ่มเติม (ไม่บังคับ)</label>
        <textarea id="feedback" rows="3" class="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none" placeholder="พิมพ์ข้อเสนอแนะของคุณที่นี่..."></textarea>
      </div>

      <button type="submit" id="submit-btn" class="w-full py-3.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm">
        ส่งแบบประเมินความพึงพอใจ
      </button>
    </form>
  </main>

  <script type="module">
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
    import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";

    // ⚙️ วาง Firebase Config ที่นี่:
    const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
      projectId: "YOUR_PROJECT_ID",
      appId: "YOUR_APP_ID"
    };

    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);

    const scores = { q1: 0, q2: 0, q3: 0, q4: 0, q5: 0 };

    window.selectScore = (qId, val) => {
      scores[qId] = val;
      const container = document.querySelector(\`[data-question="\${qId}"]\`);
      container.querySelectorAll('.score-btn').forEach(btn => {
        const bVal = parseInt(btn.getAttribute('data-val'));
        btn.className = bVal === val
          ? 'score-btn py-2.5 rounded-xl bg-teal-600 text-white font-bold text-xs ring-2 ring-teal-500'
          : 'score-btn py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs';
      });
      const answered = Object.values(scores).filter(v => v > 0).length;
      document.getElementById('progress-indicator').innerText = \`ตอบแล้ว \${answered}/5 ข้อ\`;
    };

    window.submitSurvey = async (e) => {
      e.preventDefault();
      if (Object.values(scores).some(v => v === 0)) {
        alert('กรุณาตอบแบบประเมินให้ครบทั้ง 5 ข้อครับ');
        return;
      }
      const feedback = document.getElementById('feedback').value.trim();
      await push(ref(db, 'responses'), {
        scores,
        feedback: feedback || null,
        timestamp: Date.now()
      });
      localStorage.setItem('training_survey_submitted_flag', 'true');
      alert('ส่งแบบประเมินเรียบร้อยแล้ว ขอบคุณครับ!');
      location.reload();
    };

    if (localStorage.getItem('training_survey_submitted_flag') === 'true') {
      document.getElementById('survey-form').classList.add('hidden');
      document.getElementById('already-submitted-banner').classList.remove('hidden');
    }
    window.resetSubmissionForTest = () => {
      localStorage.removeItem('training_survey_submitted_flag');
      location.reload();
    };
  </script>
</body>
</html>`;

  const dashboardCode = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Live Training Dashboard - ผลประเมินสด</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js"></script>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Prompt:wght@400;600;700&display=swap" rel="stylesheet">
  <style>body { font-family: 'Prompt', sans-serif; }</style>
</head>
<body class="bg-slate-900 text-slate-100 min-h-screen antialiased flex flex-col p-6">
  <header class="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
    <div>
      <h1 class="text-2xl font-bold text-white flex items-center gap-2">
        <span>ผลการประเมินความพึงพอใจการอบรมสด</span>
        <span class="px-2 py-0.5 text-xs bg-emerald-500/20 text-emerald-400 rounded-full">● Live Real-time</span>
      </h1>
      <p class="text-xs text-slate-400 mt-1">อัปเดตทันทีเมื่อมีผู้ส่งแบบประเมิน</p>
    </div>
    <div class="flex gap-2">
      <button onclick="downloadCSV()" class="px-4 py-2 bg-slate-800 border border-slate-700 text-xs rounded-xl">ส่งออก CSV</button>
      <button onclick="toggleFullScreen()" class="px-4 py-2 bg-teal-600 text-white text-xs rounded-xl">เต็มจอโปรเจกเตอร์</button>
    </div>
  </header>

  <div class="grid grid-cols-4 gap-4 mb-6">
    <div class="bg-slate-800/80 p-5 rounded-2xl border border-slate-700">
      <div class="text-xs text-slate-400">จำนวนผู้ตอบ</div>
      <div class="text-4xl font-extrabold text-white mt-1" id="stat-total">0</div>
    </div>
    <div class="bg-slate-800/80 p-5 rounded-2xl border border-slate-700">
      <div class="text-xs text-slate-400">คะแนนเฉลี่ยรวม</div>
      <div class="text-4xl font-extrabold text-teal-400 mt-1" id="stat-avg">0.00 / 5</div>
    </div>
    <div class="bg-slate-800/80 p-5 rounded-2xl border border-slate-700">
      <div class="text-xs text-slate-400">ระดับความพึงพอใจ</div>
      <div class="text-2xl font-bold text-white mt-1" id="stat-interp">-</div>
    </div>
    <div class="bg-slate-800/80 p-5 rounded-2xl border border-slate-700">
      <div class="text-xs text-slate-400">ข้อเสนอแนะ</div>
      <div class="text-4xl font-extrabold text-indigo-400 mt-1" id="stat-feedback">0</div>
    </div>
  </div>

  <div class="grid grid-cols-12 gap-6 flex-1">
    <div class="col-span-7 bg-slate-800/80 p-6 rounded-2xl border border-slate-700">
      <h2 class="text-base font-bold mb-4">ค่าเฉลี่ยรายข้อ (สเกล 1-5)</h2>
      <div class="h-72"><canvas id="barChart"></canvas></div>
    </div>
    <div class="col-span-5 bg-slate-800/80 p-6 rounded-2xl border border-slate-700 flex flex-col">
      <h2 class="text-base font-bold mb-3">ข้อเสนอแนะล่าสุด</h2>
      <div id="feedback-list" class="flex-1 overflow-y-auto space-y-2"></div>
    </div>
  </div>

  <script type="module">
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
    import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";

    // ⚙️ วาง Firebase Config ที่นี่:
    const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
      projectId: "YOUR_PROJECT_ID",
      appId: "YOUR_APP_ID"
    };

    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);
    let allResponses = [];

    const ctx = document.getElementById('barChart').getContext('2d');
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['1. เนื้อหา', '2. วิทยากร', '3. เวลา/กิจกรรม', '4. สถานที่/บริการ', '5. นำไปใช้จริง'],
        datasets: [{ label: 'คะแนนเฉลี่ย', data: [0,0,0,0,0], backgroundColor: '#14B8A6', borderRadius: 8 }]
      },
      options: { scales: { y: { min: 0, max: 5 } }, plugins: { legend: { display: false } } }
    });

    onValue(ref(db, 'responses'), (snapshot) => {
      const val = snapshot.val();
      allResponses = val ? Object.values(val) : [];
      render(allResponses);
    });

    function render(data) {
      document.getElementById('stat-total').innerText = data.length;
      if (data.length === 0) return;

      const qSums = [0, 0, 0, 0, 0];
      data.forEach(r => {
        ['q1','q2','q3','q4','q5'].forEach((k, i) => qSums[i] += (r.scores[k] || 0));
      });
      const qAvgs = qSums.map(s => (s / data.length));
      chart.data.datasets[0].data = qAvgs;
      chart.update();

      const overall = (qAvgs.reduce((a,b)=>a+b,0) / 5).toFixed(2);
      document.getElementById('stat-avg').innerText = overall + ' / 5';
      document.getElementById('stat-interp').innerText = overall >= 4.51 ? 'มากที่สุด' : overall >= 3.51 ? 'มาก' : 'ปานกลาง';

      const fbs = data.filter(r => r.feedback).reverse();
      document.getElementById('stat-feedback').innerText = fbs.length;
      document.getElementById('feedback-list').innerHTML = fbs.slice(0, 10).map(f =>
        \`<div class="p-3 bg-slate-900 rounded-xl text-xs text-slate-200">"\${f.feedback}"</div>\`
      ).join('');
    }

    window.toggleFullScreen = () => {
      if (!document.fullscreenElement) document.documentElement.requestFullscreen();
      else document.exitFullscreen();
    };
    window.downloadCSV = () => {
      const rows = allResponses.map((r, i) => [i+1, r.scores.q1, r.scores.q2, r.scores.q3, r.scores.q4, r.scores.q5, \`"\${r.feedback||''}"\`].join(','));
      const blob = new Blob(["\\uFEFFลำดับ,ข้อ1,ข้อ2,ข้อ3,ข้อ4,ข้อ5,ข้อเสนอแนะ\\r\\n" + rows.join("\\r\\n")], { type: 'text/csv;charset=utf-8;' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'ผลประเมิน.csv'; a.click();
    };
  </script>
</body>
</html>`;

  const securityRulesCode = `{
  "rules": {
    "responses": {
      ".read": true,
      ".write": true,
      "$response_id": {
        ".validate": "newData.hasChildren(['scores', 'timestamp'])"
      }
    }
  }
}`;

  const downloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = (text: string, type: 'survey' | 'dashboard' | 'rules') => {
    navigator.clipboard.writeText(text).then(() => {
      if (type === 'survey') {
        setCopiedSurvey(true);
        setTimeout(() => setCopiedSurvey(false), 2000);
      } else if (type === 'dashboard') {
        setCopiedDashboard(true);
        setTimeout(() => setCopiedDashboard(false), 2000);
      } else {
        setCopiedRules(true);
        setTimeout(() => setCopiedRules(false), 2000);
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-6">

      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex items-center gap-2 text-xs font-semibold text-teal-600 dark:text-teal-400 mb-2">
          <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span>Standalone Architecture &amp; Firebase Realtime Database</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-tight">
          โค้ดแยก 2 ไฟล์ &amp; วิธีตั้งค่า Firebase + Deploy ทีละขั้นตอน
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
          ตามที่ผู้ใช้ต้องการ: โค้ดถูกออกแบบแยกเป็น 2 ไฟล์อิสระ (HTML + JavaScript + Tailwind + Chart.js)
          สามารถนำไปเปิดในเครื่องหรือ Deploy ขึ้น Cloud Hosting ฟรีได้ทันทีโดยไม่ต้องติดตั้ง Node.js
        </p>

        {/* Tab Controls */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('guide')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'guide'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>1. วิธีตั้งค่า Firebase &amp; Deploy ทีละขั้น</span>
          </button>

          <button
            onClick={() => setActiveTab('survey')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'survey'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>2. โค้ดไฟล์ที่ 1: survey.html (หน้าตอบ)</span>
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'dashboard'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>3. โค้ดไฟล์ที่ 2: dashboard.html (จอแสดงผล)</span>
          </button>
        </div>
      </div>

      {/* Tab Content: Guide */}
      {activeTab === 'guide' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Step 1: Firebase Project */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 transition-colors">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 font-bold text-sm flex items-center justify-center shrink-0">
                1
              </span>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  สร้างโปรเจกต์ Firebase (ฟรี ไม่มีค่าใช้จ่าย)
                </h3>
                <p className="text-xs text-slate-500">Spark Plan ฟรีตลอดชีพ รองรับการอบรมขนาดใหญ่ได้สบาย</p>
              </div>
            </div>
            <ol className="list-decimal list-inside text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-2 pl-2 leading-relaxed">
              <li>
                เข้าไปที่เว็บไซต์{' '}
                <a
                  href="https://console.firebase.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-teal-600 dark:text-teal-400 font-medium underline inline-flex items-center gap-1"
                >
                  console.firebase.google.com <ExternalLink className="w-3 h-3" />
                </a>{' '}
                แล้วล็อกอินด้วย Google Account
              </li>
              <li>กดปุ่ม <strong>"Add project"</strong> (สร้างโปรเจกต์)</li>
              <li>ตั้งชื่อโปรเจกต์ เช่น <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">training-feedback-app</code></li>
              <li>กด <strong>Continue</strong> (Google Analytics สามารถเปิดหรือปิดก็ได้) แล้วกด <strong>Create project</strong></li>
            </ol>
          </div>

          {/* Step 2: Realtime Database Creation */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 transition-colors">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 font-bold text-sm flex items-center justify-center shrink-0">
                2
              </span>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  เปิดใช้งาน Firebase Realtime Database
                </h3>
                <p className="text-xs text-slate-500">ฐานข้อมูลที่อัปเดตแบบ WebSocket ทันทีไม่ต้องกดรีเฟรช</p>
              </div>
            </div>
            <ol className="list-decimal list-inside text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-2 pl-2 leading-relaxed">
              <li>ที่เมนูด้านซ้าย เลือก <strong>Build</strong> → คลิก <strong>Realtime Database</strong></li>
              <li>คลิกปุ่ม <strong>"Create Database"</strong></li>
              <li>เลือก Location: แนะนำ <strong>Singapore (asia-southeast1)</strong> เพื่อความเร็วสูงสุดในไทย</li>
              <li>ในหน้า Security Rules เลือก <strong>"Start in test mode"</strong> แล้วกด <strong>Enable</strong></li>
            </ol>
          </div>

          {/* Step 3: Security Rules */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 font-bold text-sm flex items-center justify-center shrink-0">
                  3
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    ตั้งค่า Security Rules (ให้อ่าน/เขียนได้โดยไม่ต้องล็อกอิน)
                  </h3>
                  <p className="text-xs text-slate-500">ตรงตามเงื่อนไข: ผู้เข้าอบรมตอบผ่านมือถือได้ทันที ไม่ต้องมีบัญชีผู้ใช้</p>
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(securityRulesCode, 'rules')}
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
              >
                {copiedRules ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedRules ? 'คัดลอกแล้ว!' : 'คัดลอก Rules'}</span>
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 pl-2">
              ไปที่แท็บ <strong>"Rules"</strong> ใน Realtime Database แล้ววางโค้ดด้านล่าง จากนั้นกดปุ่ม <strong>"Publish"</strong>:
            </p>

            <pre className="p-4 rounded-2xl bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto border border-slate-800">
              {securityRulesCode}
            </pre>
          </div>

          {/* Step 4: Get Firebase Config */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 transition-colors">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 font-bold text-sm flex items-center justify-center shrink-0">
                4
              </span>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  คัดลอก Firebase Config ไปวางในไฟล์
                </h3>
                <p className="text-xs text-slate-500">เชื่อมต่อโค้ด HTML เข้ากับ Database ของคุณ</p>
              </div>
            </div>
            <ol className="list-decimal list-inside text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-2 pl-2 leading-relaxed">
              <li>คลิกไอคอนรูปฟันเฟือง ⚙️ (Project settings) ที่มุมบนซ้าย</li>
              <li>เลื่อนลงมาที่ส่วน <strong>"Your apps"</strong> → คลิกไอคอนเว็บ <strong>&lt;/&gt;</strong> (Web)</li>
              <li>ตั้งชื่อแอป เช่น <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">training-web</code> แล้วกด <strong>Register app</strong></li>
              <li>
                คุณจะได้โค้ด <code className="font-mono text-teal-600 font-bold">firebaseConfig</code> ให้คัดลอกค่าต่างๆ มาแทนที่ใน <code className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">survey.html</code> และ <code className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">dashboard.html</code>
              </li>
            </ol>
          </div>

          {/* Step 5: How to Deploy */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 font-bold text-sm flex items-center justify-center shrink-0">
                5
              </span>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  วิธี Deploy ขึ้นใช้งานจริง (3 ทางเลือกฟรี 100%)
                </h3>
                <p className="text-xs text-slate-500">เลือกวิธีที่สะดวกที่สุดสำหรับคุณ</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              
              {/* Option A: Firebase Hosting */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-500" />
                  <span>ก. Firebase Hosting (แนะนำ)</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  รันคำสั่งเพียง 2 บรรทัด ได้ URL สวยงาม ปลอดภัย มี HTTPS ฟรี:
                </p>
                <div className="p-2.5 bg-slate-950 text-slate-300 rounded-xl font-mono text-[11px] space-y-1">
                  <div>npm install -g firebase-tools</div>
                  <div>firebase login</div>
                  <div>firebase init hosting</div>
                  <div>firebase deploy</div>
                </div>
              </div>

              {/* Option B: GitHub Pages */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <Globe className="w-4 h-4 text-teal-600" />
                  <span>ข. GitHub Pages (ฟรี)</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  สร้าง Repository บน GitHub แล้วอัปโหลด <code className="font-mono text-[11px]">survey.html</code> และ <code className="font-mono text-[11px]">dashboard.html</code> ขึ้นไป จากนั้นเปิด Settings → Pages
                </p>
              </div>

              {/* Option C: Netlify Drop / Vercel */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <Server className="w-4 h-4 text-indigo-500" />
                  <span>ค. Netlify Drop (ลากวางทันที)</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  ไปที่ <strong>app.netlify.com/drop</strong> นำโฟลเดอร์ที่มี 2 ไฟล์นี้ลากวางลงบนหน้าเว็บ ได้ลิงก์ออนไลน์ภายใน 5 วินาที!
                </p>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* Tab Content: Survey File */}
      {activeTab === 'survey' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 transition-colors animate-in fade-in duration-200">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileCode className="w-4 h-4 text-teal-600" />
                <span>ไฟล์ที่ 1: survey.html (หน้าแบบสอบถามสำหรับมือถือ)</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                โค้ดไฟล์เดี่ยว ทำงานได้สมบูรณ์ พร้อมระบบป้องกันการตอบซ้ำและเชื่อมต่อ Firebase
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => copyToClipboard(surveyCode, 'survey')}
                className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
              >
                {copiedSurvey ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSurvey ? 'คัดลอกแล้ว!' : 'คัดลอกโค้ด'}</span>
              </button>

              <button
                onClick={() => downloadFile('survey.html', surveyCode)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all border border-slate-200 dark:border-slate-700"
              >
                <Download className="w-3.5 h-3.5" />
                <span>ดาวน์โหลดไฟล์ survey.html</span>
              </button>
            </div>
          </div>

          <div className="relative">
            <pre className="max-h-[500px] overflow-y-auto p-4 rounded-2xl bg-slate-950 text-slate-200 font-mono text-xs leading-relaxed border border-slate-800 scrollbar-thin">
              {surveyCode}
            </pre>
          </div>
        </div>
      )}

      {/* Tab Content: Dashboard File */}
      {activeTab === 'dashboard' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 transition-colors animate-in fade-in duration-200">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-teal-600" />
                <span>ไฟล์ที่ 2: dashboard.html (หน้า Dashboard จอโปรเจกเตอร์)</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                กราฟ Chart.js + สถิติสด + ส่งออก CSV + เปิดเต็มจอ เหมาะขึ้นจอใหญ่
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => copyToClipboard(dashboardCode, 'dashboard')}
                className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
              >
                {copiedDashboard ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedDashboard ? 'คัดลอกแล้ว!' : 'คัดลอกโค้ด'}</span>
              </button>

              <button
                onClick={() => downloadFile('dashboard.html', dashboardCode)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all border border-slate-200 dark:border-slate-700"
              >
                <Download className="w-3.5 h-3.5" />
                <span>ดาวน์โหลดไฟล์ dashboard.html</span>
              </button>
            </div>
          </div>

          <div className="relative">
            <pre className="max-h-[500px] overflow-y-auto p-4 rounded-2xl bg-slate-950 text-slate-200 font-mono text-xs leading-relaxed border border-slate-800 scrollbar-thin">
              {dashboardCode}
            </pre>
          </div>
        </div>
      )}

    </div>
  );
};
