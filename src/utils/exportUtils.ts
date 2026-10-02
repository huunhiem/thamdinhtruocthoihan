import { AppraisalRecord, AppraisalResult } from '../types/salary';
import { findStepByCoefficient, determineCycleMonthsByCoefficient } from '../data/salaryScales';

/**
 * Xuất dữ liệu thẩm định ra tệp CSV hỗ trợ tiếng Việt có dấu (UTF-8 BOM)
 * Tương thích 100% với Microsoft Excel
 */
export function exportAppraisalsToCSV(
  records: AppraisalRecord[],
  results: Map<string, AppraisalResult>,
  unitName: string = 'UBND XÃ PHÚ HỒ',
  departmentName: string = 'PHÒNG VĂN HÓA - XÃ HỘI',
  reviewYear: number = 2026,
  reviewRound: number = 2
) {
  const headers = [
    'STT',
    'Ông/Bà',
    'Họ và tên',
    'Giới tính',
    'Chức vụ',
    'Đơn vị công tác',
    'Tên ngạch / Chức danh',
    'Mã số ngạch / CDNN',
    'Bậc lương hiện hưởng',
    'Hệ số lương hiện hưởng',
    'Ngày hưởng lương gần nhất',
    'Bậc lương sau nâng',
    'Hệ số lương sau nâng',
    'Ngày hưởng lương sau nâng',
    'Số tháng nâng trước thời hạn',
    'Thành tích xuất sắc',
    'Ngày ký QĐ thành tích',
    'Kết quả thẩm định',
    'Chi tiết thẩm định / Lý do',
  ];

  const rows = records.map((rec, index) => {
    const res = results.get(rec.id);
    const lastPromoFormatted = rec.lastPromotionDate
      ? rec.lastPromotionDate.split('-').reverse().join('/')
      : '';
    const decisionDateFormatted = rec.achievementDecisionDate
      ? (rec.achievementDecisionDate.includes('-')
          ? rec.achievementDecisionDate.split('-').reverse().join('/')
          : rec.achievementDecisionDate)
      : '';
    const newEffectiveDate = res ? res.newEffectiveDate : '';
    const newStep = res ? res.newStep : '';
    const newCoeff = res ? res.newCoefficient.toFixed(2) : '';
    const eligibilityStatus = res
      ? res.isEligible
        ? 'ĐỦ ĐIỀU KIỆN'
        : 'KHÔNG ĐỦ ĐIỀU KIỆN'
      : '';
    const reason = res ? res.summaryReason.replace(/"/g, '""') : '';

    return [
      rec.orderNumber || index + 1,
      `"${rec.salutation || ''}"`,
      `"${rec.fullName || ''}"`,
      `"${rec.gender || ''}"`,
      `"${rec.position || ''}"`,
      `"${rec.department || ''}"`,
      `"${rec.gradeTitle || ''}"`,
      `"${rec.gradeCode || ''}"`,
      rec.currentStep,
      rec.currentCoefficient.toFixed(2),
      `"${lastPromoFormatted}"`,
      newStep,
      newCoeff,
      `"${newEffectiveDate}"`,
      rec.requestedMonths || 9,
      `"${(rec.achievementTitle || '').replace(/"/g, '""')}"`,
      `"${decisionDateFormatted}"`,
      `"${eligibilityStatus}"`,
      `"${reason}"`,
    ].join(',');
  });

  // UTF-8 BOM '\uFEFF' để Excel mở không bị lỗi font tiếng Việt
  const titleLine = `"${unitName.replace(/"/g, '""')} - ${departmentName.replace(/"/g, '""')}"`;
  const subTitleLine = `"DANH SÁCH THẨM ĐỊNH NÂNG LƯƠNG TRƯỚC THỜI HẠN, ĐỢT ${reviewRound} NĂM ${reviewYear}"`;
  const emptyLine = '';

  const csvContent =
    '\uFEFF' +
    [titleLine, subTitleLine, emptyLine, headers.join(','), ...rows].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute(
    'download',
    `Tham_Dinh_Nang_Luong_TTH_Dot_${reviewRound}_Nam_${reviewYear}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Xuất dữ liệu thẩm định dưới dạng bảng tính Excel (.xls) có định dạng bảng chuẩn
 */
export function exportAppraisalsToExcelTable(
  records: AppraisalRecord[],
  results: Map<string, AppraisalResult>,
  unitName: string = 'UBND XÃ PHÚ HỒ',
  departmentName: string = 'PHÒNG VĂN HÓA - XÃ HỘI',
  reviewYear: number = 2026,
  reviewRound: number = 2
) {
  let tableRows = '';
  records.forEach((rec, idx) => {
    const res = results.get(rec.id);
    const isEligible = res ? res.isEligible : false;
    const lastPromoFormatted = rec.lastPromotionDate
      ? rec.lastPromotionDate.split('-').reverse().join('/')
      : '';
    const decisionDateFormatted = rec.achievementDecisionDate
      ? (rec.achievementDecisionDate.includes('-')
          ? rec.achievementDecisionDate.split('-').reverse().join('/')
          : rec.achievementDecisionDate)
      : '';
    const newEffectiveDate = res ? res.newEffectiveDate : '';
    const newStep = res ? res.newStep : '';
    const newCoeff = res ? res.newCoefficient.toFixed(2) : '';

    tableRows += `
      <tr>
        <td style="text-align: center;">${rec.orderNumber || idx + 1}</td>
        <td style="text-align: center;">${rec.salutation || ''}</td>
        <td style="font-weight: 500;">${rec.fullName}</td>
        <td style="text-align: center;">${rec.gender === 'Nam' ? 'x' : ''}</td>
        <td style="text-align: center;">${rec.gender === 'Nữ' ? 'x' : ''}</td>
        <td>${rec.position}</td>
        <td>${rec.department}</td>
        <td>${rec.gradeTitle}</td>
        <td style="text-align: center;">${rec.gradeCode}</td>
        <td style="text-align: center;">${rec.currentStep}</td>
        <td style="text-align: right;">${rec.currentCoefficient.toFixed(2)}</td>
        <td style="text-align: center;">${lastPromoFormatted}</td>
        <td style="text-align: center; font-weight: bold; background: #e0f2fe;">${newStep}</td>
        <td style="text-align: right; font-weight: bold; background: #e0f2fe;">${newCoeff}</td>
        <td style="text-align: center; font-weight: bold; background: #e0f2fe;">${newEffectiveDate}</td>
        <td style="text-align: center;">${rec.requestedMonths || 9}</td>
        <td>${rec.achievementTitle || ''}</td>
        <td style="text-align: center;">${decisionDateFormatted}</td>
        <td style="text-align: center; font-weight: bold; color: ${
          isEligible ? '#059669' : '#dc2626'
        }; background: ${isEligible ? '#ecfdf5' : '#fef2f2'};">
          ${isEligible ? 'ĐỦ ĐIỀU KIỆN' : 'KHÔNG ĐỦ ĐIỀU KIỆN'}
        </td>
        <td>${res ? res.summaryReason : ''}</td>
      </tr>
    `;
  });

  const template = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office"
          xmlns:x="urn:schemas-microsoft-com:office:excel"
          xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>Thẩm định Nâng lương TTH</x:Name>
              <x:WorksheetOptions>
                <x:DisplayGridlines/>
              </x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
      <style>
        table { border-collapse: collapse; width: 100%; font-family: 'Times New Roman', serif; font-size: 11pt; }
        th, td { border: 1px solid #333333; padding: 6px; }
        th { background-color: #f1f5f9; text-align: center; font-weight: bold; }
        .header-title { font-size: 14pt; font-weight: bold; text-align: center; }
        .sub-header { font-size: 11pt; text-align: center; }
      </style>
    </head>
    <body>
      <table style="border: none; margin-bottom: 20px;">
        <tr style="border: none;">
          <td colspan="5" style="border: none; text-align: center; font-weight: bold;">
            ${unitName.toUpperCase()}<br/>
            ${departmentName.toUpperCase()}
          </td>
          <td colspan="4" style="border: none;"></td>
          <td colspan="9" style="border: none; text-align: center; font-weight: bold;">
            CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM<br/>
            Độc lập - Tự do - Hạnh phúc
          </td>
        </tr>
      </table>

      <div class="header-title" style="margin-top: 15px; margin-bottom: 5px;">
        DANH SÁCH THẨM ĐỊNH NÂNG BẬC LƯƠNG TRƯỚC THỜI HẠN
      </div>
      <div class="sub-header" style="margin-bottom: 15px;">
        Đợt ${reviewRound} năm ${reviewYear} (Theo Thông tư 08/2013/TT-BNV, Thông tư 03/2021/TT-BNV, Nghị định 204/2004/NĐ-CP)
      </div>

      <table>
        <thead>
          <tr>
            <th rowspan="2">TT</th>
            <th rowspan="2">Ông/<br/>Bà</th>
            <th rowspan="2">Họ và tên</th>
            <th colspan="2">Giới tính</th>
            <th rowspan="2">Chức vụ</th>
            <th rowspan="2">Đơn vị công tác</th>
            <th rowspan="2">Tên ngạch</th>
            <th rowspan="2">Mã số ngạch/<br/>CDNN</th>
            <th colspan="3">Ngạch, bậc, hệ số lương đang hưởng</th>
            <th colspan="4">Kết quả đề nghị nâng bậc lương</th>
            <th rowspan="2">Thành tích đạt được</th>
            <th rowspan="2">Ngày ký QĐ<br/>thành tích</th>
            <th rowspan="2">Kết quả thẩm định</th>
            <th rowspan="2">Lý do / Căn cứ</th>
          </tr>
          <tr>
            <th>Nam</th>
            <th>Nữ</th>
            <th>Bậc</th>
            <th>Hệ số</th>
            <th>Ngày, tháng, năm</th>
            <th>Bậc</th>
            <th>Hệ số</th>
            <th>Ngày, tháng, năm</th>
            <th>Số tháng TTH</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob([template], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute(
    'download',
    `Tong_Hop_Tham_Dinh_TTH_${reviewYear}_Dot_${reviewRound}.xls`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Phân tích dữ liệu paste trực tiếp từ bảng tính Excel hoặc file CSV
 */
export function parseSpreadsheetText(text: string): Partial<AppraisalRecord>[] {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length === 0) return [];

  const results: Partial<AppraisalRecord>[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Phân tách bằng tab (nếu copy từ Excel) hoặc dấu phẩy / chấm phẩy (nếu CSV)
    let cells: string[] = [];
    if (line.includes('\t')) {
      cells = line.split('\t');
    } else if (line.includes(',')) {
      cells = line.split(',').map(c => c.replace(/^"|"$/g, '').trim());
    } else if (line.includes(';')) {
      cells = line.split(';').map(c => c.replace(/^"|"$/g, '').trim());
    } else {
      continue;
    }

    // Bỏ qua dòng tiêu đề nếu chứa chữ "Họ và tên" hoặc "STT"
    if (cells.some(c => c.toLowerCase().includes('họ và tên') || c.toLowerCase().includes('mã số ngạch'))) {
      continue;
    }

    // Dự kiến các cột theo mẫu TONG HOP_TTH
    // 0: TT, 1: Ông/Bà, 2: Họ và tên, 3: Nam, 4: Nữ, 5: Chức vụ, 6: Đơn vị, 7: Tên ngạch, 8: Mã ngạch, 9: Bậc, 10: Hệ số, 11: Ngày hưởng, 12: Bậc mới, 13: Hệ số mới, 14: Ngày mới, 15: Số tháng TTH, 16: Thành tích
    const orderNum = parseInt(cells[0], 10);
    const salutation = cells[1]?.trim() === 'Ông' ? 'Ông' : 'Bà';
    const fullName = cells[2]?.trim() || (isNaN(orderNum) ? cells[0] : cells[1]);
    if (!fullName) continue;

    const isMale = cells[3]?.trim().toLowerCase() === 'x' || cells[3]?.trim() === '1';
    const position = cells[5]?.trim() || '';
    const department = cells[6]?.trim() || '';
    const gradeTitle = cells[7]?.trim() || '';
    const gradeCode = cells[8]?.trim() || '';
    const currentStep = parseInt(cells[9], 10) || 1;
    const currentCoeff = parseFloat(cells[10]?.replace(',', '.')) || 2.34;
    
    // Xử lý ngày: dạng DD/MM/YYYY -> YYYY-MM-DD
    let lastDate = '2024-01-01';
    if (cells[11]) {
      const dateParts = cells[11].replace('//', '/').trim().split(/[/.-]/);
      if (dateParts.length === 3) {
        const d = dateParts[0].padStart(2, '0');
        const m = dateParts[1].padStart(2, '0');
        const y = dateParts[2].length === 2 ? `20${dateParts[2]}` : dateParts[2];
        lastDate = `${y}-${m}-${d}`;
      }
    }

    const requestedMonths = parseInt(cells[15], 10) || 9;
    const achievement = cells[16]?.trim() || '';

    // Xử lý Ngày ký QĐ thành tích (cột 17): DD/MM/YYYY -> YYYY-MM-DD
    let decisionDate = '2023-06-30';
    if (cells[17] && cells[17].trim() !== '-' && cells[17].trim() !== '') {
      const qdParts = cells[17].replace('//', '/').trim().split(/[/.-]/);
      if (qdParts.length === 3) {
        if (qdParts[0].length === 4) {
          decisionDate = `${qdParts[0]}-${qdParts[1].padStart(2, '0')}-${qdParts[2].padStart(2, '0')}`;
        } else {
          const d = qdParts[0].padStart(2, '0');
          const m = qdParts[1].padStart(2, '0');
          const y = qdParts[2].length === 2 ? `20${qdParts[2]}` : qdParts[2];
          decisionDate = `${y}-${m}-${d}`;
        }
      }
    }

    // Tự động suy ra Bậc lương theo Nghị định 204 nếu Bậc bị trống hoặc sai
    let step = currentStep;
    if (!step || isNaN(step) || step <= 0) {
      const detected = findStepByCoefficient(gradeCode || gradeTitle, currentCoeff);
      step = detected.step;
    }

    // Tự động xác định chu kỳ giữ bậc theo Thông tư 08
    const cycle = determineCycleMonthsByCoefficient(gradeCode || gradeTitle, currentCoeff).cycleMonths;

    results.push({
      orderNumber: !isNaN(orderNum) ? orderNum : i + 1,
      salutation,
      fullName,
      gender: isMale ? 'Nam' : 'Nữ',
      position,
      department,
      gradeTitle,
      gradeCode,
      regularCycleMonths: cycle,
      currentStep: step,
      currentCoefficient: currentCoeff,
      lastPromotionDate: lastDate,
      requestedMonths,
      achievementTitle: achievement,
      achievementDecisionDate: decisionDate,
      annualRating: 'hoan_thanh_tot',
      isDisciplined: false,
      disciplineMonthsExtended: 0,
      isConsecutivePremature: false,
      hasPreviousTTH: false,
      reviewYear: 2026,
    });
  }

  return results;
}
