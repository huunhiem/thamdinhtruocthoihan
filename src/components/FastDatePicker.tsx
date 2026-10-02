import React, { useState, useEffect, useRef } from 'react';
import { Calendar, ChevronDown, Clock, Zap } from 'lucide-react';

interface FastDatePickerProps {
  value: string; // YYYY-MM-DD
  onChange: (value: string) => void;
  label?: string;
  helperText?: string;
  className?: string;
  defaultYear?: number;
}

export const FastDatePicker: React.FC<FastDatePickerProps> = ({
  value,
  onChange,
  label,
  helperText,
  className = '',
  defaultYear = 2024,
}) => {
  // Chuyển YYYY-MM-DD thành DD/MM/YYYY để hiển thị
  const toDisplay = (isoStr: string): string => {
    if (!isoStr) return '';
    const parts = isoStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return isoStr;
  };

  // Chuyển DD/MM/YYYY thành YYYY-MM-DD
  const toISO = (d: number, m: number, y: number): string => {
    const dd = String(d).padStart(2, '0');
    const mm = String(m).padStart(2, '0');
    const yyyy = String(y);
    return `${yyyy}-${mm}-${dd}`;
  };

  const [textInput, setTextInput] = useState(toDisplay(value));
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Phân rã ngày hiện tại
  const parseCurrent = () => {
    if (value && value.includes('-')) {
      const parts = value.split('-');
      return {
        y: parseInt(parts[0], 10) || defaultYear,
        m: parseInt(parts[1], 10) || 7,
        d: parseInt(parts[2], 10) || 1,
      };
    }
    return { y: defaultYear, m: 7, d: 1 };
  };

  const { y: currentYear, m: currentMonth, d: currentDay } = parseCurrent();

  useEffect(() => {
    setTextInput(toDisplay(value));
  }, [value]);

  // Đóng popup khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpenPopup(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Xử lý khi người dùng gõ trực tiếp (hỗ trợ nhập nhanh: ví dụ 01072024 hoặc 01/07/2024)
  const handleTextChange = (raw: string) => {
    setTextInput(raw);

    // Chuẩn hóa: chấp nhận định dạng DD/MM/YYYY, DD-MM-YYYY, hoặc 8 chữ số liên tiếp DDMMYYYY
    let clean = raw.trim();
    if (/^\d{8}$/.test(clean)) {
      // 01072024 -> 01/07/2024
      clean = `${clean.slice(0, 2)}/${clean.slice(2, 4)}/${clean.slice(4)}`;
      setTextInput(clean);
    }

    const parts = clean.split(/[/.-]/);
    if (parts.length === 3) {
      const d = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10);
      let y = parseInt(parts[2], 10);
      if (parts[2].length === 2) {
        y = y < 50 ? 2000 + y : 1900 + y;
      }

      if (d >= 1 && d <= 31 && m >= 1 && m <= 12 && y >= 1970 && y <= 2050) {
        onChange(toISO(d, m, y));
      }
    }
  };

  // Chọn nhanh ngày
  const setQuickDay = (day: number) => {
    onChange(toISO(day, currentMonth, currentYear));
  };

  // Chọn nhanh tháng
  const setQuickMonth = (month: number) => {
    onChange(toISO(currentDay, month, currentYear));
  };

  // Chọn nhanh năm
  const setQuickYear = (year: number) => {
    onChange(toISO(currentDay, currentMonth, year));
  };

  // Chọn bộ ngày phổ biến (Preset) chỉ với 1 click
  const selectPreset = (d: number, m: number, y: number) => {
    onChange(toISO(d, m, y));
    setIsOpenPopup(false);
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-slate-700 font-bold mb-1 text-xs flex items-center justify-between">
          <span>{label}</span>
          <span className="text-[10px] text-slate-400 font-normal">Gõ DD/MM/YYYY hoặc chọn nhanh</span>
        </label>
      )}

      {/* Input box với nút mở bảng chọn siêu tốc */}
      <div className="relative flex items-center">
        <input
          type="text"
          value={textInput}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder="01/07/2024"
          className="w-full bg-white border border-slate-300 rounded-lg py-2 pl-3 pr-20 text-xs font-bold text-slate-800 focus:ring-1 focus:ring-red-600 focus:outline-none"
        />

        {/* Nút công cụ mở chọn nhanh */}
        <div className="absolute right-1 flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsOpenPopup(!isOpenPopup)}
            className="p-1.5 text-slate-500 hover:text-red-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer flex items-center gap-0.5 text-[11px] font-semibold"
            title="Mở bảng chọn nhanh Ngày - Tháng - Năm"
          >
            <Calendar className="w-4 h-4 text-red-600" />
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>
        </div>
      </div>

      {helperText && <span className="block text-[10px] text-slate-500 mt-1">{helperText}</span>}

      {/* POPUP CHỌN NGÀY SIÊU TỐC (CHỈ 1 CLICK) */}
      {isOpenPopup && (
        <div className="absolute left-0 mt-1 z-50 w-72 sm:w-80 bg-white border border-slate-300 rounded-xl shadow-xl p-3 text-xs space-y-3 animate-in fade-in zoom-in-95 duration-100">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="font-bold text-slate-800 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Chọn Siêu Tốc (1-Click)
            </span>
            <span className="font-mono text-red-700 font-bold bg-red-50 px-2 py-0.5 rounded text-[11px]">
              {toDisplay(value)}
            </span>
          </div>

          {/* 1. Các mốc ngày phổ biến nhất trong quyết định lương CCVC */}
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
              Mốc ngày thông dụng:
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { label: '01/07/2024', d: 1, m: 7, y: 2024 },
                { label: '01/05/2024', d: 1, m: 5, y: 2024 },
                { label: '02/04/2024', d: 2, m: 4, y: 2024 },
                { label: '15/09/2024', d: 15, m: 9, y: 2024 },
                { label: '15/02/2024', d: 15, m: 2, y: 2024 },
                { label: '05/08/2024', d: 5, m: 8, y: 2024 },
                { label: '01/01/2024', d: 1, m: 1, y: 2024 },
                { label: '30/06/2023', d: 30, m: 6, y: 2023 },
                { label: '01/10/2023', d: 1, m: 10, y: 2023 },
              ].map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => selectPreset(item.d, item.m, item.y)}
                  className="px-2 py-1 text-[11px] font-semibold bg-slate-50 hover:bg-red-50 hover:text-red-700 hover:border-red-200 border border-slate-200 rounded text-center transition-all cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Chọn Nhanh Năm */}
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Năm:</span>
            <div className="flex flex-wrap gap-1">
              {[2026, 2025, 2024, 2023, 2022, 2021, 2020].map((yr) => (
                <button
                  key={yr}
                  type="button"
                  onClick={() => setQuickYear(yr)}
                  className={`px-2 py-1 text-[11px] font-bold rounded border transition-all cursor-pointer ${
                    currentYear === yr
                      ? 'bg-red-700 text-white border-red-800'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {yr}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Chọn Nhanh Tháng */}
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Tháng:</span>
            <div className="grid grid-cols-6 gap-1">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((mo) => (
                <button
                  key={mo}
                  type="button"
                  onClick={() => setQuickMonth(mo)}
                  className={`py-1 text-[11px] font-semibold rounded border text-center transition-all cursor-pointer ${
                    currentMonth === mo
                      ? 'bg-red-700 text-white border-red-800'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Th.{mo}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Chọn Nhanh Ngày Thường Gặp */}
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
              Ngày phổ biến:
            </span>
            <div className="flex flex-wrap gap-1">
              {[1, 2, 5, 10, 15, 20, 25, 28, 30, 31].map((dy) => (
                <button
                  key={dy}
                  type="button"
                  onClick={() => setQuickDay(dy)}
                  className={`w-7 py-1 text-[11px] font-bold rounded border text-center transition-all cursor-pointer ${
                    currentDay === dy
                      ? 'bg-red-700 text-white border-red-800'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {dy}
                </button>
              ))}
            </div>
          </div>

          {/* Nút Đóng */}
          <div className="pt-2 border-t border-slate-100 flex justify-end">
            <button
              type="button"
              onClick={() => setIsOpenPopup(false)}
              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
            >
              Xong
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
