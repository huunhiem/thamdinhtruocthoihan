import React, { useState } from 'react';
import { SALARY_GRADES } from '../data/salaryScales';
import { BookOpen, ShieldAlert, Award, FileText, CheckCircle, Scale } from 'lucide-react';

export const RegulationsModal: React.FC = () => {
  const [selectedScaleCode, setSelectedScaleCode] = useState('V.07.02.25');

  const activeScale = SALARY_GRADES.find((s) => s.code === selectedScaleCode);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Title */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-100 text-red-800 rounded-xl">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Căn Cứ Pháp Lý & Tra Cứu Bảng Lương (NĐ 204, TT 08 & TT 03)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Hệ thống hóa toàn bộ tiêu chuẩn, điều kiện nâng bậc lương thường xuyên và trước thời hạn
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* CỘT TRÁI: QUY ĐỊNH PHÁP LÝ (7 cột) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Mục 1: Tiêu chuẩn nâng lương trước thời hạn do lập thành tích xuất sắc */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2.5">
              <Award className="w-5 h-5 text-red-700" />
              <h3 className="font-bold text-slate-900 text-sm">
                1. Điều Kiện & Tiêu Chuẩn Nâng Lương Trước Thời Hạn (Điều 3 TT 08 & TT 03)
              </h3>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-slate-700">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">
                  a) Đạt đủ 02 tiêu chuẩn thường xuyên:
                </span>
                <ul className="list-disc list-inside space-y-1 pl-2">
                  <li>
                    Được cấp có thẩm quyền đánh giá và xếp loại chất lượng ở mức{' '}
                    <strong>từ hoàn thành nhiệm vụ trở lên</strong> (sửa đổi theo TT 03/2021).
                  </li>
                  <li>
                    <strong>Không vi phạm kỷ luật</strong> một trong các hình thức: khiển trách, cảnh cáo, giáng chức, cách chức.
                  </li>
                </ul>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">
                  b) Điều kiện về thời gian thiếu để nâng bậc lương thường xuyên:
                </span>
                <p>
                  Tính đến ngày <strong>31 tháng 12 của năm xét</strong> nâng bậc lương trước thời hạn,
                  thời gian còn thiếu để được nâng bậc lương thường xuyên <strong>từ 12 tháng trở xuống</strong>.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">
                  c) Quy tắc không nâng 2 lần liên tiếp (Điểm d Khoản 1 Điều 3 TT 08 & TT 03):
                </span>
                <p className="text-red-700 font-semibold">
                  "Không thực hiện hai lần liên tiếp nâng bậc lương trước thời hạn do lập thành tích xuất sắc trong cùng ngạch hoặc cùng chức danh."
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">
                  d) Xác định thời điểm đạt thành tích xuất sắc (Điểm đ Khoản 1 Điều 3):
                </span>
                <ul className="list-disc list-inside space-y-1 pl-2">
                  <li>
                    Trong khoảng <strong>06 năm gần nhất</strong> đối với ngạch/chức danh có trình độ đào tạo từ cao đẳng trở lên (chu kỳ 36 tháng).
                  </li>
                  <li>
                    Trong khoảng <strong>04 năm gần nhất</strong> đối với ngạch/chức danh có trình độ từ trung cấp trở xuống (chu kỳ 24 tháng).
                  </li>
                  <li>
                    Riêng trường hợp đã được nâng bậc lương trước thời hạn thì thành tích đạt được trước ngày có quyết định nâng lương trước thời hạn lần trước <strong>không được tính</strong> cho lần sau.
                  </li>
                </ul>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">
                  e) Tỷ lệ nâng bậc lương trước thời hạn (Điểm b, c Khoản 1 Điều 3):
                </span>
                <p>
                  Không quá <strong>10%</strong> tổng số cán bộ, công chức, viên chức và người lao động trong danh sách trả lương của cơ quan, đơn vị (Cứ mỗi 10 người thì được 01 người; không tính số dư dưới 10 người).
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">
                  f) Mốc thời điểm hưởng lương mới so với quyết định thành tích:
                </span>
                <p>
                  Ngày hưởng bậc lương mới sau khi nâng lương trước thời hạn phải <strong>từ sau ngày ký quyết định công nhận thành tích xuất sắc</strong> đạt được.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">
                  g) Năm phát sinh thời điểm hưởng lương mới:
                </span>
                <p>
                  Ngày hưởng bậc lương mới sau khi nâng bậc lương trước thời hạn phải <strong>nằm trong năm xét nâng bậc lương trước thời hạn</strong> của cơ quan, đơn vị.
                </p>
              </div>
            </div>
          </div>

          {/* Mục 2: Mức nâng lương trước thời hạn thông thường */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2.5">
              <Scale className="w-5 h-5 text-red-700" />
              <h3 className="font-bold text-slate-900 text-sm">
                2. Khung Thời Gian Rút Ngắn Phổ Biến Theo Quy Chế Cơ Quan
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl border border-red-200 bg-red-50/50">
                <span className="font-bold text-red-800 text-sm block">12 Tháng</span>
                <span className="text-[11px] text-slate-600 block mt-1">
                  Huân chương các loại, Bằng khen Thủ tướng, Chiến sĩ thi đua toàn quốc, Chiến sĩ thi đua cấp tỉnh/bộ, hoặc 3 năm liền đạt CSTĐ cơ sở.
                </span>
              </div>
              <div className="p-3 rounded-xl border border-amber-200 bg-amber-50/50">
                <span className="font-bold text-amber-800 text-sm block">09 Tháng</span>
                <span className="text-[11px] text-slate-600 block mt-1">
                  Đạt danh hiệu Chiến sĩ thi đua cơ sở (CSTĐCS) 2 năm trong chu kỳ, hoặc CSTĐCS kèm Bằng khen UBND tỉnh, Bộ ngành.
                </span>
              </div>
              <div className="p-3 rounded-xl border border-blue-200 bg-blue-50/50">
                <span className="font-bold text-blue-800 text-sm block">06 Tháng</span>
                <span className="text-[11px] text-slate-600 block mt-1">
                  Đạt 01 danh hiệu Chiến sĩ thi đua cơ sở hoặc được tặng Giấy khen hoàn thành xuất sắc nhiệm vụ.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: TRA CỨU THANG BẢNG LƯƠNG NĐ 204 (5 cột) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2.5">
              <FileText className="w-5 h-5 text-red-700" />
              <h3 className="font-bold text-slate-900 text-sm">
                3. Bảng Tra Cứu Bậc Lương NĐ 204/2004/NĐ-CP
              </h3>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Chọn ngạch / Chức danh nghề nghiệp để xem:
              </label>
              <select
                value={selectedScaleCode}
                onChange={(e) => setSelectedScaleCode(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-semibold text-slate-800"
              >
                {SALARY_GRADES.map((g) => (
                  <option key={g.code} value={g.code}>
                    {g.code} - {g.name} (Loại {g.group})
                  </option>
                ))}
              </select>
            </div>

            {activeScale && (
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Mã ngạch:</span>
                    <span className="font-mono font-bold text-slate-800">{activeScale.code}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Nhóm lương:</span>
                    <span className="font-bold text-red-700">Loại {activeScale.group}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Chu kỳ thường xuyên:</span>
                    <span className="font-bold text-slate-800">{activeScale.regularCycleMonths} tháng</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Số bậc tối đa:</span>
                    <span className="font-bold text-slate-800">{activeScale.maxStep} bậc</span>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-2 text-center w-16">Bậc</th>
                        <th className="p-2 text-right pr-4">Hệ số</th>
                        <th className="p-2 text-slate-500">Ghi chú</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {activeScale.coefficients.map((coeff, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                          <td className="p-2 text-center font-bold text-slate-700">
                            Bậc {idx + 1}
                          </td>
                          <td className="p-2 text-right font-mono font-bold text-red-700 pr-4">
                            {coeff.toFixed(2)}
                          </td>
                          <td className="p-2 text-[11px] text-slate-500">
                            {idx === 0
                              ? 'Khởi điểm ngạch'
                              : idx === activeScale.coefficients.length - 1
                              ? 'Kịch khung (xét TNVK)'
                              : ''}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
