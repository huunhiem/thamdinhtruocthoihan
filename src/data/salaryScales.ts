import { SalaryGrade } from '../types/salary';

/**
 * Bảng lương chuẩn theo Nghị định số 204/2004/NĐ-CP (Bảng 2 & Bảng 3)
 * và các văn bản hướng dẫn xếp lương chuyên ngành (giáo dục, y tế, tài chính...)
 */
export interface StandardScale {
  id: string;
  name: string;
  group: 'A3.1' | 'A3.2' | 'A2.1' | 'A2.2' | 'A1' | 'A0' | 'B' | 'C1' | 'C2' | 'C3';
  regularCycleMonths: number;
  maxStep: number;
  coefficients: number[];
  description: string;
}

export const DECREE_204_SCALES: Record<string, StandardScale> = {
  'A3.1': {
    id: 'A3.1',
    name: 'Công chức, viên chức loại A3.1',
    group: 'A3.1',
    regularCycleMonths: 36,
    maxStep: 6,
    coefficients: [6.20, 6.56, 6.92, 7.28, 7.64, 8.00],
    description: 'Chuyên viên cao cấp, Bác sĩ cao cấp, GV cao cấp, Nghiên cứu viên cao cấp',
  },
  'A3.2': {
    id: 'A3.2',
    name: 'Công chức, viên chức loại A3.2',
    group: 'A3.2',
    regularCycleMonths: 36,
    maxStep: 6,
    coefficients: [5.75, 6.11, 6.47, 6.83, 7.19, 7.55],
    description: 'Ngạch tương đương nhóm 2 loại A3',
  },
  'A2.1': {
    id: 'A2.1',
    name: 'Viên chức loại A2.1 (bắt đầu từ 4.00)',
    group: 'A2.1',
    regularCycleMonths: 36,
    maxStep: 8,
    coefficients: [4.00, 4.34, 4.68, 5.02, 5.36, 5.70, 6.04, 6.38],
    description: 'Viên chức loại A2.1 (khởi điểm 4.00, 8 bậc: 4.00, 4.34, 4.68, 5.02, 5.36, 5.70, 6.04, 6.38)',
  },
  'A2.1_440': {
    id: 'A2.1_440',
    name: 'Công chức, viên chức loại A2.1 (bắt đầu từ 4.40)',
    group: 'A2.1',
    regularCycleMonths: 36,
    maxStep: 8,
    coefficients: [4.40, 4.74, 5.08, 5.42, 5.76, 6.10, 6.44, 6.78],
    description: 'Chuyên viên chính, Bác sĩ chính (4.40, 4.74, 5.08, 5.42, 5.76, 6.10, 6.44, 6.78)',
  },
  'A2.2': {
    id: 'A2.2',
    name: 'Công chức, viên chức loại A2.2 (bắt đầu từ 4.00)',
    group: 'A2.2',
    regularCycleMonths: 36,
    maxStep: 8,
    coefficients: [4.00, 4.34, 4.68, 5.02, 5.36, 5.70, 6.04, 6.38],
    description: 'Giáo viên mầm non hạng I (V.07.02.24), GV tiểu học/THCS hạng II (4.00 - 6.38)',
  },
  'A1': {
    id: 'A1',
    name: 'Công chức, viên chức loại A1',
    group: 'A1',
    regularCycleMonths: 36,
    maxStep: 9,
    coefficients: [2.34, 2.67, 3.00, 3.33, 3.66, 3.99, 4.32, 4.65, 4.98],
    description: 'Chuyên viên, Kế toán viên (V.06.031), GV mầm non hạng II (V.07.02.25), Bác sĩ...',
  },
  'A0': {
    id: 'A0',
    name: 'Công chức, viên chức loại A0',
    group: 'A0',
    regularCycleMonths: 36,
    maxStep: 10,
    coefficients: [2.10, 2.41, 2.72, 3.03, 3.34, 3.65, 3.96, 4.27, 4.58, 4.89],
    description: 'GV mầm non hạng III (V.07.02.26), Kế toán viên trung cấp (A0), Thư viện viên CĐ (17a.170), Cán sự',
  },
  'B': {
    id: 'B',
    name: 'Công chức, viên chức loại B',
    group: 'B',
    regularCycleMonths: 24,
    maxStep: 12,
    coefficients: [1.86, 2.06, 2.26, 2.46, 2.66, 2.86, 3.06, 3.26, 3.46, 3.66, 3.86, 4.06],
    description: 'Nhân viên, Cán sự bậc trung cấp loại B, Y sĩ hạng IV (V.08.03.07)...',
  },
  'C1': {
    id: 'C1',
    name: 'Công chức, viên chức loại C1',
    group: 'C1',
    regularCycleMonths: 24,
    maxStep: 12,
    coefficients: [1.65, 1.83, 2.01, 2.19, 2.37, 2.55, 2.73, 2.91, 3.09, 3.27, 3.45, 3.63],
    description: 'Nhân viên lái xe, bảo vệ, thừa hành phục vụ nhóm 1',
  },
  'C2': {
    id: 'C2',
    name: 'Công chức, viên chức loại C2',
    group: 'C2',
    regularCycleMonths: 24,
    maxStep: 12,
    coefficients: [1.50, 1.68, 1.86, 2.04, 2.22, 2.40, 2.58, 2.76, 2.94, 3.12, 3.30, 3.48],
    description: 'Nhân viên thừa hành phục vụ nhóm 2',
  },
  'C3': {
    id: 'C3',
    name: 'Công chức, viên chức loại C3',
    group: 'C3',
    regularCycleMonths: 24,
    maxStep: 12,
    coefficients: [1.35, 1.53, 1.71, 1.89, 2.07, 2.25, 2.43, 2.61, 2.79, 2.97, 3.15, 3.33],
    description: 'Nhân viên thừa hành phục vụ nhóm 3',
  },
};

