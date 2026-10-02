import React, { useState } from 'react';
import { AppraisalRecord } from '../types/salary';
import { parseSpreadsheetText } from '../utils/exportUtils';
import { X, Upload, Clipboard, Check, FileDown, AlertCircle, Sparkles } from 'lucide-react';

interface ImportPasteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (newRecords: AppraisalRecord[]) => void;
  currentCount: number;
}

export const ImportPasteModal: React.FC<ImportPasteModalProps> = ({
  isOpen,
  onClose,
  onImport,
  currentCount,
}) => {
  if (!isOpen) return null;

  const [pastedText, setPastedText] = useState('');
  const [importMode, setImportMode] = useState<'replace' | 'append'>('append');
  const [previewRecords, setPreviewRecords] = useState<Partial<AppraisalRecord>[]>([]);
  const [errorMsg, setErrorMsg] = useState('');

  const handleParse = (text: string) => {
    setPastedText(text);
    setErrorMsg('');
    if (!text.trim()) {
      setPreviewRecords([]);
      return;
    }

    try {
      const parsed = parseSpreadsheetText(text);
      if (parsed.length === 0) {
        setErrorMsg('Không tìm thấy dòng dữ liệu hợp lệ. Vui lòng kiểm tra lại định dạng copy/paste.');
      } else {
        setPreviewRecords(parsed);
      }
    } catch (err: any) {
      setErrorMsg(`Lỗi phân tích: ${err?.message || 'Định dạng không hợp lệ'}`);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      handleParse(content);
    };
    reader.readAsText(file);
  };

  const handleConfirmImport = () => {
    if (previewRecords.length === 0) return;

    const startingOrder = importMode === 'append' ? currentCount + 1 : 1;

    const fullRecords: AppraisalRecord[] = previewRecords.map((item, idx) => ({
      id: `imported-${Date.now()}-${idx}`,
      orderNumber: startingOrder + idx,
      salutation: item.salutation || 'Bà',
      fullName: item.fullName || `Cán bộ ${idx + 1}`,
      gender: item.gender || 'Nữ',
      position: item.position || 'Giáo viên',
      department: item.department || 'Đơn vị',
      gradeTitle: item.gradeTitle || 'Giáo viên mầm non',
      gradeCode: item.gradeCode || 'V.07.02.25',
      regularCycleMonths: item.regularCycleMonths || 36,
      currentStep: item.currentStep || 1,
      currentCoefficient: item.currentCoefficient || 2.34,
      lastPromotionDate: item.lastPromotionDate || '2024-01-01',
      annualRating: item.annualRating || 'hoan_thanh_tot',
      isDisciplined: item.isDisciplined || false,
      disciplineMonthsExtended: item.disciplineMonthsExtended || 0,
      isConsecutivePremature: item.isConsecutivePremature || false,
      hasPreviousTTH: item.hasPreviousTTH || false,
      achievementTitle: item.achievementTitle || 'CSTĐCS',
      achievementDecisionNumber: item.achievementDecisionNumber || 'QĐ khen thưởng',
      achievementDecisionDate: item.achievementDecisionDate || '2023-06-30',
      requestedMonths: item.requestedMonths || 9,
      reviewYear: item.reviewYear || 2026,
      notes: '',
    }));

    onImport(fullRecords);
    onClose();
  };

  // Mẫu chuỗi chuẩn 18 cột theo đúng mẫu TONG HOP_TTH
  const sampleTemplateRow = `1\tBà\tNguyễn Thị Mai\t\tx\tPhó Hiệu trưởng\tTrường Mầm non Phú Xuân\tGiáo viên mầm non hạng II\tV.07.02.25\t5\t3.66\t01/07/2024\t6\t3.99\t01/10/2026\t9\tCSTĐCS 2022-2023\t30/06/2023`;

  // Tải file mẫu Excel chuẩn 18 cột
  const handleDownloadSample = () => {
    const headers = [
      'TT',
      'Ông/Bà',
      'Họ và tên',
      'Nam',
      'Nữ',
      'Chức vụ',
      'Đơn vị công tác',
      'Tên ngạch',
      'Mã số ngạch/CDNN',
      'Bậc đang hưởng',
      'Hệ số đang hưởng',
      'Ngày hưởng',
      'Bậc sau nâng',
      'Hệ số sau nâng',
      'Ngày hưởng sau nâng',
      'Số tháng TTH',
      'Thành tích đạt được',
      'Ngày ký QĐ thành tích',
    ].join('\t');

    const row1 = [
      '1',
      'Bà',
      'Nguyễn Thị Bích Diễm',
      '',
      'x',
      'Phó Hiệu trưởng',
      'Trường Mầm non Phú Xuân',
      'Giáo viên mầm non hạng II',
      'V.07.02.25',
      '5',
      '3.66',
      '01/07/2024',
      '6',
      '3.99',
      '01/10/2026',
      '9',
      'CSTĐCS 2022-2023',
      '30/06/2023',
    ].join('\t');

    const row2 = [
      '2',
      'Bà',
      'Dương Thị Thìn',
      '',
      'x',
      'Kế toán',
      'Trường Mầm non Phú Xuân',
      'Kế toán viên trung cấp',
      'V.06.032',
      '5',
      '3.34',
      '15/09/2024',
      '6',
      '3.65',
      '15/12/2026',
      '9',
      'CSTĐCS 2021-2022',
      '25/06/2022',
    ].join('\t');

    const content = '\uFEFF' + [headers, row1, row2].join('\r\n');
    const blob = new Blob([content], { type: 'text/tab-separated-values;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Mau_Nhap_Nang_Luong_TTH_18_Cot.xls';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clipboard className="w-5 h-5 text-red-400" />
            <div>
              <h3 className="font-bold text-base">Nhập Dữ Liệu Từ Excel / CSV</h3>
              <p className="text-[11px] text-slate-300">
                Đồng bộ đầy đủ 18 cột theo mẫu chuẩn TONG HOP_TTH (bao gồm cột Ngày ký QĐ thành tích)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5 text-blue-900 space-y-1.5">
            <span className="font-bold block flex items-center gap-1.5 text-blue-950">
              <Sparkles className="w-4 h-4 text-blue-700" />
              Hướng dẫn sao chép / dán từ bảng tính Excel:
            </span>
            <p>
              1. Bạn có thể mở bảng tính Excel hoặc file mẫu TONG HOP_TTH, bôi đen các dòng dữ liệu (không cần bôi hàng tiêu đề) và nhấn <strong>Ctrl+C</strong>, sau đó nhấn <strong>Ctrl+V</strong> vào ô bên dưới.
            </p>
            <p>
              2. <strong>Thứ tự 18 cột chuẩn:</strong> STT | Ông/Bà | Họ và tên | Nam | Nữ | Chức vụ | Đơn vị | Tên ngạch | Mã số ngạch | Bậc hiện hưởng | Hệ số | Ngày hưởng | Bậc đề nghị | Hệ số đề nghị | Ngày hưởng mới | Số tháng TTH | <strong>Thành tích đạt được</strong> | <strong>Ngày ký QĐ thành tích</strong>.
            </p>
            <p className="text-blue-800 italic">
              * Hệ thống tự động xác định lại Bậc lương theo Nghị định 204 và Chu kỳ giữ bậc theo Thông tư 08 nếu trong file bị khuyết hoặc chưa chính xác.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 px-3 py-1.5 border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer font-semibold text-slate-700">
                <Upload className="w-4 h-4 text-red-700" />
                <span>Chọn tệp tin Excel / CSV</span>
                <input
                  type="file"
                  accept=".csv,.txt,.tsv,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={handleDownloadSample}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold border border-slate-300"
                title="Tải tệp bảng tính mẫu có sẵn tiêu đề 18 cột để điền dữ liệu"
              >
                <FileDown className="w-3.5 h-3.5 text-emerald-700" />
                <span>Tải bảng mẫu Excel</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => handleParse(sampleTemplateRow)}
              className="text-red-700 hover:underline font-semibold flex items-center gap-1"
            >
              <span>Dán thử 1 dòng mẫu chuẩn</span>
            </button>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Dán trực tiếp dữ liệu từ Excel / Google Sheets vào đây (Ctrl+V):
            </label>
            <textarea
              rows={6}
              value={pastedText}
              onChange={(e) => handleParse(e.target.value)}
              placeholder="Dán các cột dữ liệu theo thứ tự: STT | Ông/Bà | Họ và tên | Nam | Nữ | Chức vụ | Đơn vị | Tên ngạch | Mã ngạch | Bậc | Hệ số | Ngày hưởng | Bậc mới | Hệ số mới | Ngày mới | Số tháng TTH | Thành tích đạt được | Ngày ký QĐ thành tích..."
              className="w-full font-mono text-xs border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-red-600"
            />
          </div>

          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {previewRecords.length > 0 && (
            <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50 space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="font-bold text-slate-900">
                  Xem trước: Tìm thấy {previewRecords.length} hồ sơ hợp lệ
                </span>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700">
                    <input
                      type="radio"
                      name="importMode"
                      value="append"
                      checked={importMode === 'append'}
                      onChange={() => setImportMode('append')}
                    />
                    <span>Thêm tiếp vào danh sách ({currentCount} người hiện có)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700">
                    <input
                      type="radio"
                      name="importMode"
                      value="replace"
                      checked={importMode === 'replace'}
                      onChange={() => setImportMode('replace')}
                    />
                    <span>Thay thế toàn bộ</span>
                  </label>
                </div>
              </div>

              <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-lg bg-white">
                <table className="w-full text-[11px] text-left border-collapse">
                  <thead className="bg-slate-100 border-b border-slate-200 font-bold text-slate-800 sticky top-0">
                    <tr>
                      <th className="p-1.5 text-center w-8">TT</th>
                      <th className="p-1.5 min-w-[130px]">Họ và tên</th>
                      <th className="p-1.5 min-w-[120px]">Đơn vị</th>
                      <th className="p-1.5 min-w-[90px]">Mã ngạch</th>
                      <th className="p-1.5 text-center w-24">Bậc / Hệ số</th>
                      <th className="p-1.5 text-center w-20">Ngày hưởng</th>
                      <th className="p-1.5 text-center w-16">Số tháng</th>
                      <th className="p-1.5 min-w-[130px]">Thành tích đạt được</th>
                      <th className="p-1.5 text-center min-w-[95px] bg-red-50 text-red-950">
                        Ngày ký QĐ
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {previewRecords.map((r, i) => {
                      const promoStr = r.lastPromotionDate
                        ? (r.lastPromotionDate.includes('-')
                            ? r.lastPromotionDate.split('-').reverse().join('/')
                            : r.lastPromotionDate)
                        : '';
                      const qdStr = r.achievementDecisionDate
                        ? (r.achievementDecisionDate.includes('-')
                            ? r.achievementDecisionDate.split('-').reverse().join('/')
                            : r.achievementDecisionDate)
                        : '-';

                      return (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="p-1.5 text-center text-slate-600">{i + 1}</td>
                          <td className="p-1.5 font-bold text-slate-900">{r.fullName}</td>
                          <td className="p-1.5 text-slate-700">{r.department}</td>
                          <td className="p-1.5 font-mono text-slate-700">{r.gradeCode || r.gradeTitle}</td>
                          <td className="p-1.5 text-center">
                            Bậc {r.currentStep} ({r.currentCoefficient?.toFixed(2)})
                          </td>
                          <td className="p-1.5 text-center font-mono text-slate-600">{promoStr}</td>
                          <td className="p-1.5 text-center font-semibold text-slate-800">
                            {r.requestedMonths || 9}
                          </td>
                          <td className="p-1.5 text-slate-800 font-medium">{r.achievementTitle}</td>
                          <td className="p-1.5 text-center font-mono font-semibold text-red-700 bg-red-50/50">
                            {qdStr}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            {previewRecords.length > 0
              ? `Đã nhận diện thành công ${previewRecords.length} dòng dữ liệu.`
              : 'Chưa có dữ liệu nào được dán.'}
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-medium hover:bg-slate-100"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleConfirmImport}
              disabled={previewRecords.length === 0}
              className={`px-5 py-2 rounded-xl font-bold flex items-center gap-1.5 text-white ${
                previewRecords.length > 0
                  ? 'bg-red-700 hover:bg-red-800 shadow-xs cursor-pointer'
                  : 'bg-slate-400 cursor-not-allowed'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>Xác Nhận Nhập ({previewRecords.length} hồ sơ)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
