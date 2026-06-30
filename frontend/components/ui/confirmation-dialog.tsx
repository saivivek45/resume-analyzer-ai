"use client";

import { Modal } from "@/components/ui/modal";

export function ConfirmationDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <Modal open={open} title={title} onClose={onClose}>
      <p className="text-sm leading-6 text-slate-400">{description}</p>
      <div className="mt-6 flex justify-end gap-3">
        <button className="button-secondary" onClick={onClose} type="button">
          Cancel
        </button>
        <button className="button-primary" onClick={onConfirm} type="button">
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