/**
 * Danh mục các ngạch, chức danh nghề nghiệp phổ biến
 */
export const SALARY_GRADES: SalaryGrade[] = [
  // Nhóm danh mục tổng quát A2.1, A2.2, A1, A0, B
  {
    code: 'A2.1',
    name: 'Viên chức loại A2.1 (bắt đầu từ 4.00)',
    group: 'A2.1',
    regularCycleMonths: 36,
    maxStep: 8,
    coefficients: [4.00, 4.34, 4.68, 5.02, 5.36, 5.70, 6.04, 6.38],
  },
  {
    code: 'A2.1-4.40',
    name: 'Viên chức loại A2.1 (bắt đầu từ 4.40)',
    group: 'A2.1',
    regularCycleMonths: 36,
    maxStep: 8,
    coefficients: [4.40, 4.74, 5.08, 5.42, 5.76, 6.10, 6.44, 6.78],
  },
  {
    code: 'A2.2',
    name: 'Viên chức loại A2.2 (bắt đầu từ 4.00)',
    group: 'A2.2',
    regularCycleMonths: 36,
    maxStep: 8,
    coefficients: [4.00, 4.34, 4.68, 5.02, 5.36, 5.70, 6.04, 6.38],
  },
  {
    code: 'A1',
    name: 'Viên chức loại A1 (bắt đầu từ 2.34)',
    group: 'A1',
    regularCycleMonths: 36,
    maxStep: 9,
    coefficients: [2.34, 2.67, 3.00, 3.33, 3.66, 3.99, 4.32, 4.65, 4.98],
  },
  {
    code: 'A0',
    name: 'Viên chức loại A0 (bắt đầu từ 2.10)',
    group: 'A0',
    regularCycleMonths: 36,
    maxStep: 10,
    coefficients: [2.10, 2.41, 2.72, 3.03, 3.34, 3.65, 3.96, 4.27, 4.58, 4.89],
  },
  {
    code: 'B',
    name: 'Viên chức loại B (bắt đầu từ 1.86)',
    group: 'B',
    regularCycleMonths: 24,
    maxStep: 12,
    coefficients: [1.86, 2.06, 2.26, 2.46, 2.66, 2.86, 3.06, 3.26, 3.46, 3.66, 3.86, 4.06],
  },

  // 1. Giáo viên mầm non hạng I (V.07.02.24) - Loại A2.1 / A2.2 (hệ số 4.00 - 6.38, 8 bậc)
  {
    code: 'V.07.02.24',
    name: 'Giáo viên mầm non hạng I',
    group: 'A2.1',
    regularCycleMonths: 36,
    maxStep: 8,
    coefficients: [4.00, 4.34, 4.68, 5.02, 5.36, 5.70, 6.04, 6.38],
  },
  // 2. Giáo viên mầm non hạng II (V.07.02.25) - Loại A1 (hệ số 2.34 - 4.98, 9 bậc)
  {
    code: 'V.07.02.25',
    name: 'Giáo viên mầm non hạng II',
    group: 'A1',
    regularCycleMonths: 36,
    maxStep: 9,
    coefficients: [2.34, 2.67, 3.00, 3.33, 3.66, 3.99, 4.32, 4.65, 4.98],
  },
  // 3. Giáo viên mầm non hạng III (V.07.02.26) - Loại A0 (hệ số 2.10 - 4.89, 10 bậc)
  {
    code: 'V.07.02.26',
    name: 'Giáo viên mầm non hạng III',
    group: 'A0',
    regularCycleMonths: 36,
    maxStep: 10,
    coefficients: [2.10, 2.41, 2.72, 3.03, 3.34, 3.65, 3.96, 4.27, 4.58, 4.89],
  },
  // 4. Kế toán viên (V.06.031) - Loại A1 (hệ số 2.34 - 4.98, 9 bậc)
  {
    code: 'V.06.031',
    name: 'Kế toán viên',
    group: 'A1',
    regularCycleMonths: 36,
    maxStep: 9,
    coefficients: [2.34, 2.67, 3.00, 3.33, 3.66, 3.99, 4.32, 4.65, 4.98],
  },
  // 5. Kế toán viên trung cấp (V.06.032) - Thường xếp theo A0 (2.10 - 4.89) hoặc B (1.86 - 4.06)
  {
    code: 'V.06.032',
    name: 'Kế toán viên trung cấp',
    group: 'A0',
    regularCycleMonths: 36,
    maxStep: 10,
    coefficients: [2.10, 2.41, 2.72, 3.03, 3.34, 3.65, 3.96, 4.27, 4.58, 4.89],
  },
  // 6. Thư viện viên cao đẳng (17a.170) - Loại A0
  {
    code: '17a.170',
    name: 'Thư viện viên cao đẳng',
    group: 'A0',
    regularCycleMonths: 36,
    maxStep: 10,
    coefficients: [2.10, 2.41, 2.72, 3.03, 3.34, 3.65, 3.96, 4.27, 4.58, 4.89],
  },
  // 7. Chuyên viên (01.003) - Loại A1
  {
    code: '01.003',
    name: 'Chuyên viên',
    group: 'A1',
    regularCycleMonths: 36,
    maxStep: 9,
    coefficients: [2.34, 2.67, 3.00, 3.33, 3.66, 3.99, 4.32, 4.65, 4.98],
  },
  // 8. Chuyên viên chính (01.002) - Loại A2.1 (4.40 - 6.78)
  {
    code: '01.002',
    name: 'Chuyên viên chính',
    group: 'A2.1',
    regularCycleMonths: 36,
    maxStep: 8,
    coefficients: [4.40, 4.74, 5.08, 5.42, 5.76, 6.10, 6.44, 6.78],
  },
  // 9. Chuyên viên cao cấp (01.001) - Loại A3.1
  {
    code: '01.001',
    name: 'Chuyên viên cao cấp',
    group: 'A3.1',
    regularCycleMonths: 36,
    maxStep: 6,
    coefficients: [6.20, 6.56, 6.92, 7.28, 7.64, 8.00],
  },
  // 10. Giáo viên tiểu học hạng II (V.07.03.28) - Loại A2.1 / A2.2 (hệ số 4.00 - 6.38)
  {
    code: 'V.07.03.28',
    name: 'Giáo viên tiểu học hạng II',
    group: 'A2.1',
    regularCycleMonths: 36,
    maxStep: 8,
    coefficients: [4.00, 4.34, 4.68, 5.02, 5.36, 5.70, 6.04, 6.38],
  },
  // 11. Giáo viên tiểu học hạng III (V.07.03.29) - Loại A1
  {
    code: 'V.07.03.29',
    name: 'Giáo viên tiểu học hạng III',
    group: 'A1',
    regularCycleMonths: 36,
    maxStep: 9,
    coefficients: [2.34, 2.67, 3.00, 3.33, 3.66, 3.99, 4.32, 4.65, 4.98],
  },
  // 12. Cán sự (01.004) - Loại A0
  {
    code: '01.004',
    name: 'Cán sự',
    group: 'A0',
    regularCycleMonths: 36,
    maxStep: 10,
    coefficients: [2.10, 2.41, 2.72, 3.03, 3.34, 3.65, 3.96, 4.27, 4.58, 4.89],
  },
  // 13. Nhân viên văn thư, thủ quỹ (01.005) - Loại B
  {
    code: '01.005',
    name: 'Nhân viên văn thư, thủ quỹ',
    group: 'B',
    regularCycleMonths: 24,
    maxStep: 12,
    coefficients: [1.86, 2.06, 2.26, 2.46, 2.66, 2.86, 3.06, 3.26, 3.46, 3.66, 3.86, 4.06],
  },
  // 14. Bác sĩ (V.08.01.03) - Loại A1
  {
    code: 'V.08.01.03',
    name: 'Bác sĩ',
    group: 'A1',
    regularCycleMonths: 36,
    maxStep: 9,
    coefficients: [2.34, 2.67, 3.00, 3.33, 3.66, 3.99, 4.32, 4.65, 4.98],
  },
  // 15. Y sĩ hạng IV (V.08.03.07) - Loại B
  {
    code: 'V.08.03.07',
    name: 'Y sĩ hạng IV',
    group: 'B',
    regularCycleMonths: 24,
    maxStep: 12,
    coefficients: [1.86, 2.06, 2.26, 2.46, 2.66, 2.86, 3.06, 3.26, 3.46, 3.66, 3.86, 4.06],
  }
];

