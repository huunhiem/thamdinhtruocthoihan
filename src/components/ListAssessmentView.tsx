import React, { useState } from 'react';
import { AppraisalRecord, AppraisalResult } from '../types/salary';
import {
  FileDown,
  Printer,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Upload,
  Search,
  Filter,
  FileSpreadsheet,
  Info,
  ChevronRight,
  Eye,
} from 'lucide-react';
import { exportAppraisalsToCSV, exportAppraisalsToExcelTable } from '../utils/exportUtils';
import { SAMPLE_TONG_HOP_DATA } from '../data/sampleData';

interface ListAssessmentViewProps {
  records: AppraisalRecord[];
  results: Map<string, AppraisalResult>;
  onUpdateRecord: (record: AppraisalRecord) => void;
  onDeleteRecord: (id: string) => void;
  onAddRecord: () => void;
  onResetToSample: () => void;
  onOpenImportModal: () => void;
  onOpenPrintModal: (mode: 'tong_hop' | 'mau_01') => void;
  onOpenDetailModal: (record: AppraisalRecord) => void;
  unitName: string;
  departmentName: string;
  reviewYear: number;
  reviewRound: number;
  totalPayrollCount: number;
}

export const ListAssessmentView: React.FC<ListAssessmentViewProps> = ({
  records,
  results,
  onUpdateRecord,
  onDeleteRecord,
  onAddRecord,
  onResetToSample,
  onOpenImportModal,
  onOpenPrintModal,
  onOpenDetailModal,
  unitName,
  departmentName,
  reviewYear,
  reviewRound,
  totalPayrollCount,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'eligible' | 'ineligible'>('all');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');

  // Danh sách các phòng ban/đơn vị duy nhất
  const departments = Array.from(new Set(records.map((r) => r.department).filter(Boolean)));

  // Thống kê
  const totalCount = records.length;
  let eligibleCount = 0;
  let ineligibleCount = 0;

  records.forEach((r) => {
    const res = results.get(r.id);
    if (res?.isEligible) {
      eligibleCount++;
    } else {
      ineligibleCount++;
    }
  });

  const maxAllowedQuota = Math.floor(totalPayrollCount / 10);
  const isOverQuota = totalPayrollCount > 0 && eligibleCount > maxAllowedQuota;

  // Lọc dữ liệu
  const filteredRecords = records.filter((rec) => {
    const res = results.get(rec.id);
    const matchesSearch =
      rec.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.gradeTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.gradeCode.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === 'all'
        ? true
        : filterStatus === 'eligible'
        ? res?.isEligible === true
        : res?.isEligible === false;

    const matchesDept = filterDepartment === 'all' || rec.department === filterDepartment;

    return matchesSearch && matchesStatus && matchesDept;
  });

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Thống kê Tổng quan & Chỉ tiêu 10% */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Tổng số đề nghị
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-slate-900">{totalCount}</span>
            <span className="text-xs text-slate-500">người trong danh sách</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-xs bg-emerald-50/20">
          <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Đủ điều kiện nâng TTH
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-emerald-700">{eligibleCount}</span>
            <span className="text-xs font-semibold text-emerald-600">
              {totalCount > 0 ? Math.round((eligibleCount / totalCount) * 100) : 0}% danh sách
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-rose-200 shadow-xs bg-rose-50/20">
          <span className="text-xs font-semibold text-rose-800 uppercase tracking-wider block flex items-center gap-1.5">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            Không đủ điều kiện
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-rose-700">{ineligibleCount}</span>
            <span className="text-xs font-semibold text-rose-600">
              {totalCount > 0 ? Math.round((ineligibleCount / totalCount) * 100) : 0}% danh sách
            </span>
          </div>
        </div>

        <div
          className={`p-4 rounded-xl border shadow-xs transition-all ${
            isOverQuota
              ? 'bg-rose-50 border-rose-300 text-rose-900'
              : 'bg-blue-50 border-blue-200 text-blue-900'
          }`}
        >
          <span className="text-xs font-semibold uppercase tracking-wider block flex items-center justify-between">
            <span>Tỷ lệ khống chế 10% (TT 08)</span>
            {isOverQuota && <span className="text-rose-700 font-bold">⚠️ VƯỢT QUY ĐỊNH!</span>}
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black">
              {eligibleCount} / {maxAllowedQuota}
            </span>
            <span className="text-xs opacity-90">
              Biên chế: {totalPayrollCount} người
            </span>
          </div>
          <span className="text-[11px] block mt-0.5 opacity-80">
            {isOverQuota
              ? `Vượt quá ${eligibleCount - maxAllowedQuota} chỉ tiêu cho phép`
              : `Còn ${Math.max(0, maxAllowedQuota - eligibleCount)} chỉ tiêu có thể xét thêm`}
          </span>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        {/* Tiêu đề & Action Bar */}
        <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>{unitName || 'UBND XÃ PHÚ HỒ'}</span>
              <span className="text-slate-400 font-normal">/</span>
              <span className="text-red-700">{departmentName || 'PHÒNG VĂN HÓA - XÃ HỘI'}</span>
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              DANH SÁCH ĐỀ NGHỊ NÂNG LƯƠNG TRƯỚC THỜI HẠN, ĐỢT {reviewRound} NĂM {reviewYear}
            </p>
          </div>

          {/* Các nút công cụ chính */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onResetToSample}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
              title="Khôi phục lại danh sách 11 người mẫu trong file TONG HOP_TTH.pdf"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Nạp mẫu TONG HOP (11 người)</span>
            </button>

            <button
              onClick={onOpenImportModal}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
              title="Nhập danh sách từ file hoặc dán trực tiếp từ Excel"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Nhập / Dán từ Excel</span>
            </button>

            <button
              onClick={onAddRecord}
              className="px-3 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm cán bộ mới</span>
            </button>

            {/* Dropdown Xuất file & In ấn */}
            <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
              <button
                onClick={() =>
                  exportAppraisalsToExcelTable(
                    records,
                    results,
                    unitName,
                    departmentName,
                    reviewYear,
                    reviewRound
                  )
                }
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all"
                title="Xuất bảng tổng hợp ra file Excel (.xls) giữ nguyên cấu trúc bảng"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Xuất Excel</span>
              </button>

              <button
                onClick={() =>
                  exportAppraisalsToCSV(
                    records,
                    results,
                    unitName,
                    departmentName,
                    reviewYear,
                    reviewRound
                  )
                }
                className="px-3 py-1.5 bg-slate-700 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all"
                title="Xuất tệp CSV UTF-8 tiếng Việt"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>CSV</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenPrintModal('tong_hop')}
                className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                title="Mở bản in hoặc lưu PDF theo mẫu TONG HOP_TTH"
              >
                <Printer className="w-4 h-4" />
                <span>In / Xuất PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-3.5 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            {/* Search Input */}
            <div className="relative min-w-[240px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm theo tên, ngạch, đơn vị..."
                className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-red-600"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1">
              <span className="text-slate-500 font-medium">Trạng thái:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-800 font-medium"
              >
                <option value="all">Tất cả ({records.length})</option>
                <option value="eligible">Đủ điều kiện ({eligibleCount})</option>
                <option value="ineligible">Không đủ điều kiện ({ineligibleCount})</option>
              </select>
            </div>

            {/* Department Filter */}
            {departments.length > 1 && (
              <div className="flex items-center gap-1">
                <span className="text-slate-500 font-medium">Đơn vị:</span>
                <select
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  className="border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-800 font-medium max-w-[200px]"
                >
                  <option value="all">Tất cả đơn vị</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="text-slate-500 text-xs font-medium">
            Hiển thị <span className="font-bold text-slate-800">{filteredRecords.length}</span> /{' '}
            {records.length} hồ sơ
          </div>
        </div>

        {/* The Exact Table matching TONG HOP_TTH.pdf */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              {/* Header cấp 1 */}
              <tr className="bg-slate-100 text-slate-800 border-b border-slate-300 text-center font-bold">
                <th rowSpan={2} className="p-2 border-r border-slate-300 w-10">
                  TT
                </th>
                <th rowSpan={2} className="p-2 border-r border-slate-300 w-12">
                  Ông/<br />Bà
                </th>
                <th rowSpan={2} className="p-2 border-r border-slate-300 min-w-[140px] text-left">
                  Họ và tên
                </th>
                <th colSpan={2} className="p-1 border-r border-slate-300 w-14">
                  Giới tính
                </th>
                <th rowSpan={2} className="p-2 border-r border-slate-300 min-w-[100px]">
                  Chức vụ
                </th>
                <th rowSpan={2} className="p-2 border-r border-slate-300 min-w-[140px]">
                  Đơn vị công tác
                </th>
                <th rowSpan={2} className="p-2 border-r border-slate-300 min-w-[150px]">
                  Tên ngạch
                </th>
                <th rowSpan={2} className="p-2 border-r border-slate-300 min-w-[90px]">
                  Mã số ngạch/<br />CDNN
                </th>
                <th colSpan={3} className="p-1 border-r border-slate-300 bg-slate-200/70">
                  Ngạch, bậc, hệ số lương đang hưởng
                </th>
                <th colSpan={4} className="p-1 border-r border-slate-300 bg-red-100/70 text-red-950">
                  Kết quả đề nghị nâng bậc lương
                </th>
                <th rowSpan={2} className="p-2 border-r border-slate-300 min-w-[130px]">
                  Thành tích đạt được
                </th>
                <th rowSpan={2} className="p-2 border-r border-slate-300 min-w-[105px] whitespace-nowrap">
                  Ngày ký QĐ<br />thành tích
                </th>
                <th rowSpan={2} className="p-2 border-r border-slate-300 min-w-[130px] bg-slate-200/50">
                  Kết quả thẩm định
                </th>
                <th rowSpan={2} className="p-2 w-20 text-center">
                  Thao tác
                </th>
              </tr>

              {/* Header cấp 2 */}
              <tr className="bg-slate-100 text-slate-800 border-b border-slate-300 text-center font-semibold text-[11px]">
                <th className="p-1.5 border-r border-slate-300 w-7">Nam</th>
                <th className="p-1.5 border-r border-slate-300 w-7">Nữ</th>
                
                {/* Lương đang hưởng */}
                <th className="p-1.5 border-r border-slate-300 w-10 bg-slate-200/50">Bậc</th>
                <th className="p-1.5 border-r border-slate-300 w-14 bg-slate-200/50">Hệ số</th>
                <th className="p-1.5 border-r border-slate-300 w-24 bg-slate-200/50">
                  Ngày hưởng
                </th>

                {/* Đề nghị sau nâng TTH */}
                <th className="p-1.5 border-r border-slate-300 w-10 bg-red-50 text-red-900 font-bold">
                  Bậc
                </th>
                <th className="p-1.5 border-r border-slate-300 w-14 bg-red-50 text-red-900 font-bold">
                  Hệ số
                </th>
                <th className="p-1.5 border-r border-slate-300 w-24 bg-red-50 text-red-900 font-bold">
                  Ngày hưởng
                </th>
                <th className="p-1.5 border-r border-slate-300 w-16 bg-red-50 text-red-900">
                  Số tháng TTH
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={19} className="p-8 text-center text-slate-500">
                    Không tìm thấy hồ sơ nào phù hợp với điều kiện tìm kiếm.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec, index) => {
                  const res = results.get(rec.id);
                  const isEligible = res ? res.isEligible : false;
                  const lastPromoDateFormatted = rec.lastPromotionDate
                    ? rec.lastPromotionDate.split('-').reverse().join('/')
                    : '';
                  const decisionDateFormatted = rec.achievementDecisionDate
                    ? (rec.achievementDecisionDate.includes('-')
                        ? rec.achievementDecisionDate.split('-').reverse().join('/')
                        : rec.achievementDecisionDate)
                    : '';

                  return (
                    <tr
                      key={rec.id}
                      className={`hover:bg-slate-50 transition-colors ${
                        !isEligible ? 'bg-rose-50/20' : ''
                      }`}
                    >
                      {/* 1. STT */}
                      <td className="p-2 border-r border-slate-200 text-center font-medium text-slate-600">
                        {rec.orderNumber || index + 1}
                      </td>

                      {/* 2. Ông/Bà */}
                      <td className="p-2 border-r border-slate-200 text-center text-slate-700">
                        {rec.salutation || (rec.gender === 'Nam' ? 'Ông' : 'Bà')}
                      </td>

                      {/* 3. Họ và tên */}
                      <td className="p-2 border-r border-slate-200 font-bold text-slate-900">
                        <button
                          onClick={() => onOpenDetailModal(rec)}
                          className="hover:text-red-700 hover:underline text-left"
                          title="Bấm để xem chi tiết đối chiếu 6 tiêu chuẩn thẩm định"
                        >
                          {rec.fullName}
                        </button>
                      </td>

                      {/* 4. Giới tính Nam */}
                      <td className="p-2 border-r border-slate-200 text-center font-bold text-slate-700">
                        {rec.gender === 'Nam' ? 'x' : ''}
                      </td>

                      {/* 5. Giới tính Nữ */}
                      <td className="p-2 border-r border-slate-200 text-center font-bold text-slate-700">
                        {rec.gender === 'Nữ' ? 'x' : ''}
                      </td>

                      {/* 6. Chức vụ */}
                      <td className="p-2 border-r border-slate-200 text-slate-800">
                        {rec.position}
                      </td>

                      {/* 7. Đơn vị công tác */}
                      <td className="p-2 border-r border-slate-200 text-slate-700">
                        {rec.department}
                      </td>

                      {/* 8. Tên ngạch */}
                      <td className="p-2 border-r border-slate-200 text-slate-800">
                        {rec.gradeTitle}
                      </td>

                      {/* 9. Mã số ngạch / CDNN */}
                      <td className="p-2 border-r border-slate-200 text-center font-mono font-medium text-slate-700">
                        {rec.gradeCode}
                      </td>

                      {/* 10. Bậc hiện hưởng */}
                      <td className="p-2 border-r border-slate-200 text-center font-semibold text-slate-800 bg-slate-50">
                        {rec.currentStep}
                      </td>

                      {/* 11. Hệ số hiện hưởng */}
                      <td className="p-2 border-r border-slate-200 text-right font-mono font-semibold text-slate-800 bg-slate-50 pr-3">
                        {rec.currentCoefficient.toFixed(2)}
                      </td>

                      {/* 12. Ngày hưởng gần nhất */}
                      <td className="p-2 border-r border-slate-200 text-center font-mono text-slate-700 bg-slate-50">
                        {lastPromoDateFormatted}
                      </td>

                      {/* 13. Bậc sau nâng */}
                      <td className="p-2 border-r border-slate-200 text-center font-bold text-red-700 bg-red-50/40">
                        {res ? res.newStep : ''}
                      </td>

                      {/* 14. Hệ số sau nâng */}
                      <td className="p-2 border-r border-slate-200 text-right font-mono font-bold text-red-700 bg-red-50/40 pr-3">
                        {res ? res.newCoefficient.toFixed(2) : ''}
                      </td>

                      {/* 15. Ngày hưởng sau nâng */}
                      <td className="p-2 border-r border-slate-200 text-center font-mono font-bold text-red-700 bg-red-50/40">
                        {res ? res.newEffectiveDate : ''}
                      </td>

                      {/* 16. Số tháng nâng TTH */}
                      <td className="p-2 border-r border-slate-200 text-center font-semibold text-slate-800 bg-red-50/40">
                        {rec.requestedMonths || 9}
                      </td>

                      {/* 17. Thành tích đạt được */}
                      <td className="p-2 border-r border-slate-200 text-slate-800 font-medium">
                        {rec.achievementTitle || 'CSTĐCS'}
                      </td>

                      {/* 18. Ngày ký QĐ thành tích */}
                      <td className="p-2 border-r border-slate-200 text-center font-mono text-slate-700 whitespace-nowrap">
                        {decisionDateFormatted || '-'}
                      </td>

                      {/* 19. Trạng thái Thẩm định */}
                      <td className="p-2 border-r border-slate-200">
                        <div className="flex items-center gap-1.5">
                          {isEligible ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              ĐỦ ĐIỀU KIỆN
                            </span>
                          ) : (
                            <span
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300 cursor-pointer"
                              onClick={() => onOpenDetailModal(rec)}
                              title={res?.summaryReason}
                            >
                              <XCircle className="w-3 h-3 text-rose-600" />
                              KHÔNG ĐẠT
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 19. Thao tác */}
                      <td className="p-2 text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <button
                            type="button"
                            onClick={() => onOpenDetailModal(rec)}
                            className="p-1.5 text-blue-700 hover:text-blue-900 hover:bg-blue-100 rounded-md transition-colors cursor-pointer"
                            title="Xem chi tiết & Sửa hồ sơ"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteRecord(rec.id)}
                            className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-100 rounded-md transition-colors cursor-pointer"
                            title="Xóa hồ sơ này"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer tổng kết danh sách */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <div className="font-semibold">
            Tổng số danh sách gồm{' '}
            <span className="text-red-700 font-bold">{records.length}</span> người. (Trong đó đủ
            điều kiện: <span className="text-emerald-700 font-bold">{eligibleCount}</span> người,
            không đủ điều kiện: <span className="text-rose-700 font-bold">{ineligibleCount}</span>{' '}
            người).
          </div>
          <div className="text-slate-500 italic">
            Căn cứ quy định tại Thông tư 08/2013/TT-BNV, Thông tư 03/2021/TT-BNV và Nghị định số
            204/2004/NĐ-CP.
          </div>
        </div>
      </div>
    </div>
  );
};
