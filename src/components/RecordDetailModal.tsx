import React, { useState, useEffect } from 'react';
import { AppraisalRecord } from '../types/salary';
import { evaluateAppraisal } from '../utils/salaryCalculator';
import {
  SALARY_GRADES,
  findSalaryGrade,
  findStepByCoefficient,
  determineCycleMonthsByCoefficient,
} from '../data/salaryScales';
import {
  X,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Save,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { FastDatePicker } from './FastDatePicker';

interface RecordDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: AppraisalRecord | null;
  onSave: (record: AppraisalRecord) => void;
  reviewYear: number;
}

export const RecordDetailModal: React.FC<RecordDetailModalProps> = ({
  isOpen,
  onClose,
  record,
  onSave,
  reviewYear,
}) => {
  if (!isOpen || !record) return null;

  const [formData, setFormData] = useState<AppraisalRecord>({ ...record, reviewYear });
  const [autoDeduceMsg, setAutoDeduceMsg] = useState('');

  useEffect(() => {
    setFormData({ ...record, reviewYear });
    setAutoDeduceMsg('');
  }, [record, reviewYear]);

  const result = evaluateAppraisal(formData);

  // Tự động xác định chu kỳ giữ bậc theo Thông tư 08 và hệ số lương
  const cycleInfo = determineCycleMonthsByCoefficient(
    formData.gradeCode || formData.gradeTitle,
    formData.currentCoefficient
  );

  // 1. NGƯỜI DÙNG NHẬP NGẠCH / CDNN (KHÔNG BẮT BUỘC CHỌN)
  const handleGradeTitleInput = (typedTitle: string) => {
    const found = findSalaryGrade(typedTitle);
    setFormData((prev) => {
      const updated = {
        ...prev,
        gradeTitle: typedTitle,
        gradeCode: found ? found.code : prev.gradeCode,
        regularCycleMonths: found ? found.regularCycleMonths : prev.regularCycleMonths,
      };

      // Tự động sinh lại bậc lương theo hệ số nếu có
      if (prev.currentCoefficient > 0) {
        const detected = findStepByCoefficient(
          found ? found.code : typedTitle,
          prev.currentCoefficient
        );
        updated.currentStep = detected.step;
        setAutoDeduceMsg(`Tự động sinh Bậc ${detected.step} (${prev.currentCoefficient})`);
      }

      return updated;
    });
  };

  const handleGradeCodeInput = (typedCode: string) => {
    const found = findSalaryGrade(typedCode);
    setFormData((prev) => {
      const updated = {
        ...prev,
        gradeCode: typedCode,
        gradeTitle: found ? found.name : prev.gradeTitle,
        regularCycleMonths: found ? found.regularCycleMonths : prev.regularCycleMonths,
      };

      if (prev.currentCoefficient > 0) {
        const detected = findStepByCoefficient(
          typedCode,
          prev.currentCoefficient
        );
        updated.currentStep = detected.step;
        setAutoDeduceMsg(`Tự động sinh Bậc ${detected.step} (${prev.currentCoefficient})`);
      }

      return updated;
    });
  };

  // 2. NGƯỜI DÙNG NHẬP HỆ SỐ LƯƠNG -> HỆ THỐNG TỰ SINH RA BẬC LƯƠNG
  const handleCoefficientChange = (valStr: string) => {
    const coeff = parseFloat(valStr.replace(',', '.'));
    const validCoeff = isNaN(coeff) ? 0 : coeff;

    if (validCoeff > 0) {
      const searchTarget = formData.gradeCode || formData.gradeTitle;
      const detected = findStepByCoefficient(searchTarget, validCoeff);
      
      setFormData((prev) => ({
        ...prev,
        currentCoefficient: validCoeff,
        currentStep: detected.step,
      }));
      const scaleLabel = detected.scaleName ? ` (${detected.scaleName})` : '';
      setAutoDeduceMsg(`Tự sinh Bậc ${detected.step}${scaleLabel} theo NĐ 204 (Hệ số ${validCoeff})`);
    } else {
      setFormData((prev) => ({
        ...prev,
        currentCoefficient: 0,
      }));
    }
  };

  const handleStepChange = (step: number) => {
    setFormData((prev) => ({
      ...prev,
      currentStep: step,
    }));
  };

  const handleSave = () => {
    onSave({
      ...formData,
      regularCycleMonths: cycleInfo.cycleMonths,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-red-400" />
            <div>
              <h3 className="font-bold text-base">
                Thẩm Định Chi Tiết & Chỉnh Sửa Hồ Sơ
              </h3>
              <p className="text-xs text-slate-400">
                {formData.salutation} {formData.fullName} — {formData.department}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Kết quả thẩm định tổng quan */}
          <div
            className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              result.isEligible
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : 'bg-rose-50 border-rose-300 text-rose-950'
            }`}
          >
            <div className="flex items-center gap-3">
              {result.isEligible ? (
                <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
              ) : (
                <XCircle className="w-8 h-8 text-rose-600 shrink-0" />
              )}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Kết luận thẩm định
                </span>
                <div
                  className={`text-xl font-black ${
                    result.isEligible ? 'text-emerald-700' : 'text-rose-700'
                  }`}
                >
                  {result.isEligible ? 'ĐỦ ĐIỀU KIỆN' : 'KHÔNG ĐỦ ĐIỀU KIỆN'}
                </div>
                <p className="text-xs font-medium mt-0.5">{result.summaryReason}</p>
              </div>
            </div>

            <div className="bg-white/90 p-3 rounded-lg border border-slate-200 text-center shrink-0 min-w-[200px]">
              <span className="text-[11px] text-slate-500 block">Sau khi nâng trước thời hạn</span>
              <div className="text-base font-black text-red-700">
                Bậc {result.newStep} — Hệ số {result.newCoefficient.toFixed(2)}
              </div>
              <span className="text-[11px] font-bold text-slate-700 block mt-0.5">
                Hưởng từ ngày: {result.newEffectiveDate}
              </span>
            </div>
          </div>

          {/* Checklist 6 tiêu chuẩn quy định */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-xs flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              Đối chiếu 6 Tiêu chuẩn Nâng lương trước thời hạn (TT 08 & TT 03)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {result.criteria.map((c) => (
                <div
                  key={c.id}
                  className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                    c.status === 'passed'
                      ? 'bg-emerald-50/40 border-emerald-200 text-emerald-950'
                      : c.status === 'failed'
                      ? 'bg-rose-50/40 border-rose-200 text-rose-950'
                      : 'bg-amber-50/40 border-amber-200 text-amber-950'
                  }`}
                >
                  {c.status === 'passed' && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  )}
                  {c.status === 'failed' && (
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  {c.status === 'warning' && (
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="font-bold block text-xs">{c.label}</span>
                    <span className="text-[11px] block mt-0.5 leading-snug">{c.message}</span>
                    {c.detail && (
                      <span className="text-[10px] text-slate-500 italic block mt-0.5">
                        {c.detail}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Chỉnh sửa thông tin chi tiết */}
          <div className="border border-slate-200 rounded-xl p-4 space-y-4 bg-slate-50/40">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-xs border-b border-slate-200 pb-2">
              Chỉnh Sửa Dữ Liệu Hồ Sơ
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-slate-600 font-medium mb-1">Danh xưng</label>
                <select
                  value={formData.salutation}
                  onChange={(e) =>
                    setFormData({ ...formData, salutation: e.target.value as any })
                  }
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium"
                >
                  <option value="Bà">Bà</option>
                  <option value="Ông">Ông</option>
                </select>
              </div>

              <div className="sm:col-span-6">
                <label className="block text-slate-600 font-medium mb-1">Họ và tên</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 font-bold"
                />
              </div>

              <div className="sm:col-span-4">
                <label className="block text-slate-600 font-medium mb-1">Giới tính</label>
                <select
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value as any })
                  }
                  className="w-full bg-white border border-slate-300 rounded-lg p-2"
                >
                  <option value="Nữ">Nữ</option>
                  <option value="Nam">Nam</option>
                </select>
              </div>

              <div className="sm:col-span-6">
                <label className="block text-slate-600 font-medium mb-1">Chức vụ</label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div className="sm:col-span-6">
                <label className="block text-slate-600 font-medium mb-1">Đơn vị công tác</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2"
                />
              </div>

              {/* 1. NGƯỜI DÙNG NHẬP NGẠCH / CDNN (KHÔNG CHỌN) */}
              <div className="sm:col-span-6">
                <label className="block text-slate-700 font-bold mb-1">
                  Tên Ngạch / CDNN <span className="font-normal text-slate-500">(Người dùng tự nhập)</span>
                </label>
                <input
                  type="text"
                  list="modalGradeTitlesList"
                  value={formData.gradeTitle}
                  onChange={(e) => handleGradeTitleInput(e.target.value)}
                  placeholder="Nhập tên ngạch..."
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 font-semibold text-slate-900"
                />
                <datalist id="modalGradeTitlesList">
                  {SALARY_GRADES.map((g) => (
                    <option key={g.code} value={g.name}>
                      {g.code}
                    </option>
                  ))}
                </datalist>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-slate-700 font-bold mb-1">
                  Mã số ngạch <span className="font-normal text-slate-500">(Tự nhập)</span>
                </label>
                <input
                  type="text"
                  list="modalGradeCodesList"
                  value={formData.gradeCode}
                  onChange={(e) => handleGradeCodeInput(e.target.value)}
                  placeholder="VD: V.07.02.25..."
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono font-bold"
                />
                <datalist id="modalGradeCodesList">
                  {SALARY_GRADES.map((g) => (
                    <option key={g.code} value={g.code}>
                      {g.name}
                    </option>
                  ))}
                </datalist>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-slate-700 font-bold mb-1">
                  Chu kỳ giữ bậc (Tự động TT 08)
                </label>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 font-bold text-blue-900 text-xs flex items-center justify-between">
                  <span>{cycleInfo.cycleMonths} tháng</span>
                  <span className="text-[10px] text-blue-700 font-medium">
                    {cycleInfo.cycleMonths === 36 ? 'Trình độ CĐ trở lên' : 'Trình độ Trung cấp'}
                  </span>
                </div>
              </div>

              {/* 2. NHẬP HỆ SỐ LƯƠNG HIỆN HƯỞNG -> TỰ ĐỘNG SINH BẬC LƯƠNG */}
              <div className="sm:col-span-4 bg-red-50/50 p-2.5 rounded-xl border border-red-200">
                <label className="block text-red-950 font-bold mb-1">
                  Nhập Hệ số lương hiện hưởng *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.currentCoefficient || ''}
                  onChange={(e) => handleCoefficientChange(e.target.value)}
                  placeholder="VD: 3.66, 3.03..."
                  className="w-full bg-white border border-red-300 rounded-lg p-2 font-mono font-black text-center text-red-700 text-base"
                />
                <span className="block text-[10px] text-red-700 mt-1">
                  * Nhập hệ số để hệ thống tự suy ra bậc lương
                </span>
              </div>

              <div className="sm:col-span-4 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-200">
                <label className="block text-emerald-950 font-bold mb-1 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-emerald-600" />
                  Bậc lương (Tự động sinh)
                </label>
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={formData.currentStep}
                  onChange={(e) => handleStepChange(Number(e.target.value))}
                  className="w-full bg-white border border-emerald-300 rounded-lg p-2 font-bold text-center text-emerald-800 text-base"
                />
                <span className="block text-[10px] text-emerald-700 font-semibold mt-1">
                  {autoDeduceMsg || 'Đã sinh theo Nghị định 204'}
                </span>
              </div>

              <div className="sm:col-span-4 p-2.5 rounded-xl border border-slate-200 bg-white">
                <FastDatePicker
                  label="Ngày hưởng lương gần nhất *"
                  value={formData.lastPromotionDate}
                  onChange={(val) => setFormData({ ...formData, lastPromotionDate: val })}
                  defaultYear={reviewYear - 2}
                  helperText="Ngày quyết định xếp lương gần nhất"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-slate-600 font-medium mb-1">Số tháng nâng TTH</label>
                <select
                  value={formData.requestedMonths}
                  onChange={(e) =>
                    setFormData({ ...formData, requestedMonths: Number(e.target.value) })
                  }
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 font-bold text-red-700"
                >
                  <option value={12}>12 tháng (Xuất sắc tiêu biểu)</option>
                  <option value={9}>9 tháng (Chiến sĩ thi đua cơ sở)</option>
                  <option value={6}>6 tháng (Hoàn thành xuất sắc)</option>
                </select>
              </div>

              <div className="sm:col-span-9">
                <label className="block text-slate-600 font-medium mb-1">
                  Thành tích đạt được
                </label>
                <input
                  type="text"
                  value={formData.achievementTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, achievementTitle: e.target.value })
                  }
                  className="w-full bg-white border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div className="sm:col-span-6">
                <label className="block text-slate-600 font-medium mb-1">Số QĐ khen thưởng</label>
                <input
                  type="text"
                  value={formData.achievementDecisionNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      achievementDecisionNumber: e.target.value,
                    })
                  }
                  className="w-full bg-white border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div className="sm:col-span-6">
                <FastDatePicker
                  label="Ngày ký QĐ thành tích"
                  value={formData.achievementDecisionDate}
                  onChange={(val) =>
                    setFormData({
                      ...formData,
                      achievementDecisionDate: val,
                    })
                  }
                  defaultYear={reviewYear - 1}
                />
              </div>

              <div className="sm:col-span-6">
                <label className="block text-slate-600 font-medium mb-1">
                  Đánh giá phân loại chất lượng
                </label>
                <select
                  value={formData.annualRating}
                  onChange={(e) =>
                    setFormData({ ...formData, annualRating: e.target.value as any })
                  }
                  className="w-full bg-white border border-slate-300 rounded-lg p-2"
                >
                  <option value="hoan_thanh_xuat_sac">Hoàn thành xuất sắc nhiệm vụ</option>
                  <option value="hoan_thanh_tot">Hoàn thành tốt nhiệm vụ</option>
                  <option value="hoan_thanh">Hoàn thành nhiệm vụ</option>
                  <option value="khong_hoan_thanh">Không hoàn thành nhiệm vụ</option>
                </select>
              </div>

              <div className="sm:col-span-6">
                <label className="block text-slate-600 font-medium mb-1">Kỷ luật</label>
                <select
                  value={formData.isDisciplined ? 'true' : 'false'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isDisciplined: e.target.value === 'true',
                      disciplineMonthsExtended: e.target.value === 'true' ? 6 : 0,
                    })
                  }
                  className="w-full bg-white border border-slate-300 rounded-lg p-2"
                >
                  <option value="false">Không bị xử lý kỷ luật</option>
                  <option value="true">Có bị kỷ luật (Không đủ điều kiện)</option>
                </select>
              </div>

              <div className="sm:col-span-12 pt-2 border-t border-slate-200">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isConsecutivePremature}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isConsecutivePremature: e.target.checked,
                      })
                    }
                    className="rounded border-slate-300 text-red-600 focus:ring-red-500 w-4 h-4"
                  />
                  <span className="text-slate-800 font-medium">
                    Đã nâng bậc lương trước thời hạn lần liền kề trước đó trong cùng ngạch này? (Sẽ bị báo không đủ điều kiện theo TT 03)
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-medium hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Đóng
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 bg-red-700 hover:bg-red-800 text-white rounded-xl font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Lưu Thay Đổi</span>
          </button>
        </div>
      </div>
    </div>
  );
};