export function findSalaryGrade(codeOrName: string): SalaryGrade | undefined {
  if (!codeOrName) return undefined;
  const clean = codeOrName.trim().toLowerCase();
  
  // Exact match first
  const exact = SALARY_GRADES.find(
    g => g.code.toLowerCase() === clean || g.name.toLowerCase() === clean
  );
  if (exact) return exact;

  // Specific check for A2.1
  if (clean === 'a2.1' || clean === 'a21' || clean.includes('loại a2.1') || clean.includes('viên chức loại a2.1')) {
    return SALARY_GRADES.find(g => g.code === 'A2.1');
  }

  // Partial match by code or name
  return SALARY_GRADES.find(
    g => clean.includes(g.code.toLowerCase()) || 
         g.code.toLowerCase().includes(clean) ||
         clean.includes(g.name.toLowerCase()) || 
         g.name.toLowerCase().includes(clean)
  );
}

/**
 * Tìm thang bảng lương chuẩn theo Nghị định 204 dựa trên ngạch và hệ số lương
 */
export function resolveDecree204Scale(
  gradeCodeOrName: string,
  coefficient: number
): { scale: StandardScale; step: number } | undefined {
  const coeff = Number(coefficient);
  if (!coeff || isNaN(coeff)) return undefined;

  const clean = (gradeCodeOrName || '').trim().toLowerCase();

  // Bảng hệ số chuẩn A2.1 khởi điểm 4.00 (8 bậc)
  const a2_400 = [4.00, 4.34, 4.68, 5.02, 5.36, 5.70, 6.04, 6.38];
  // Bảng hệ số chuẩn A2.1 khởi điểm 4.40 (8 bậc)
  const a2_440 = [4.40, 4.74, 5.08, 5.42, 5.76, 6.10, 6.44, 6.78];

  // 1. Nếu ngạch hoặc tên chức danh có nhắc tới A2.1 / A2
  if (clean.includes('a2.1') || clean.includes('a2-1') || clean.includes('a2_1')) {
    // Ưu tiên thang bắt đầu từ 4.00 theo phản ánh thực tế người dùng
    const idx400 = a2_400.findIndex(c => Math.abs(c - coeff) < 0.005);
    if (idx400 !== -1) {
      return {
        scale: DECREE_204_SCALES['A2.1'],
        step: idx400 + 1,
      };
    }
    // Nếu hệ số từ 4.40 trở lên
    const idx440 = a2_440.findIndex(c => Math.abs(c - coeff) < 0.005);
    if (idx440 !== -1) {
      return {
        scale: DECREE_204_SCALES['A2.1_440'],
        step: idx440 + 1,
      };
    }
  }

  // 2. Thử thang lương ứng với ngạch đã chọn trong danh mục (nếu có)
  const grade = findSalaryGrade(gradeCodeOrName);
  if (grade && DECREE_204_SCALES[grade.group]) {
    const s = DECREE_204_SCALES[grade.group];
    const idx = s.coefficients.findIndex(c => Math.abs(c - coeff) < 0.005);
    if (idx !== -1) {
      return { scale: s, step: idx + 1 };
    }
  }

  // 3. Nếu là hệ số thuộc thang 4.00 - 6.38 (bước 0.34):
  const idxA2 = a2_400.findIndex(c => Math.abs(c - coeff) < 0.005);
  if (idxA2 !== -1) {
    return {
      scale: DECREE_204_SCALES['A2.1'],
      step: idxA2 + 1,
    };
  }

  // 4. Quét chính xác qua tất cả thang lương NĐ 204 với dung sai nghiêm ngặt < 0.005
  // (Tránh hoàn toàn nhầm lẫn giữa 3.99 và 4.00, hay giữa 3.65 và 3.66)
  const order: (keyof typeof DECREE_204_SCALES)[] = [
    'A2.1', 'A1', 'A0', 'A2.1_440', 'A2.2', 'B', 'A3.1', 'A3.2', 'C1', 'C2', 'C3'
  ];

  for (const key of order) {
    const s = DECREE_204_SCALES[key];
    const idx = s.coefficients.findIndex(c => Math.abs(c - coeff) < 0.005);
    if (idx !== -1) {
      return { scale: s, step: idx + 1 };
    }
  }

  return undefined;
}

