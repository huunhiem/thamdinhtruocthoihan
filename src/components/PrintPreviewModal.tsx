import React, { useRef, useState } from 'react';
import { AppraisalRecord, AppraisalResult } from '../types/salary';
import { X, Printer, FileText, Download, Check, ExternalLink } from 'lucide-react';

interface PrintPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'tong_hop' | 'mau_01';
  records: AppraisalRecord[];
  results: Map<string, AppraisalResult>;
  unitName: string;
  departmentName: string;
  reviewYear: number;
  reviewRound: number;
}

export const PrintPreviewModal: React.FC<PrintPreviewModalProps> = ({
  isOpen,
  onClose,
  mode: initialMode,
  records,
  results,
  unitName,
  departmentName,
  reviewYear,
  reviewRound,
}) => {
  const [currentMode, setCurrentMode] = useState<'tong_hop' | 'mau_01'>(initialMode);
  const printAreaRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  // Xử lý in trực tiếp 100% chuẩn xác qua iframe in chuyên dụng
  const handlePrint = () => {
    if (!printAreaRef.current) {
      window.print();
      return;
    }

    const content = printAreaRef.current.innerHTML;

    // Xóa iframe in cũ nếu tồn tại
    const oldFrame = document.getElementById('direct-print-frame');
    if (oldFrame) {
      oldFrame.remove();
    }

    // Tạo iframe ẩn chuyên dụng để in độc lập
    const iframe = document.createElement('iframe');
    iframe.id = 'direct-print-frame';
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.style.visibility = 'hidden';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (!doc) {
      window.print();
      return;
    }

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html lang="vi">
      <head>
        <meta charset="utf-8">
        <title>In - Danh sách đề nghị nâng lương trước thời hạn</title>
        <style>
          @page {
            size: A4 landscape;
            margin: 10mm 10mm 10mm 10mm;
          }
          * {
            box-sizing: border-box;
          }
          body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 10pt;
            color: #000;
            background: #fff;
            margin: 0;
            padding: 8px;
            line-height: 1.3;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 9pt;
            margin-top: 8px;
          }
          th, td {
            border: 1px solid #000;
            padding: 3px 5px;
            vertical-align: middle;
          }
          th {
            background-color: #f1f5f9 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            text-align: center;
            font-weight: bold;
          }
          .text-center { text-align: center; }
          .text-right { text-align: right; }
          .font-bold { font-weight: bold; }
          .font-mono { font-family: monospace; }
          .uppercase { text-transform: uppercase; }
          .italic { font-style: italic; }
          .grid { display: flex; justify-content: space-between; align-items: flex-start; }
          .col-span-5 { width: 42%; text-align: center; }
          .col-span-7 { width: 55%; text-align: center; }
          .w-24 { width: 96px; }
          .w-36 { width: 144px; }
          .h-0\\.5 { height: 2px; }
          .bg-slate-800 { background-color: #1e293b; }
          .mx-auto { margin-left: auto; margin-right: auto; }
          .mt-1 { margin-top: 4px; }
          .my-6 { margin-top: 18px; margin-bottom: 18px; }
          .mt-4 { margin-top: 14px; }
          .mt-8 { margin-top: 28px; }
          .text-sm { font-size: 11pt; }
          .text-xs { font-size: 9pt; }
          .text-base { font-size: 13pt; }
          .tracking-wide { letter-spacing: 0.02em; }
          .tracking-wider { letter-spacing: 0.04em; }
        </style>
      </head>
      <body>
        ${content}
      </body>
      </html>
    `);
    doc.close();

    // Kích hoạt hộp thoại in ngay lập tức
    setTimeout(() => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch (err) {
        console.warn('Lỗi iframe print, chuyển sang window.print():', err);
        window.print();
      }
    }, 250);
  };

  // Mở bản in độc lập trong tab mới và tự động bật hộp thoại in
  const handleOpenPrintWindow = () => {
    if (!printAreaRef.current) return;
    const content = printAreaRef.current.innerHTML;

    const printHtml = `
      <!DOCTYPE html>
      <html lang="vi">
      <head>
        <meta charset="utf-8">
        <title>In - Danh sách nâng lương trước thời hạn</title>
        <style>
          @page {
            size: A4 landscape;
            margin: 12mm 10mm 12mm 10mm;
          }
          body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 10pt;
            color: #000;
            background: #fff;
            margin: 0;
            padding: 15px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 9.5pt;
          }
          th, td {
            border: 1px solid #000;
            padding: 4px 6px;
          }
          th {
            background-color: #f3f4f6 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            text-align: center;
          }
          .no-print {
            display: none !important;
          }
          @media print {
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        ${content}
        <script>
          window.onload = function() {
            window.focus();
            window.print();
          };
        </script>
      </body>
      </html>
    `;

    const blob = new Blob([printHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  };

  // Tải tệp HTML in ấn về máy
  const handleDownloadPrintFile = () => {
    if (!printAreaRef.current) return;
    const content = printAreaRef.current.innerHTML;

    const printHtml = `
      <!DOCTYPE html>
      <html lang="vi">
      <head>
        <meta charset="utf-8">
        <title>Danh_sach_tham_dinh_TTH_${reviewYear}</title>
        <style>
          @page { size: A4 landscape; margin: 12mm; }
          body { font-family: 'Times New Roman', Times, serif; font-size: 10pt; color: #000; padding: 20px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #000; padding: 4px 6px; }
          th { background-color: #f3f4f6; text-align: center; }
        </style>
      </head>
      <body>
        ${content}
      </body>
      </html>
    `;

    const blob = new Blob([printHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Ban_In_Tham_Dinh_TTH_Dot_${reviewRound}_Nam_${reviewYear}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const eligibleRecords = records.filter((r) => results.get(r.id)?.isEligible);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-6xl overflow-hidden flex flex-col max-h-[96vh] print:max-h-none print:border-none print:shadow-none print:rounded-none">
        {/* Navigation Bar (Ẩn khi in ấn) */}
        <div className="bg-slate-900 text-white px-6 py-3 flex flex-wrap items-center justify-between gap-3 print:hidden border-b border-slate-800">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-red-400" />
            <div>
              <h3 className="font-bold text-sm">
                Xem Trước & Xuất Bản In Văn Bản Hành Chính
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => setCurrentMode('tong_hop')}
                  className={`px-2.5 py-0.5 rounded text-xs font-semibold transition-all cursor-pointer ${
                    currentMode === 'tong_hop'
                      ? 'bg-red-700 text-white'
                      : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  Mẫu TONG HOP_TTH
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentMode('mau_01')}
                  className={`px-2.5 py-0.5 rounded text-xs font-semibold transition-all cursor-pointer ${
                    currentMode === 'mau_01'
                      ? 'bg-red-700 text-white'
                      : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  Mẫu số 01 TT 08/2013
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Nút In trực tiếp */}
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              title="Kích hoạt hộp thoại In của trình duyệt"
            >
              <Printer className="w-4 h-4" />
              <span>In Ngay (Print)</span>
            </button>

            {/* Mở tab mới in */}
            <button
              type="button"
              onClick={handleOpenPrintWindow}
              className="px-3 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              title="Mở bản in toàn màn hình trong tab mới để in rõ ràng"
            >
              <ExternalLink className="w-4 h-4" />
              <span>In Tab Mới</span>
            </button>

            {/* Tải tệp HTML in */}
            <button
              type="button"
              onClick={handleDownloadPrintFile}
              className="px-3 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              title="Tải tệp HTML in ấn có sẵn định dạng bảng và chữ ký"
            >
              <Download className="w-4 h-4" />
              <span>Tải file in (.html)</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Area */}
        <div
          id="printable-content"
          ref={printAreaRef}
          className="p-8 sm:p-12 overflow-y-auto bg-white flex-1 font-serif text-slate-900 text-[11pt] leading-normal print:overflow-visible print:p-4 print-area"
          style={{ fontFamily: "'Times New Roman', Times, serif" }}
        >
          {/* Header Cơ quan & Quốc hiệu */}
          <div className="grid grid-cols-12 gap-4 text-center items-start pb-4 border-b border-slate-300">
            <div className="col-span-5 text-center">
              <div className="font-bold text-sm tracking-wide uppercase">{unitName || 'UBND XÃ PHÚ HỒ'}</div>
              <div className="font-bold text-xs uppercase text-slate-700">{departmentName || 'PHÒNG VĂN HÓA - XÃ HỘI'}</div>
              <div className="w-24 h-0.5 bg-slate-800 mx-auto mt-1"></div>
            </div>

            <div className="col-span-7 text-center">
              <div className="font-bold text-sm tracking-wide uppercase">
                CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
              </div>
              <div className="font-bold text-xs">Độc lập - Tự do - Hạnh phúc</div>
              <div className="w-36 h-0.5 bg-slate-800 mx-auto mt-1"></div>
            </div>
          </div>

          {/* Tiêu đề bảng */}
          <div className="text-center my-6">
            <h1 className="text-base font-bold uppercase tracking-wider">
              {currentMode === 'tong_hop'
                ? `DANH SÁCH ĐỀ NGHỊ NÂNG LƯƠNG TRƯỚC THỜI HẠN, ĐỢT ${reviewRound} NĂM ${reviewYear}`
                : `BÁO CÁO KẾT QUẢ THỰC HIỆN NÂNG BẬC LƯƠNG ĐỐI VỚI CÁN BỘ, CÔNG CHỨC, VIÊN CHỨC NĂM ${reviewYear}`}
            </h1>
            <p className="text-xs italic mt-1 text-slate-700">
              (Căn cứ Thông tư số 08/2013/TT-BNV, Thông tư số 03/2021/TT-BNV của Bộ Nội vụ và Nghị định số 204/2004/NĐ-CP)
            </p>
          </div>

          {/* Bảng Dữ Liệu In */}
          <div className="overflow-x-auto">
            <table className="w-full text-[10pt] border-collapse border border-slate-900 text-left">
              <thead>
                <tr className="bg-slate-100 text-center font-bold text-[9.5pt]">
                  <th rowSpan={2} className="border border-slate-900 p-1.5 w-8">
                    TT
                  </th>
                  <th rowSpan={2} className="border border-slate-900 p-1.5 w-10">
                    Ông/Bà
                  </th>
                  <th rowSpan={2} className="border border-slate-900 p-1.5 min-w-[120px]">
                    Họ và tên
                  </th>
                  <th colSpan={2} className="border border-slate-900 p-1">
                    Giới tính
                  </th>
                  <th rowSpan={2} className="border border-slate-900 p-1.5">
                    Chức vụ
                  </th>
                  <th rowSpan={2} className="border border-slate-900 p-1.5 min-w-[120px]">
                    Đơn vị công tác
                  </th>
                  <th rowSpan={2} className="border border-slate-900 p-1.5 min-w-[130px]">
                    Tên ngạch
                  </th>
                  <th rowSpan={2} className="border border-slate-900 p-1.5 w-18">
                    Mã số ngạch/CDNN
                  </th>
                  <th colSpan={3} className="border border-slate-900 p-1">
                    Ngạch, bậc, hệ số đang hưởng
                  </th>
                  <th colSpan={4} className="border border-slate-900 p-1">
                    Kết quả đề nghị nâng bậc lương
                  </th>
                  <th rowSpan={2} className="border border-slate-900 p-1.5 min-w-[110px]">
                    Thành tích đạt được
                  </th>
                  <th rowSpan={2} className="border border-slate-900 p-1.5 min-w-[85px]">
                    Ngày ký QĐ<br />thành tích
                  </th>
                  <th rowSpan={2} className="border border-slate-900 p-1.5 w-24">
                    Kết quả thẩm định
                  </th>
                </tr>
                <tr className="bg-slate-100 text-center font-semibold text-[9pt]">
                  <th className="border border-slate-900 p-1 w-6">Nam</th>
                  <th className="border border-slate-900 p-1 w-6">Nữ</th>
                  <th className="border border-slate-900 p-1 w-8">Bậc</th>
                  <th className="border border-slate-900 p-1 w-12">Hệ số</th>
                  <th className="border border-slate-900 p-1 w-20">Ngày hưởng</th>
                  <th className="border border-slate-900 p-1 w-8">Bậc</th>
                  <th className="border border-slate-900 p-1 w-12">Hệ số</th>
                  <th className="border border-slate-900 p-1 w-20">Ngày hưởng</th>
                  <th className="border border-slate-900 p-1 w-12">Số tháng</th>
                </tr>
              </thead>
              <tbody>
                {records.map((rec, idx) => {
                  const res = results.get(rec.id);
                  const isEligible = res ? res.isEligible : false;
                  const lastPromoStr = rec.lastPromotionDate
                    ? rec.lastPromotionDate.split('-').reverse().join('/')
                    : '';

                  return (
                    <tr key={rec.id} className="text-[9.5pt]">
                      <td className="border border-slate-900 p-1.5 text-center">
                        {rec.orderNumber || idx + 1}
                      </td>
                      <td className="border border-slate-900 p-1.5 text-center">
                        {rec.salutation || ''}
                      </td>
                      <td className="border border-slate-900 p-1.5 font-bold">
                        {rec.fullName}
                      </td>
                      <td className="border border-slate-900 p-1.5 text-center font-bold">
                        {rec.gender === 'Nam' ? 'x' : ''}
                      </td>
                      <td className="border border-slate-900 p-1.5 text-center font-bold">
                        {rec.gender === 'Nữ' ? 'x' : ''}
                      </td>
                      <td className="border border-slate-900 p-1.5">{rec.position}</td>
                      <td className="border border-slate-900 p-1.5">{rec.department}</td>
                      <td className="border border-slate-900 p-1.5">{rec.gradeTitle}</td>
                      <td className="border border-slate-900 p-1.5 text-center font-mono">
                        {rec.gradeCode}
                      </td>
                      <td className="border border-slate-900 p-1.5 text-center">
                        {rec.currentStep}
                      </td>
                      <td className="border border-slate-900 p-1.5 text-right pr-2">
                        {rec.currentCoefficient.toFixed(2)}
                      </td>
                      <td className="border border-slate-900 p-1.5 text-center">
                        {lastPromoStr}
                      </td>
                      <td className="border border-slate-900 p-1.5 text-center font-bold">
                        {res ? res.newStep : ''}
                      </td>
                      <td className="border border-slate-900 p-1.5 text-right font-bold pr-2">
                        {res ? res.newCoefficient.toFixed(2) : ''}
                      </td>
                      <td className="border border-slate-900 p-1.5 text-center font-bold">
                        {res ? res.newEffectiveDate : ''}
                      </td>
                      <td className="border border-slate-900 p-1.5 text-center">
                        {rec.requestedMonths || 9}
                      </td>
                      <td className="border border-slate-900 p-1.5">
                        {rec.achievementTitle || ''}
                      </td>
                      <td className="border border-slate-900 p-1.5 text-center font-mono text-[9pt]">
                        {rec.achievementDecisionDate
                          ? (rec.achievementDecisionDate.includes('-')
                              ? rec.achievementDecisionDate.split('-').reverse().join('/')
                              : rec.achievementDecisionDate)
                          : '-'}
                      </td>
                      <td className="border border-slate-900 p-1.5 text-center font-bold text-[9pt]">
                        {isEligible ? 'Đủ điều kiện' : 'Không đạt'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-4 font-semibold text-xs italic">
            Tổng số danh sách gồm {records.length} người (Trong đó đủ điều kiện: {eligibleRecords.length} người)./.
          </div>

          {/* Chữ ký & Xác nhận theo thể thức văn bản hành chính Việt Nam */}
          <div className="grid grid-cols-12 gap-6 mt-12 text-center text-xs">
            <div className="col-span-4">
              <div className="font-bold uppercase">NGƯỜI LẬP BIỂU</div>
              <div className="italic text-[10pt] text-slate-500 mt-1">(Ký, họ tên)</div>
              <div className="h-20"></div>
            </div>

            <div className="col-span-4">
              <div className="font-bold uppercase">HỘI ĐỒNG XÉT LƯƠNG ĐƠN VỊ</div>
              <div className="italic text-[10pt] text-slate-500 mt-1">(Ký, họ tên)</div>
              <div className="h-20"></div>
            </div>

            <div className="col-span-4">
              <div className="italic text-[10.5pt] mb-1">
                ..., ngày ... tháng ... năm {reviewYear}
              </div>
              <div className="font-bold uppercase">THỦ TRƯỞNG CƠ QUAN, ĐƠN VỊ</div>
              <div className="italic text-[10pt] text-slate-500 mt-1">(Ký, ghi rõ họ tên và đóng dấu)</div>
              <div className="h-20"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
