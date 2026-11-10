import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { X, Copy, Check, Download, ExternalLink, Smartphone } from 'lucide-react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  surveyUrl: string;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  surveyUrl,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = useState(false);
  const [customUrl, setCustomUrl] = useState('');

  const targetUrl = customUrl.trim() || surveyUrl;

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        targetUrl,
        {
          width: 260,
          margin: 1.5,
          color: {
            dark: '#0f172a',
            light: '#ffffff',
          },
        },
        (error) => {
          if (error) console.error('QR code generation error:', error);
        }
      );
    }
  }, [isOpen, targetUrl]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(targetUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownloadPng = () => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `QRCode_ประเมินการอบรม.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 text-center shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-800 flex items-center justify-center mx-auto mb-3">
          <Smartphone className="w-5 h-5" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
          สแกน QR Code เพื่อตอบแบบประเมิน
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
          ผู้เข้าอบรมสามารถเปิดกล้องมือถือสแกนเพื่อร่วมประเมินได้ทันที ไม่ต้องล็อกอิน
        </p>

        {/* QR Code Canvas Frame */}
        <div className="bg-white p-3.5 rounded-2xl inline-block border border-slate-200 shadow-md mx-auto mb-4">
          <canvas ref={canvasRef} className="block mx-auto rounded-lg" />
        </div>

        {/* URL Display */}
        <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-700 dark:text-slate-300 font-mono truncate mb-4 select-all">
          {targetUrl}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5 mb-3">
          <button
            onClick={handleCopy}
            className="w-full py-2.5 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-95 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm shadow-teal-600/20"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-200" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'คัดลอกแล้ว!' : 'คัดลอกลิงก์'}</span>
          </button>

          <button
            onClick={handleDownloadPng}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border border-slate-200 dark:border-slate-700"
          >
            <Download className="w-4 h-4" />
            <span>โหลดภาพ PNG</span>
          </button>
        </div>

        <button
          onClick={onClose}
          className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 pt-1"
        >
          ปิดหน้าต่าง
        </button>

      </div>
    </div>
  );
};
