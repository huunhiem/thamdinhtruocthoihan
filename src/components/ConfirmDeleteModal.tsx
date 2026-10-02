import React from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  recordName: string;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  recordName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-rose-50 border-b border-rose-100 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
            <Trash2 className="w-5 h-5 text-rose-600" />
            <span>Xác Nhận Xóa Hồ Sơ Thẩm Định</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-3 text-xs text-slate-600">
          <p className="text-slate-800 text-sm font-medium">
            Bạn có chắc chắn muốn xóa hồ sơ của{' '}
            <strong className="text-rose-700 font-bold">{recordName || 'cán bộ này'}</strong> khỏi
            danh sách thẩm định không?
          </p>
          <p className="text-slate-500">
            Hành động này sẽ loại bỏ hồ sơ khỏi bảng thẩm định và tự động cập nhật lại chỉ tiêu 10%
            cũng như số thứ tự danh sách.
          </p>
        </div>

        <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex items-center justify-end gap-2 text-xs">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-semibold hover:bg-slate-100"
          >
            Hủy Bỏ
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-xs flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" />
            <span>Xác Nhận Xóa</span>
          </button>
        </div>
      </div>
    </div>
  );
};
