/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { AppraisalRecord } from './types/salary';
import { SAMPLE_TONG_HOP_DATA } from './data/sampleData';
import { evaluateAllAppraisals } from './utils/salaryCalculator';
import { Header } from './components/Header';
import { ListAssessmentView } from './components/ListAssessmentView';
import { QuickAssessmentCard } from './components/QuickAssessmentCard';
import { RecordDetailModal } from './components/RecordDetailModal';
import { ImportPasteModal } from './components/ImportPasteModal';
import { PrintPreviewModal } from './components/PrintPreviewModal';
import { RegulationsModal } from './components/RegulationsModal';
import { ConfirmDeleteModal } from './components/ConfirmDeleteModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<'list' | 'single' | 'regulations'>('list');

  // Đơn vị & Đợt xét
  const [unitName, setUnitName] = useState('UBND XÃ PHÚ HỒ');
  const [departmentName, setDepartmentName] = useState('PHÒNG VĂN HÓA - XÃ HỘI');
  const [reviewYear, setReviewYear] = useState(2026);
  const [reviewRound, setReviewRound] = useState(2);
  const [totalPayrollCount, setTotalPayrollCount] = useState(110); // Cứ 10 người được 1 người

  // Danh sách hồ sơ (Mặc định tải 11 người từ file mẫu TONG HOP_TTH.pdf)
  const [records, setRecords] = useState<AppraisalRecord[]>(SAMPLE_TONG_HOP_DATA);

  // Modal states
  const [selectedRecordForDetail, setSelectedRecordForDetail] = useState<AppraisalRecord | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [printModalState, setPrintModalState] = useState<{
    isOpen: boolean;
    mode: 'tong_hop' | 'mau_01';
  }>({
    isOpen: false,
    mode: 'tong_hop',
  });

  // Modal Xóa an toàn không dùng window.confirm
  const [recordToDelete, setRecordToDelete] = useState<AppraisalRecord | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Tự động thẩm định toàn bộ danh sách mỗi khi records hoặc reviewYear thay đổi
  const appraisalResults = useMemo(() => {
    return evaluateAllAppraisals(records);
  }, [records, reviewYear]);

  // Đếm số người đủ điều kiện
  const eligibleCount = useMemo(() => {
    let count = 0;
    records.forEach((r) => {
      if (appraisalResults.get(r.id)?.isEligible) {
        count++;
      }
    });
    return count;
  }, [records, appraisalResults]);

  // Thao tác với records
  const handleUpdateRecord = (updated: AppraisalRecord) => {
    setRecords((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  };

  // Kích hoạt xóa: mở ConfirmDeleteModal (tránh window.confirm bị chặn trong iframe)
  const handleRequestDelete = (id: string) => {
    const found = records.find((r) => r.id === id);
    if (found) {
      setRecordToDelete(found);
      setIsDeleteModalOpen(true);
    }
  };

  // Xác nhận xóa thực tế
  const handleConfirmDelete = () => {
    if (!recordToDelete) return;
    setRecords((prev) => {
      const filtered = prev.filter((r) => r.id !== recordToDelete.id);
      // Cập nhật lại số thứ tự
      return filtered.map((r, idx) => ({ ...r, orderNumber: idx + 1 }));
    });
    setRecordToDelete(null);
  };

  const handleAddNewRecord = () => {
    const newRecord: AppraisalRecord = {
      id: `record-${Date.now()}`,
      orderNumber: records.length + 1,
      salutation: 'Bà',
      fullName: 'Họ và tên mới',
      gender: 'Nữ',
      position: 'Giáo viên',
      department: records[0]?.department || 'Trường Mầm non',
      gradeTitle: 'Giáo viên mầm non hạng II',
      gradeCode: 'V.07.02.25',
      regularCycleMonths: 36,
      currentStep: 3,
      currentCoefficient: 3.00,
      lastPromotionDate: `${reviewYear - 2}-05-01`,
      annualRating: 'hoan_thanh_tot',
      isDisciplined: false,
      disciplineMonthsExtended: 0,
      isConsecutivePremature: false,
      hasPreviousTTH: false,
      achievementTitle: 'CSTĐCS',
      achievementDecisionNumber: 'QĐ .../QĐ-UBND',
      achievementDecisionDate: `${reviewYear - 1}-06-25`,
      requestedMonths: 9,
      reviewYear: reviewYear,
      notes: '',
    };
    setRecords((prev) => [...prev, newRecord]);
    setSelectedRecordForDetail(newRecord);
    setIsDetailModalOpen(true);
  };

  const handleResetToSample = () => {
    setRecords(SAMPLE_TONG_HOP_DATA);
  };

  const handleAddFromSingleView = (record: AppraisalRecord) => {
    setRecords((prev) => [...prev, { ...record, orderNumber: prev.length + 1 }]);
    setActiveTab('list');
  };

  const handleImportRecords = (newRecords: AppraisalRecord[]) => {
    setRecords(newRecords);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unitName={unitName}
        setUnitName={setUnitName}
        departmentName={departmentName}
        setDepartmentName={setDepartmentName}
        reviewYear={reviewYear}
        setReviewYear={setReviewYear}
        reviewRound={reviewRound}
        setReviewRound={setReviewRound}
        totalPayrollCount={totalPayrollCount}
        setTotalPayrollCount={setTotalPayrollCount}
        eligibleCount={eligibleCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'list' && (
          <ListAssessmentView
            records={records}
            results={appraisalResults}
            onUpdateRecord={handleUpdateRecord}
            onDeleteRecord={handleRequestDelete}
            onAddRecord={handleAddNewRecord}
            onResetToSample={handleResetToSample}
            onOpenImportModal={() => setIsImportModalOpen(true)}
            onOpenPrintModal={(mode) => setPrintModalState({ isOpen: true, mode })}
            onOpenDetailModal={(record) => {
              setSelectedRecordForDetail(record);
              setIsDetailModalOpen(true);
            }}
            unitName={unitName}
            departmentName={departmentName}
            reviewYear={reviewYear}
            reviewRound={reviewRound}
            totalPayrollCount={totalPayrollCount}
          />
        )}

        {activeTab === 'single' && (
          <QuickAssessmentCard
            reviewYear={reviewYear}
            onAddToList={handleAddFromSingleView}
          />
        )}

        {activeTab === 'regulations' && <RegulationsModal />}
      </main>

      {/* Modals */}
      <RecordDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedRecordForDetail(null);
        }}
        record={selectedRecordForDetail}
        onSave={handleUpdateRecord}
        reviewYear={reviewYear}
      />

      <ImportPasteModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImportRecords}
        currentCount={records.length}
      />

      <PrintPreviewModal
        isOpen={printModalState.isOpen}
        onClose={() => setPrintModalState({ isOpen: false, mode: 'tong_hop' })}
        mode={printModalState.mode}
        records={records}
        results={appraisalResults}
        unitName={unitName}
        departmentName={departmentName}
        reviewYear={reviewYear}
        reviewRound={reviewRound}
      />

      {/* Modal Xóa an toàn không bị chặn bởi iframe */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setRecordToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        recordName={recordToDelete ? `${recordToDelete.salutation} ${recordToDelete.fullName}` : ''}
      />
    </div>
  );
}