/**
 * Tự động tìm bậc lương (Step) dựa trên Hệ số lương (theo Nghị định 204/2004/NĐ-CP)
 */
export function findStepByCoefficient(
  gradeCodeOrName: string,
  coefficient: number
): { step: number; matchedGrade?: SalaryGrade; scaleName?: string } {
  if (!coefficient || isNaN(coefficient)) {
    return { step: 1 };
  }

  const resolved = resolveDecree204Scale(gradeCodeOrName, coefficient);
  if (resolved) {
    return {
      step: resolved.step,
      scaleName: `${resolved.scale.id} (${resolved.scale.name})`,
    };
  }

  // Fallback nếu hệ số tùy chỉnh không nằm trong bảng chuẩn
  if (coefficient >= 4.00) {
    const stepA2 = Math.round((coefficient - 4.00) / 0.34) + 1;
    if (stepA2 >= 1 && stepA2 <= 8) {
      return { step: stepA2, scaleName: 'Loại A2.1 (ước tính)' };
    }
  } else if (coefficient >= 2.34) {
    const stepA1 = Math.round((coefficient - 2.34) / 0.33) + 1;
    if (stepA1 >= 1 && stepA1 <= 12) {
      return { step: stepA1, scaleName: 'Loại A1 (ước tính)' };
    }
  } else if (coefficient >= 1.86) {
    const stepB = Math.round((coefficient - 1.86) / 0.20) + 1;
    if (stepB >= 1 && stepB <= 12) {
      return { step: stepB, scaleName: 'Loại B (ước tính)' };
    }
  }

  return { step: 1 };
}

