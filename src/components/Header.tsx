import React from 'react';
import { BookOpen, FileCheck, FileSpreadsheet, Users, HelpCircle } from 'lucide-react';

interface HeaderProps {
  activeTab: 'list' | 'single' | 'regulations';
  setActiveTab: (tab: 'list' | 'single' | 'regulations') => void;
  unitName: string;
  setUnitName: (name: string) => void;
  departmentName: string;
  setDepartmentName: (name: string) => void;
  reviewYear: number;
  setReviewYear: (year: number) => void;
  reviewRound: number;
  setReviewRound: (round: number) => void;
  totalPayrollCount: number;
  setTotalPayrollCount: (count: number) => void;
  eligibleCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  unitName,
  setUnitName,
  departmentName,
  setDepartmentName,
  reviewYear,
  setReviewYear,
  reviewRound,
  setReviewRound,
  totalPayrollCount,
  setTotalPayrollCount,
  eligibleCount,
}) => {
  const maxQuota = Math.floor(totalPayrollCount / 10);
  const isOverQuota = totalPayrollCount > 0 && eligibleCount > maxQuota;

  return (
    <header className="bg-white border-b border-slate-200 shadow-xs sticky top-0 z-30">
      {/* Top Banner: Tiêu đề hệ thống & Căn cứ pháp lý */}
      <div className="bg-red-800 text-white px-4 py-2 text-xs flex flex-wrap justify-between items-center border-b border-red-900">
        <div className="flex items-center space-x-2.5 font-bold tracking-wide">
          <img
            src="/logo.png"
            alt="Logo UBND Xã Phú Hồ"
            onError={(e) => {
              const target = e.currentTarget;
              if (target.src.endsWith('/logo.png')) {
                target.src = '/logo.svg';
              }
            }}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-contain shrink-0 shadow-xs border border-white/60 bg-white"
          />
          <span className="text-xs sm:text-sm font-bold">Hệ thống thẩm định nâng bậc lương trước thời hạn CCVC - LÊ HỮU NHIỆM</span>
        </div>
        <div className="flex items-center space-x-4 text-red-100 text-xs">
          <span>Căn cứ: TT 08/2013, TT 03/2021 & NĐ 204/2004</span>
        </div>
      </div>

      {/* Main Title & Settings Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="bg-red-100 p-2 rounded-lg text-red-800">
                <FileCheck className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  Thẩm Định Nâng Lương Trước Thời Hạn
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-200">
                    NĐ 204 & TT 08/03
                  </span>
                </h1>
                <p className="text-xs text-slate-500">
                  Dành cho Cán bộ, Công chức, Viên chức đạt thành tích xuất sắc
                </p>
              </div>
            </div>
          </div>

          {/* Quick Context Settings */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 bg-slate-50 p-2 rounded-xl border border-slate-200 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Đơn vị:</span>
              <input
                type="text"
                value={departmentName}
                onChange={(e) => setDepartmentName(e.target.value)}
                placeholder="PHÒNG VĂN HÓA - XÃ HỘI"
                className="bg-white border border-slate-300 rounded px-2.5 py-1 text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-red-600 w-48 sm:w-56"
                title="Nhập thông tin đơn vị để thay đổi vị trí PHÒNG VĂN HÓA - XÃ HỘI"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Đợt xét:</span>
              <select
                value={reviewRound}
                onChange={(e) => setReviewRound(Number(e.target.value))}
                className="bg-white border border-slate-300 rounded px-2 py-1 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-red-600 cursor-pointer"
              >
                <option value={1}>Đợt 1</option>
                <option value={2}>Đợt 2</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Năm:</span>
              <input
                type="number"
                value={reviewYear}
                onChange={(e) => setReviewYear(Number(e.target.value))}
                className="bg-white border border-slate-300 rounded px-2 py-1 text-slate-800 font-bold focus:outline-none focus:ring-1 focus:ring-red-600 w-20 text-center"
              />
            </div>

            {/* Quota 10% Calculator indicator */}
            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
              <span className="text-slate-500 font-medium" title="Tổng số CCVC hưởng lương của đơn vị để tính tỷ lệ 10%">
                Biên chế:
              </span>
              <input
                type="number"
                min={0}
                value={totalPayrollCount}
                onChange={(e) => setTotalPayrollCount(Math.max(0, Number(e.target.value)))}
                className="bg-white border border-slate-300 rounded px-1.5 py-1 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-red-600 w-16 text-center"
                title="Tổng biên chế trả lương của cơ quan (cứ 10 người được 01 chỉ tiêu nâng TTH)"
              />
              <div
                className={`px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 ${
                  isOverQuota
                    ? 'bg-rose-100 text-rose-800 border border-rose-300'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                }`}
                title={`Chỉ tiêu 10%: ${maxQuota} người. Hiện có ${eligibleCount} người đủ điều kiện.`}
              >
                <span>Chỉ tiêu:</span>
                <span>
                  {eligibleCount}/{maxQuota} người
                </span>
                {isOverQuota && <span className="text-rose-600 font-bold">⚠️ Vượt!</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-1 mt-3 border-t border-slate-100 pt-2">
          <button
            onClick={() => setActiveTab('list')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'list'
                ? 'bg-red-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Thẩm định danh sách (Mẫu TỔNG HỢP TTH)</span>
          </button>

          <button
            onClick={() => setActiveTab('single')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'single'
                ? 'bg-red-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Thẩm định từng cá nhân (Kiểm tra nhanh)</span>
          </button>

          <button
            onClick={() => setActiveTab('regulations')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'regulations'
                ? 'bg-red-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Tra cứu Quy định TT 08/03 & Bảng lương</span>
          </button>
        </div>
      </div>
    </header>
  );
};
