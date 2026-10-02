export type Gender = 'Nam' | 'Nữ';

export interface SalaryGrade {
  code: string; // Mã ngạch / CDNN ví dụ: V.07.02.25
  name: string; // Tên ngạch ví dụ: Giáo viên mầm non hạng II
  group: 'A3.1' | 'A3.2' | 'A2.1' | 'A2.2' | 'A1' | 'A0' | 'B' | 'C';
  regularCycleMonths: number; // 36 tháng cho ĐH/CĐ trở lên, 24 tháng cho TC trở xuống
  maxStep: number;
  coefficients: number[]; // Hệ số từng bậc [bậc 1, bậc 2, ...]
}

export interface AchievementItem {
  name: string; // Ví dụ: Chiến sĩ thi đua cơ sở, Bằng khen UBND tỉnh...
  decisionNumber: string; // Số QĐ
  decisionDate: string; // YYYY-MM-DD
  recommendedMonths: number; // 6, 9, 12 tháng
}

export interface AppraisalRecord {
  id: string;
  orderNumber: number;
  salutation: 'Ông' | 'Bà';
  fullName: string;
  gender: Gender;
  position: string; // Chức vụ
  department: string; // Đơn vị công tác
  gradeTitle: string; // Tên ngạch / CDNN
  gradeCode: string; // Mã ngạch / CDNN
  regularCycleMonths: number; // 36 hoặc 24 tháng

  // Lương hiện hưởng
  currentStep: number; // Bậc lương đang hưởng
  currentCoefficient: number; // Hệ số lương đang hưởng
  lastPromotionDate: string; // Ngày tháng năm được hưởng lương hiện tại (YYYY-MM-DD)

  // Điều kiện & Tiêu chuẩn
  annualRating: 'hoan_thanh_xuat_sac' | 'hoan_thanh_tot' | 'hoan_thanh' | 'khong_hoan_thanh';
  isDisciplined: boolean; // Có bị kỷ luật không
  disciplineMonthsExtended: number; // Số tháng bị kéo dài do kỷ luật nếu có
  isConsecutivePremature: boolean; // Đã nâng TTH lần trước trong cùng ngạch/CDNN hay chưa
  hasPreviousTTH: boolean; // Đã từng nâng TTH trước đây chưa
  previousTTHDate?: string; // Ngày QĐ nâng TTH lần trước nếu có

  // Thành tích lập được
  achievementTitle: string; // Tên thành tích (VD: CSTĐCS 2022-2023)
  achievementDecisionNumber: string; // Số QĐ khen thưởng
  achievementDecisionDate: string; // Ngày ban hành QĐ khen thưởng (YYYY-MM-DD)
  
  // Đề xuất nâng lương TTH
  requestedMonths: number; // Số tháng nâng trước thời hạn (6, 9, 12 tháng)
  reviewYear: number; // Năm xét nâng lương (ví dụ: 2026)

  // Ghi chú
  notes?: string;
}

export interface ValidationCriterion {
  id: string;
  label: string;
  status: 'passed' | 'failed' | 'warning';
  message: string;
  detail?: string;
}

export interface AppraisalResult {
  recordId: string;
  isEligible: boolean; // Đủ điều kiện hay không
  criteria: ValidationCriterion[];
  
  // Thời gian tính toán
  regularPromotionDate: string; // Ngày đến hạn thường xuyên (DD/MM/YYYY)
  remainingMonthsAtYearEnd: number; // Số tháng còn thiếu tính đến 31/12 năm xét
  monthsSinceLastPromotion: number; // Số tháng đã giữ bậc tính đến 31/12 năm xét
  
  // Kết quả sau khi nâng bậc lương trước thời hạn
  newStep: number; // Bậc mới
  newCoefficient: number; // Hệ số mới
  newEffectiveDate: string; // Ngày tháng năm được hưởng sau nâng TTH (DD/MM/YYYY)
  
  summaryReason: string;
}