/**
 * Tra cứu bậc và hệ số kế tiếp chuẩn xác theo Nghị định 204/2004/NĐ-CP
 */
export function getNextStepAndCoefficient(
  gradeCodeOrName: string,
  currentStep: number,
  currentCoeff: number
): {
  nextStep: number;
  nextCoeff: number;
  isMaxStep: boolean;
  maxStepNumber: number;
  stepDifference: number;
  scaleId?: string;
} {
  const resolved = resolveDecree204Scale(gradeCodeOrName, currentCoeff);

  if (resolved) {
    const { scale } = resolved;
    const actualStep = currentStep || resolved.step;
    const isMax = actualStep >= scale.maxStep;
    const nextStep = isMax ? actualStep : actualStep + 1;
    const nextCoeffFromScale = scale.coefficients[nextStep - 1];

    const nextCoeff = nextCoeffFromScale !== undefined
      ? nextCoeffFromScale
      : Number((currentCoeff + 0.34).toFixed(2));

    const diff = Number((nextCoeff - currentCoeff).toFixed(2));

    return {
      nextStep,
      nextCoeff,
      isMaxStep: isMax,
      maxStepNumber: scale.maxStep,
      stepDifference: diff,
      scaleId: scale.id,
    };
  }

  // Nếu ngạch tự do và không khớp hoàn toàn với bảng lương mẫu
  const isLikelyA2 = [4.00, 4.34, 4.68, 5.02, 5.36, 5.70, 6.04, 6.38, 4.40, 4.74, 5.08, 5.42].some(c => Math.abs(c - currentCoeff) < 0.005);
  const isLikelyA0 = [2.10, 2.41, 2.72, 3.03, 3.34, 3.65, 3.96, 4.27, 4.58, 4.89].some(c => Math.abs(c - currentCoeff) < 0.005);
  const isLikelyB = [1.86, 2.06, 2.26, 2.46, 2.66, 2.86, 3.06, 3.26, 3.46, 3.66, 3.86, 4.06].some(c => Math.abs(c - currentCoeff) < 0.005);

  const stepDiff = isLikelyA2 ? 0.34 : isLikelyA0 ? 0.31 : isLikelyB ? 0.20 : 0.33;
  const nextStep = currentStep + 1;
  const nextCoeff = Number((currentCoeff + stepDiff).toFixed(2));

  return {
    nextStep,
    nextCoeff,
    isMaxStep: false,
    maxStepNumber: isLikelyA2 ? 8 : 10,
    stepDifference: stepDiff,
  };
}

