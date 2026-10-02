import { AppraisalRecord, AppraisalResult, ValidationCriterion } from '../types/salary';
import {
  getNextStepAndCoefficient,
  findSalaryGrade,
  determineCycleMonthsByCoefficient,
} from '../data/salaryScales';

/**
 * Thêm số tháng vào một ngày (định dạng YYYY-MM-DD hoặc Date)
 */
export function addMonthsToDate(dateStr: string, monthsToAdd: number): Date {
  const parts = dateStr.split('-');
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // 0-indexed
  const day = parseInt(parts[2], 10);

  const date = new Date(year, month, day);
  
  // Tính năm và tháng mới
  const targetMonth = date.getMonth() + monthsToAdd;
  date.setMonth(targetMonth);
  
  // Đảm bảo xử lý tràn ngày (ví dụ 31 vào tháng có 30 ngày)
  // Nếu ngày bị nhảy sang tháng kế tiếp, lùi lại ngày cuối cùng của tháng đó
  const expectedMonth = (targetMonth % 12 + 12) % 12;
  while (date.getMonth() !== expectedMonth) {
    date.setDate(date.getDate() - 1);
  }
  return date;
}

/**
 * Định dạng Date thành DD/MM/YYYY
 */
export function formatDateVN(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Định dạng Date thành YYYY-MM-DD cho input HTML
 */
export function formatDateISO(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
}

/**
 * Tính số tháng giữa 2 mốc thời gian
 */
export function diffInMonths(fromDate: Date, toDate: Date): number {
  const yearDiff = toDate.getFullYear() - fromDate.getFullYear();
  const monthDiff = toDate.getMonth() - fromDate.getMonth();
  const dayDiff = (toDate.getDate() - fromDate.getDate()) / 30; // xấp xỉ phần ngày
  return yearDiff * 12 + monthDiff + dayDiff;
}

/**
 * Hàm Thẩm định hồ sơ nâng lương trước thời hạn cho 1 cá nhân
 * theo Thông tư 08/2013/TT-BNV, Thông tư 03/2021/TT-BNV, Nghị định 204/2004/NĐ-CP
 */
export function evaluateAppraisal(record: AppraisalRecord): AppraisalResult {
  const criteria: ValidationCriterion[] = [];
  const reviewYear = record.reviewYear || 2026;
  const cutoffDate = new Date(reviewYear, 11, 31); // 31/12/reviewYear

  // 1. Tự động xác định chu kỳ giữ bậc căn cứ theo Thông tư 08/2013/TT-BNV và hệ số lương
  const cycleInfo = determineCycleMonthsByCoefficient(
    record.gradeCode || record.gradeTitle,
    record.currentCoefficient
  );
  const cycleMonths = cycleInfo.cycleMonths;

  // 2. Tính ngày đến hạn nâng bậc thường xuyên
  // Ngày thường xuyên = Ngày hưởng gần nhất + chu kỳ (36 hoặc 24 tháng) + thời gian kéo dài (nếu có kỷ luật)
  const lastPromo = record.lastPromotionDate ? new Date(record.lastPromotionDate) : new Date();
  const regularPromoDate = addMonthsToDate(
    record.lastPromotionDate,
    cycleMonths + (record.disciplineMonthsExtended || 0)
  );

  // 3. Tính ngày hưởng sau khi nâng trước thời hạn
  // Ngày hưởng mới = Ngày thường xuyên - số tháng nâng TTH
  const requestedMonths = record.requestedMonths || 9;
  const newEffectiveDateObj = addMonthsToDate(
    formatDateISO(regularPromoDate),
    -requestedMonths
  );
  const newEffectiveDate = formatDateVN(newEffectiveDateObj);

  // 4. Tính số tháng còn thiếu tính đến 31/12 của năm xét
  // Điểm a Khoản 1 Điều 3 TT 08/2013: "tính đến ngày 31 tháng 12 của năm xét nâng bậc lương trước thời hạn
  // còn thiếu từ 12 tháng trở xuống để được nâng bậc lương thường xuyên"
  const rawMonthsRemaining = diffInMonths(cutoffDate, regularPromoDate);
  const monthsRemaining = Math.max(0, Math.round(rawMonthsRemaining * 10) / 10);
  const monthsHeldSoFar = Math.max(0, Math.round(diffInMonths(lastPromo, cutoffDate) * 10) / 10);

  // 5. Tính bậc và hệ số mới chuẩn xác theo Nghị định 204
  const stepInfo = getNextStepAndCoefficient(
    record.gradeCode || record.gradeTitle,
    record.currentStep,
    record.currentCoefficient
  );

  // ===================== KIỂM TRA TỪNG TIÊU CHUẨN THẨM ĐỊNH =====================

  // Tiêu chuẩn 1: Chưa xếp bậc lương cuối cùng trong ngạch/chức danh
  const isMaxStep = stepInfo.isMaxStep;
  if (isMaxStep) {
    criteria.push({
      id: 'max_step',
      label: 'Chưa xếp bậc lương cuối cùng',
      status: 'failed',
      message: `Đã ở bậc kịch khung (Bậc ${record.currentStep}/${stepInfo.maxStepNumber}). Không thuộc đối tượng nâng bậc lương mà chuyển sang xét phụ cấp TNVK.`,
      detail: 'Căn cứ Khoản 1 Điều 3 Thông tư 08/2013/TT-BNV',
    });
  } else {
    criteria.push({
      id: 'max_step',
      label: 'Chưa xếp bậc lương cuối cùng',
      status: 'passed',
      message: `Bậc hiện hưởng ${record.currentStep} < Bậc tối đa ${stepInfo.maxStepNumber}. Đủ điều kiện nâng bậc kế tiếp.`,
    });
  }

  // Tiêu chuẩn 2: Đánh giá phân loại chất lượng & Kỷ luật (Khoản 2 Điều 2 TT 08 & TT 03)
  if (record.isDisciplined) {
    criteria.push({
      id: 'discipline',
      label: 'Không vi phạm kỷ luật',
      status: 'failed',
      message: `Bị xử lý kỷ luật trong thời gian giữ bậc (bị kéo dài ${record.disciplineMonthsExtended || 0} tháng). Không đạt tiêu chuẩn nâng lương trước thời hạn.`,
      detail: 'Căn cứ Khoản 2 Điều 2 & Khoản 3 Điều 2 Thông tư 08/2013 và TT 03/2021',
    });
  } else {
    criteria.push({
      id: 'discipline',
      label: 'Không vi phạm kỷ luật',
      status: 'passed',
      message: 'Không bị xử lý kỷ luật trong thời gian giữ bậc hiện tại.',
    });
  }

  if (record.annualRating === 'khong_hoan_thanh') {
    criteria.push({
      id: 'rating',
      label: 'Đánh giá chất lượng hàng năm',
      status: 'failed',
      message: 'Có năm bị đánh giá không hoàn thành nhiệm vụ. Không đủ tiêu chuẩn nâng lương.',
      detail: 'Căn cứ Khoản 4 Điều 1 Thông tư 03/2021/TT-BNV (sửa đổi TT 08)',
    });
  } else {
    criteria.push({
      id: 'rating',
      label: 'Đánh giá chất lượng hàng năm',
      status: 'passed',
      message: `Được đánh giá xếp loại từ mức hoàn thành nhiệm vụ trở lên (${
        record.annualRating === 'hoan_thanh_xuat_sac'
          ? 'Hoàn thành xuất sắc nhiệm vụ'
          : record.annualRating === 'hoan_thanh_tot'
          ? 'Hoàn thành tốt nhiệm vụ'
          : 'Hoàn thành nhiệm vụ'
      }).`,
    });
  }

  // Tiêu chuẩn 3: Thời gian còn thiếu để nâng lương thường xuyên tính đến 31/12 năm xét
  // Căn cứ Điểm a Khoản 1 Điều 3 TT 08/2013
  const isTimeRemainingValid = rawMonthsRemaining <= 12 && rawMonthsRemaining >= -6;
  if (!isTimeRemainingValid) {
    if (rawMonthsRemaining > 12) {
      criteria.push({
        id: 'remaining_time',
        label: 'Thời gian thiếu đến 31/12',
        status: 'failed',
        message: `Tính đến 31/12/${reviewYear} còn thiếu ${monthsRemaining} tháng (vượt quá 12 tháng). Chưa đủ điều kiện xét trong đợt năm ${reviewYear}.`,
        detail: 'Căn cứ Điểm a Khoản 1 Điều 3 Thông tư 08/2013/TT-BNV',
      });
    } else {
      criteria.push({
        id: 'remaining_time',
        label: 'Thời gian thiếu đến 31/12',
        status: 'warning',
        message: `Đã quá hạn nâng bậc thường xuyên trước thời điểm 31/12/${reviewYear}. Cần kiểm tra lại ngày nâng lương thường xuyên.`,
      });
    }
  } else {
    criteria.push({
      id: 'remaining_time',
      label: 'Thời gian thiếu đến 31/12',
      status: 'passed',
      message: `Tính đến 31/12/${reviewYear} còn thiếu ${Math.max(0, monthsRemaining)} tháng (đạt điều kiện: từ 12 tháng trở xuống).`,
    });
  }

  // Tiêu chuẩn 4: Quy tắc không nâng bậc lương trước thời hạn 2 lần liên tiếp trong cùng ngạch/CDNN
  // Căn cứ Điểm d Khoản 1 Điều 3 TT 08/2013 sửa đổi bởi TT 03/2021: "Không thực hiện hai lần liên tiếp nâng bậc lương trước thời hạn do lập thành tích xuất sắc trong cùng ngạch hoặc cùng chức danh"
  if (record.isConsecutivePremature) {
    criteria.push({
      id: 'consecutive',
      label: 'Không nâng 2 lần liên tiếp',
      status: 'failed',
      message: 'Đã được nâng bậc lương trước thời hạn lần liền kề trước đó trong cùng ngạch/chức danh. Không được nâng 2 lần liên tiếp.',
      detail: 'Căn cứ Điểm 6 Điều 1 Thông tư 03/2021/TT-BNV (sửa đổi Điểm d Khoản 1 Điều 3 TT 08)',
    });
  } else {
    criteria.push({
      id: 'consecutive',
      label: 'Không nâng 2 lần liên tiếp',
      status: 'passed',
      message: 'Đảm bảo quy định không nâng bậc lương trước thời hạn 2 lần liên tiếp trong cùng ngạch/chức danh.',
    });
  }

  // Tiêu chuẩn 5: Thời điểm đạt thành tích xuất sắc và tính hợp lệ của văn bản công nhận
  // Căn cứ Điểm đ Khoản 1 Điều 3 TT 08/2013: 6 năm gần nhất với CĐ trở lên; 4 năm gần nhất với Trung cấp trở xuống tính đến 31/12 năm xét.
  // Đồng thời thành tích phải đạt sau ngày có QĐ nâng TTH lần trước nếu có.
  const maxYearsAchievement = cycleMonths >= 36 ? 6 : 4;
  let achievementValid = true;
  let achievementMsg = '';

  if (!record.achievementTitle && !record.achievementDecisionNumber) {
    achievementValid = false;
    achievementMsg = 'Chưa có thông tin quyết định thành tích xuất sắc được công nhận bằng văn bản.';
  } else if (record.achievementDecisionDate) {
    const achDate = new Date(record.achievementDecisionDate);
    const diffYears = (cutoffDate.getTime() - achDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    
    if (diffYears < 0) {
      achievementValid = false;
      achievementMsg = `Ngày ban hành QĐ khen thưởng (${record.achievementDecisionDate}) sau ngày 31/12/${reviewYear}. Không hợp lệ.`;
    } else if (diffYears > maxYearsAchievement) {
      achievementValid = false;
      achievementMsg = `Thành tích đạt được cách đây hơn ${maxYearsAchievement} năm so với mốc 31/12/${reviewYear} (quá thời hạn quy định ${maxYearsAchievement} năm).`;
    } else if (record.hasPreviousTTH && record.previousTTHDate) {
      const prevTTH = new Date(record.previousTTHDate);
      if (achDate < prevTTH) {
        achievementValid = false;
        achievementMsg = 'Thành tích đạt được trước ngày có QĐ nâng lương trước thời hạn lần trước, không được sử dụng để xét lần sau.';
      }
    }
  }

  if (!achievementValid) {
    criteria.push({
      id: 'achievement',
      label: 'Thành tích xuất sắc hợp lệ',
      status: 'failed',
      message: achievementMsg,
      detail: `Căn cứ Điểm đ Khoản 1 Điều 3 TT 08/2013 (${maxYearsAchievement} năm gần nhất)`,
    });
  } else {
    criteria.push({
      id: 'achievement',
      label: 'Thành tích xuất sắc hợp lệ',
      status: 'passed',
      message: `Thành tích: ${record.achievementTitle || 'Đạt tiêu chuẩn'} (QĐ ban hành trong thời hạn ${maxYearsAchievement} năm gần nhất theo quy định).`,
    });
  }

  // Tiêu chuẩn 6: Mức đề xuất nâng trước thời hạn (tối đa 12 tháng)
  if (requestedMonths > 12) {
    criteria.push({
      id: 'months_limit',
      label: 'Số tháng nâng trước thời hạn',
      status: 'failed',
      message: `Đề xuất nâng ${requestedMonths} tháng vượt quá mức tối đa 12 tháng cho phép.`,
      detail: 'Căn cứ Điểm a Khoản 1 Điều 3 Thông tư 08/2013/TT-BNV',
    });
  } else {
    criteria.push({
      id: 'months_limit',
      label: 'Số tháng nâng trước thời hạn',
      status: 'passed',
      message: `Đề xuất nâng ${requestedMonths} tháng (hợp lệ: tối đa 12 tháng).`,
    });
  }

  // Tiêu chuẩn 7: Ngày hưởng sau khi nâng bậc lương trước thời hạn phải sau ngày có quyết định thành tích
  if (record.achievementDecisionDate) {
    const achDate = new Date(record.achievementDecisionDate);
    const achTime = new Date(achDate.getFullYear(), achDate.getMonth(), achDate.getDate()).getTime();
    const effTime = new Date(newEffectiveDateObj.getFullYear(), newEffectiveDateObj.getMonth(), newEffectiveDateObj.getDate()).getTime();

    if (effTime < achTime) {
      criteria.push({
        id: 'effective_after_achievement',
        label: 'Ngày hưởng sau ngày có QĐ thành tích',
        status: 'failed',
        message: `Ngày hưởng bậc lương mới (${newEffectiveDate}) trước ngày ký QĐ thành tích (${formatDateVN(achDate)}). Không hợp lệ: Ngày hưởng nâng lương TTH phải từ sau ngày có quyết định công nhận thành tích.`,
        detail: 'Căn cứ Điểm đ Khoản 1 Điều 3 Thông tư 08/2013/TT-BNV',
      });
    } else {
      criteria.push({
        id: 'effective_after_achievement',
        label: 'Ngày hưởng sau ngày có QĐ thành tích',
        status: 'passed',
        message: `Ngày hưởng bậc lương mới (${newEffectiveDate}) sau ngày ký QĐ thành tích (${formatDateVN(achDate)}). Đạt yêu cầu.`,
      });
    }
  }

  // Tiêu chuẩn 8: Ngày hưởng sau khi nâng bậc lương trước thời hạn phải nằm trong năm xét nâng bậc lương trước thời hạn
  const newEffectiveYear = newEffectiveDateObj.getFullYear();
  if (newEffectiveYear !== reviewYear) {
    criteria.push({
      id: 'effective_in_review_year',
      label: 'Ngày hưởng nằm trong năm xét',
      status: 'failed',
      message: `Ngày hưởng bậc lương mới (${newEffectiveDate}) thuộc năm ${newEffectiveYear}, không nằm trong năm xét (${reviewYear}). Thời điểm hưởng phải phát sinh trong năm xét ${reviewYear}.`,
      detail: 'Căn cứ Thông tư 08/2013/TT-BNV (Chế độ nâng lương trước thời hạn theo năm xét)',
    });
  } else {
    criteria.push({
      id: 'effective_in_review_year',
      label: 'Ngày hưởng nằm trong năm xét',
      status: 'passed',
      message: `Ngày hưởng bậc lương mới (${newEffectiveDate}) nằm trong năm xét ${reviewYear}. Đạt yêu cầu.`,
    });
  }

  // TỔNG KẾT:
  const isEligible = criteria.every(c => c.status !== 'failed');
  let summaryReason = '';

  if (isEligible) {
    summaryReason = `Đủ điều kiện nâng bậc lương trước thời hạn ${requestedMonths} tháng kể từ ngày ${newEffectiveDate}, hưởng Bậc ${stepInfo.nextStep}, Hệ số ${stepInfo.nextCoeff}.`;
  } else {
    const failedCriteria = criteria.filter(c => c.status === 'failed');
    summaryReason = `Không đủ điều kiện do: ${failedCriteria.map(f => f.message).join('; ')}`;
  }

  return {
    recordId: record.id,
    isEligible,
    criteria,
    regularPromotionDate: formatDateVN(regularPromoDate),
    remainingMonthsAtYearEnd: monthsRemaining,
    monthsSinceLastPromotion: monthsHeldSoFar,
    newStep: stepInfo.nextStep,
    newCoefficient: stepInfo.nextCoeff,
    newEffectiveDate,
    summaryReason,
  };
}

/**
 * Thẩm định toàn bộ danh sách hồ sơ
 */
export function evaluateAllAppraisals(records: AppraisalRecord[]): Map<string, AppraisalResult> {
  const map = new Map<string, AppraisalResult>();
  for (const record of records) {
    map.set(record.id, evaluateAppraisal(record));
  }
  return map;
}

/**
 * Tính toán chỉ tiêu 10% theo quy định tại Điểm b, c Khoản 1 Điều 3 TT 08/2013:
 * "Cứ mỗi 10 người trong danh sách trả lương... được xác định có 01 người được nâng bậc lương trước thời hạn..."
 */
export function calculateQuota(totalPayrollCount: number): {
  allowedQuota: number;
  remainder: number;
  explanation: string;
} {
  const allowed = Math.floor(totalPayrollCount / 10);
  const remainder = totalPayrollCount % 10;
  return {
    allowedQuota: allowed,
    remainder,
    explanation: `Cứ 10 người được 01 chỉ tiêu: ${totalPayrollCount} người = ${allowed} chỉ tiêu chính thức (dư ${remainder} người).`,
  };
}
