import React, { useState } from 'react';
import { AppraisalRecord } from '../types/salary';
import { evaluateAppraisal } from '../utils/salaryCalculator';
import {
  SALARY_GRADES,
  findSalaryGrade,
  findStepByCoefficient,
  determineCycleMonthsByCoefficient,
} from '../data/salaryScales';
import { CheckCircle2, XCircle, AlertTriangle, UserCheck, Plus, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { FastDatePicker } from './FastDatePicker';

interface QuickAssessmentCardProps {
  onAddToList?: (record: AppraisalRecord) => void;
  reviewYear: number;
}

export const QuickAssessmentCard: React.FC<QuickAssessmentCardProps> = ({
  onAddToList,
  reviewYear,
}) => {
  const [salutation, setSalutation] = useState<'Ông' | 'Bà'>('Bà');
  const [fullName, setFullName] = useState('Nguyễn Thị Mai');
  const [gender, setGender] = useState<'Nam' | 'Nữ'>('Nữ');
  const [position, setPosition] = useState('Giáo viên');
  const [department, setDepartment] = useState('Trường Mầm non Phú Xuân');
  
  // 1. NGƯỜI DÙNG NHẬP NGẠCH / CDNN (KHÔNG CHỌN)
  const [gradeTitle, setGradeTitle] = useState('Giáo viên mầm non hạng II');
  const [selectedGradeCode, setSelectedGradeCode] = useState('V.07.02.25');
  const [regularCycleMonths, setRegularCycleMonths] = useState(36);

  // 2. LƯƠNG HIỆN HƯỞNG & TỰ ĐỘNG SINH BẬC LƯƠNG THEO NGHỊ ĐỊNH 204
  const [currentCoefficient, setCurrentCoefficient] = useState(3.66);
  const [currentStep, setCurrentStep] = useState(5);
  const [lastPromotionDate, setLastPromotionDate] = useState('2024-07-01');
  const [autoDeduceMsg, setAutoDeduceMsg] = useState('Khớp Bậc 5 (3.66) theo NĐ 204');

  // Đề xuất nâng TTH
  const [requestedMonths, setRequestedMonths] = useState(9);
  const [achievementTitle, setAchievementTitle] = useState('CSTĐCS năm học 2022-2023');
  const [achievementDecisionNumber, setAchievementDecisionNumber] = useState('QĐ 425/QĐ-UBND');
  const [achievementDecisionDate, setAchievementDecisionDate] = useState('2023-06-30');

  // Tiêu chí kiểm định
  const [annualRating, setAnnualRating] = useState<'hoan_thanh_xuat_sac' | 'hoan_thanh_tot' | 'hoan_thanh' | 'khong_hoan_thanh'>('hoan_thanh_xuat_sac');
  const [isDisciplined, setIsDisciplined] = useState(false);
  const [disciplineMonths, setDisciplineMonths] = useState(0);
  const [isConsecutivePremature, setIsConsecutivePremature] = useState(false);
  const [hasPreviousTTH, setHasPreviousTTH] = useState(false);
  const [previousTTHDate, setPreviousTTHDate] = useState('2020-01-01');

  // Khi người dùng gõ / nhập Tên ngạch hoặc Mã ngạch
  const handleGradeTitleInput = (typedTitle: string) => {
    setGradeTitle(typedTitle);
    const found = findSalaryGrade(typedTitle);
    if (found) {
      setSelectedGradeCode(found.code);
      setRegularCycleMonths(found.regularCycleMonths);
      // Tự động sinh lại bậc lương theo hệ số hiện có
      if (currentCoefficient > 0) {
        const detected = findStepByCoefficient(found.code || typedTitle, currentCoefficient);
        setCurrentStep(detected.step);
        setAutoDeduceMsg(`Tự động sinh Bậc ${detected.step} (${currentCoefficient}) theo NĐ 204 (${found.name})`);
      }
    } else {
      if (currentCoefficient > 0) {
        const detected = findStepByCoefficient(typedTitle, currentCoefficient);
        setCurrentStep(detected.step);
        setAutoDeduceMsg(`Tự động sinh Bậc ${detected.step} (${currentCoefficient}) theo NĐ 204`);
      }
    }
  };

  const handleGradeCodeInput = (typedCode: string) => {
    setSelectedGradeCode(typedCode);
    const found = findSalaryGrade(typedCode);
    if (found) {
      setGradeTitle(found.name);
      setRegularCycleMonths(found.regularCycleMonths);
      if (currentCoefficient > 0) {
        const detected = findStepByCoefficient(found.code, currentCoefficient);
        setCurrentStep(detected.step);
        setAutoDeduceMsg(`Tự động sinh Bậc ${detected.step} (${currentCoefficient}) theo NĐ 204 (${found.name})`);
      }
    } else {
      if (currentCoefficient > 0) {
        const detected = findStepByCoefficient(typedCode, currentCoefficient);
        setCurrentStep(detected.step);
        setAutoDeduceMsg(`Tự động sinh Bậc ${detected.step} (${currentCoefficient}) theo NĐ 204`);
      }
    }
  };

  // KHI NGƯỜI DÙNG NHẬP HỆ SỐ LƯƠNG -> HỆ THỐNG TỰ SINH RA BẬC LƯƠNG
  const handleCoefficientChange = (valStr: string) => {
    const coeff = parseFloat(valStr.replace(',', '.'));
    setCurrentCoefficient(isNaN(coeff) ? 0 : coeff);

    if (!isNaN(coeff) && coeff > 0) {
      const searchTarget = selectedGradeCode || gradeTitle;
      const detected = findStepByCoefficient(searchTarget, coeff);
      setCurrentStep(detected.step);
      
      const scaleLabel = detected.scaleName ? ` (${detected.scaleName})` : '';
      setAutoDeduceMsg(`Tự động sinh Bậc ${detected.step} (Hệ số ${coeff})${scaleLabel} theo Nghị định 204`);
    }
  };

  // TỰ ĐỘNG XÁC ĐỊNH CHU KỲ THEO THÔNG TƯ 08 VÀ HỆ SỐ LƯƠNG
  const cycleInfo = determineCycleMonthsByCoefficient(
    selectedGradeCode || gradeTitle,
    currentCoefficient
  );

  // Tạo record tạm thời để tính toán
  const currentRecord: AppraisalRecord = {
    id: 'single-preview',
    orderNumber: 1,
    salutation,
    fullName,
    gender,
    position,
    department,
    gradeTitle,
    gradeCode: selectedGradeCode,
    regularCycleMonths: cycleInfo.cycleMonths,
    currentStep,
    currentCoefficient,
    lastPromotionDate,
    annualRating,
    isDisciplined,
    disciplineMonthsExtended: disciplineMonths,
    isConsecutivePremature,
    hasPreviousTTH,
    previousTTHDate,
    achievementTitle,
    achievementDecisionNumber,
    achievementDecisionDate,
    requestedMonths,
    reviewYear,
  };

  const result = evaluateAppraisal(currentRecord);

  const handleSaveToList = () => {
    if (onAddToList) {
      onAddToList({
        ...currentRecord,
        id: `rec-${Date.now()}`,
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        {/* Title Bar */}
        <div className="bg-slate-900 text-white px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-red-400" />
            <h2 className="font-bold text-lg">
              Thẩm Định Nâng Lương Trước Thời Hạn (Kiểm Tra Nhanh Từng Người)
            </h2>
          </div>
          <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
            Năm xét: {reviewYear} (Mốc tính: 31/12/{reviewYear})
          </span>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* CỘT TRÁI: NHẬP LIỆU (7 cột) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Nhóm 1: Thông tin cá nhân */}
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-200 pb-2">
                <span className="w-2 h-2 rounded-full bg-red-600"></span>
                1. Thông tin cá nhân & Đơn vị công tác
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
                <div className="sm:col-span-3">
                  <label className="block text-slate-600 font-medium mb-1">Danh xưng</label>
                  <select
                    value={salutation}
                    onChange={(e) => setSalutation(e.target.value as 'Ông' | 'Bà')}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium"
                  >
                    <option value="Bà">Bà</option>
                    <option value="Ông">Ông</option>
                  </select>
                </div>
                <div className="sm:col-span-6">
                  <label className="block text-slate-600 font-medium mb-1">Họ và tên *</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 font-semibold text-slate-900"
                    placeholder="Nguyễn Văn A"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="block text-slate-600 font-medium mb-1">Giới tính</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'Nam' | 'Nữ')}
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
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2"
                    placeholder="Giáo viên, Kế toán, Phó Hiệu trưởng..."
                  />
                </div>
                <div className="sm:col-span-6">
                  <label className="block text-slate-600 font-medium mb-1">Đơn vị công tác</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2"
                    placeholder="Trường Mầm non Phú Xuân..."
                  />
                </div>
              </div>
            </div>

            {/* Nhóm 2: Ngạch lương & Hệ số hiện hưởng */}
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-200 pb-2">
                <span className="w-2 h-2 rounded-full bg-red-600"></span>
                2. Nhập Ngạch/CDNN & Hệ số lương (Tự động sinh bậc theo NĐ 204)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
                {/* 1. Nhập Tên ngạch / CDNN (Nhập tự do, không bắt buộc chọn) */}
                <div className="sm:col-span-7">
                  <label className="block text-slate-700 font-bold mb-1">
                    Tên Ngạch / CDNN <span className="font-normal text-slate-500">(Người dùng tự nhập)</span> *
                  </label>
                  <input
                    type="text"
                    list="gradeTitlesList"
                    value={gradeTitle}
                    onChange={(e) => handleGradeTitleInput(e.target.value)}
                    placeholder="Nhập tên ngạch (VD: Giáo viên mầm non hạng II, Kế toán viên...)"
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 font-semibold text-slate-900 focus:ring-1 focus:ring-red-600 focus:outline-none"
                  />
                  <datalist id="gradeTitlesList">
                    {SALARY_GRADES.map((g) => (
                      <option key={g.code} value={g.name}>
                        {g.code} - {g.name}
                      </option>
                    ))}
                  </datalist>
                </div>

                {/* 2. Nhập Mã số ngạch / CDNN */}
                <div className="sm:col-span-5">
                  <label className="block text-slate-700 font-bold mb-1">
                    Mã số ngạch / CDNN <span className="font-normal text-slate-500">(Người dùng tự nhập)</span>
                  </label>
                  <input
                    type="text"
                    list="gradeCodesList"
                    value={selectedGradeCode}
                    onChange={(e) => handleGradeCodeInput(e.target.value)}
                    placeholder="VD: V.07.02.25, V.06.032..."
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono font-semibold text-slate-800 focus:ring-1 focus:ring-red-600 focus:outline-none"
                  />
                  <datalist id="gradeCodesList">
                    {SALARY_GRADES.map((g) => (
                      <option key={g.code} value={g.code}>
                        {g.name}
                      </option>
                    ))}
                  </datalist>
                </div>

                {/* Chu kỳ giữ bậc (Tự động xác định theo Thông tư 08/2013/TT-BNV) */}
                <div className="sm:col-span-12 flex flex-col sm:flex-row sm:items-center justify-between bg-blue-50/70 p-2.5 rounded-xl border border-blue-200 text-xs gap-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-blue-950 flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-blue-600" />
                      Chu kỳ giữ bậc (Tự động theo TT 08):
                    </span>
                    <span className="bg-blue-700 text-white font-black px-2.5 py-0.5 rounded-full text-xs">
                      {cycleInfo.cycleMonths} tháng
                    </span>
                    <span className="text-blue-900 font-semibold">({cycleInfo.categoryName})</span>
                  </div>
                  <span className="text-[11px] text-blue-800 italic">
                    Căn cứ: {cycleInfo.legalBasis}
                  </span>
                </div>

                {/* 3. NHẬP HỆ SỐ LƯƠNG HIỆN HƯỞNG -> TỰ ĐỘNG SINH BẬC LƯƠNG */}
                <div className="sm:col-span-4 bg-red-50/50 p-2.5 rounded-xl border border-red-200">
                  <label className="block text-red-950 font-bold mb-1">
                    Nhập Hệ số lương đang hưởng *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={currentCoefficient || ''}
                    onChange={(e) => handleCoefficientChange(e.target.value)}
                    placeholder="VD: 3.66, 3.03..."
                    className="w-full bg-white border border-red-300 rounded-lg p-2 font-mono font-black text-center text-red-700 text-base focus:ring-2 focus:ring-red-600 focus:outline-none"
                  />
                  <span className="block text-[10px] text-red-700 mt-1">
                    * Nhập hệ số để hệ thống tự suy ra bậc lương
                  </span>
                </div>

                {/* BẬC LƯƠNG TỰ ĐỘNG SINH */}
                <div className="sm:col-span-4 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-200">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-emerald-950 font-bold flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-emerald-600" />
                      Bậc lương (Tự động sinh)
                    </label>
                  </div>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    value={currentStep}
                    onChange={(e) => setCurrentStep(Number(e.target.value))}
                    className="w-full bg-white border border-emerald-300 rounded-lg p-2 font-bold text-center text-emerald-800 text-base focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                  <span className="block text-[10px] text-emerald-700 font-semibold mt-1">
                    {autoDeduceMsg}
                  </span>
                </div>

                {/* Ngày hưởng lương gần nhất */}
                <div className="sm:col-span-4 p-2.5 rounded-xl border border-slate-200 bg-white">
                  <FastDatePicker
                    label="Ngày hưởng gần nhất *"
                    value={lastPromotionDate}
                    onChange={(val) => setLastPromotionDate(val)}
                    helperText="Ngày quyết định xếp lương gần nhất"
                    defaultYear={reviewYear - 2}
                  />
                </div>
              </div>
            </div>

            {/* Nhóm 3: Thành tích xuất sắc & Số tháng đề xuất nâng TTH */}
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-200 pb-2">
                <span className="w-2 h-2 rounded-full bg-red-600"></span>
                3. Thành tích xuất sắc & Số tháng đề nghị nâng trước thời hạn
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
                <div className="sm:col-span-5">
                  <label className="block text-slate-600 font-medium mb-1">
                    Thành tích xuất sắc đạt được
                  </label>
                  <input
                    type="text"
                    value={achievementTitle}
                    onChange={(e) => setAchievementTitle(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2"
                    placeholder="VD: CSTĐCS 2022-2023, Bằng khen..."
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-slate-600 font-medium mb-1">Số Quyết định</label>
                  <input
                    type="text"
                    value={achievementDecisionNumber}
                    onChange={(e) => setAchievementDecisionNumber(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2"
                    placeholder="QĐ 425/QĐ-UBND"
                  />
                </div>

                <div className="sm:col-span-4">
                  <FastDatePicker
                    label="Ngày ký QĐ thành tích"
                    value={achievementDecisionDate}
                    onChange={(val) => setAchievementDecisionDate(val)}
                    defaultYear={reviewYear - 1}
                  />
                </div>

                <div className="sm:col-span-12">
                  <label className="block text-slate-700 font-semibold mb-1.5">
                    Số tháng đề xuất nâng bậc lương trước thời hạn (Tối đa 12 tháng)
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[12, 9, 6].map((months) => (
                      <button
                        key={months}
                        type="button"
                        onClick={() => setRequestedMonths(months)}
                        className={`p-2.5 rounded-lg border text-center font-bold transition-all ${
                          requestedMonths === months
                            ? 'bg-red-700 text-white border-red-800 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        Nâng {months} tháng
                        <span className="block text-[10px] font-normal opacity-85">
                          {months === 12
                            ? 'Xuất sắc tiêu biểu / Bằng khen'
                            : months === 9
                            ? 'Chiến sĩ thi đua cơ sở'
                            : 'Hoàn thành xuất sắc / Giấy khen'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Nhóm 4: Các điều kiện ràng buộc theo TT 08 & TT 03 */}
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-200 pb-2">
                <span className="w-2 h-2 rounded-full bg-red-600"></span>
                4. Tiêu chuẩn đánh giá & Ràng buộc (TT 08/2013 & TT 03/2021)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    Đánh giá xếp loại chất lượng hàng năm
                  </label>
                  <select
                    value={annualRating}
                    onChange={(e) => setAnnualRating(e.target.value as any)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium"
                  >
                    <option value="hoan_thanh_xuat_sac">Hoàn thành xuất sắc nhiệm vụ</option>
                    <option value="hoan_thanh_tot">Hoàn thành tốt nhiệm vụ</option>
                    <option value="hoan_thanh">Hoàn thành nhiệm vụ</option>
                    <option value="khong_hoan_thanh">Không hoàn thành nhiệm vụ (Không đạt)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    Có bị kỷ luật trong thời gian giữ bậc?
                  </label>
                  <select
                    value={isDisciplined ? 'true' : 'false'}
                    onChange={(e) => {
                      const val = e.target.value === 'true';
                      setIsDisciplined(val);
                      if (val && disciplineMonths === 0) setDisciplineMonths(6);
                    }}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium"
                  >
                    <option value="false">Không bị xử lý kỷ luật</option>
                    <option value="true">Có bị kỷ luật (Khiển trách, Cảnh cáo...)</option>
                  </select>
                </div>

                <div className="sm:col-span-2 pt-2 border-t border-slate-200">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isConsecutivePremature}
                      onChange={(e) => setIsConsecutivePremature(e.target.checked)}
                      className="rounded border-slate-300 text-red-600 focus:ring-red-500 w-4 h-4"
                    />
                    <span className="text-slate-800 font-medium">
                      Lần nâng bậc lương liền kề trước đó ĐÃ ĐƯỢC nâng trước thời hạn trong cùng ngạch/chức danh này?
                      <span className="text-red-600 font-bold block text-[11px]">
                        (Quy định: Không thực hiện 02 lần liên tiếp nâng lương trước thời hạn trong cùng ngạch - TT 03/2021)
                      </span>
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: KẾT QUẢ THẨM ĐỊNH TỰ ĐỘNG (5 cột) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Banner Kết Luận Lớn */}
            <div
              className={`rounded-2xl p-5 border shadow-sm transition-all ${
                result.isEligible
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-rose-50 border-rose-300 text-rose-950'
              }`}
            >
              <div className="flex items-center gap-3">
                {result.isEligible ? (
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 shrink-0" />
                ) : (
                  <XCircle className="w-10 h-10 text-rose-600 shrink-0" />
                )}
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Kết quả thẩm định
                  </span>
                  <h3
                    className={`text-2xl font-black ${
                      result.isEligible ? 'text-emerald-700' : 'text-rose-700'
                    }`}
                  >
                    {result.isEligible ? 'ĐỦ ĐIỀU KIỆN' : 'KHÔNG ĐỦ ĐIỀU KIỆN'}
                  </h3>
                </div>
              </div>
              <p className="mt-3 text-xs leading-relaxed font-medium">
                {result.summaryReason}
              </p>
            </div>

            {/* Bảng Kết Quả Nâng Lương Chi Tiết */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Dự kiến Kết Quả Nâng Bậc Lương
              </h4>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">Bậc & Hệ số cũ</span>
                  <span className="text-base font-bold text-slate-800">
                    Bậc {currentRecord.currentStep} ({currentRecord.currentCoefficient.toFixed(2)})
                  </span>
                  <span className="block text-[11px] text-slate-500 mt-1">
                    Hưởng từ: {currentRecord.lastPromotionDate?.split('-').reverse().join('/')}
                  </span>
                </div>

                <div className="bg-white p-3 rounded-lg border border-red-200 bg-red-50/30">
                  <span className="text-red-700 font-semibold block text-[11px]">
                    Bậc & Hệ số MỚI (Sau nâng TTH)
                  </span>
                  <span className="text-base font-black text-red-700">
                    Bậc {result.newStep} ({result.newCoefficient.toFixed(2)})
                  </span>
                  <span className="block text-[11px] font-bold text-red-600 mt-1">
                    Hưởng từ: {result.newEffectiveDate}
                  </span>
                </div>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Hạn nâng thường xuyên:</span>
                  <span className="font-semibold text-slate-800">{result.regularPromotionDate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Rút ngắn thời gian:</span>
                  <span className="font-semibold text-red-700">
                    {requestedMonths} tháng trước thời hạn
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Thời gian còn thiếu (đến 31/12/{reviewYear}):</span>
                  <span
                    className={`font-semibold ${
                      result.remainingMonthsAtYearEnd <= 12
                        ? 'text-emerald-700'
                        : 'text-rose-700'
                    }`}
                  >
                    {result.remainingMonthsAtYearEnd} tháng ({result.remainingMonthsAtYearEnd <= 12 ? '≤ 12 tháng: Hợp lệ' : '> 12 tháng: Không đạt'})
                  </span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-100">
                  <span>Hệ số chênh lệch tăng:</span>
                  <span className="font-bold text-emerald-700">
                    +{(result.newCoefficient - currentRecord.currentCoefficient).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Checklist Tiêu Chí Thẩm Định Chi Tiết */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                Đối chiếu 6 Tiêu chuẩn Quy định
              </h4>

              <div className="space-y-2 text-xs">
                {result.criteria.map((c) => (
                  <div
                    key={c.id}
                    className={`p-2.5 rounded-lg border flex items-start gap-2 ${
                      c.status === 'passed'
                        ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900'
                        : c.status === 'failed'
                        ? 'bg-rose-50/50 border-rose-200 text-rose-900'
                        : 'bg-amber-50/50 border-amber-200 text-amber-900'
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
                    <div className="flex-1">
                      <span className="font-semibold block">{c.label}</span>
                      <p className="text-[11px] leading-snug mt-0.5 opacity-90">{c.message}</p>
                      {c.detail && (
                        <span className="text-[10px] text-slate-500 block mt-0.5 italic">
                          {c.detail}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            {onAddToList && (
              <button
                type="button"
                onClick={handleSaveToList}
                className="w-full py-3 px-4 bg-red-700 hover:bg-red-800 text-white rounded-xl font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm vào Danh Sách Thẩm Định Chung</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