/**
 * Tự động xác định chu kỳ giữ bậc lương (số tháng) căn cứ theo Thông tư số 08/2013/TT-BNV:
 * - Điểm a Khoản 1 Điều 2: Chuyên gia cao cấp (>= 8.80) -> 60 tháng (5 năm)
 * - Điểm b Khoản 1 Điều 2: Các ngạch/chức danh có yêu cầu trình độ đào tạo từ cao đẳng trở lên (Loại A3, A2, A1, A0) -> 36 tháng (3 năm)
 * - Điểm c Khoản 1 Điều 2: Các ngạch/chức danh có yêu cầu trình độ đào tạo từ trung cấp trở xuống (Loại B, C) -> 24 tháng (2 năm)
 */
export function determineCycleMonthsByCoefficient(
  gradeCodeOrName: string,
  coefficient: number
): {
  cycleMonths: number;
  legalBasis: string;
  categoryName: string;
} {
  const coeff = Number(coefficient);

  // 1. Chuyên gia cao cấp (khởi điểm 8.80 trở lên)
  if (coeff >= 8.80) {
    return {
      cycleMonths: 60,
      legalBasis: 'Điểm a Khoản 1 Điều 2 TT 08/2013 (Chuyên gia cao cấp)',
      categoryName: 'Chuyên gia cao cấp (60 tháng)',
    };
  }

  // 2. Thử đối chiếu với thang bảng lương Nghị định 204
  const resolved = resolveDecree204Scale(gradeCodeOrName, coeff);
  if (resolved) {
    const scale = resolved.scale;
    if (['A3.1', 'A3.2', 'A2.1', 'A2.2', 'A1', 'A0'].includes(scale.group)) {
      return {
        cycleMonths: 36,
        legalBasis: 'Điểm b Khoản 1 Điều 2 TT 08/2013 (Trình độ từ cao đẳng trở lên)',
        categoryName: `Trình độ từ CĐ trở lên (Loại ${scale.group}) - 36 tháng`,
      };
    }
    if (['B', 'C1', 'C2', 'C3'].includes(scale.group)) {
      return {
        cycleMonths: 24,
        legalBasis: 'Điểm c Khoản 1 Điều 2 TT 08/2013 (Trình độ từ trung cấp trở xuống)',
        categoryName: `Trình độ từ trung cấp trở xuống (Loại ${scale.group}) - 24 tháng`,
      };
    }
  }

  // 3. Fallback theo mức hệ số lương:
  if (coeff >= 2.10) {
    return {
      cycleMonths: 36,
      legalBasis: 'Điểm b Khoản 1 Điều 2 TT 08/2013 (Trình độ từ cao đẳng trở lên)',
      categoryName: 'Trình độ từ cao đẳng trở lên - 36 tháng',
    };
  }

  return {
    cycleMonths: 24,
    legalBasis: 'Điểm c Khoản 1 Điều 2 TT 08/2013 (Trình độ từ trung cấp trở xuống)',
    categoryName: 'Trình độ từ trung cấp trở xuống - 24 tháng',
  };
}
