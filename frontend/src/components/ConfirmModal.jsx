function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = 'Hapus',
  loading = false,
  onConfirm,
  onCancel,
}) {
  if (!open) {
    return null
  }

  return (
    <div className="modal-backdrop" onClick={onCancel} role="presentation">
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="confirm-modal-title">{title}</h2>
        <p>{message}</p>
        <div className="modal__actions">
          <button
            type="button"
            className="button button--secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Batal
          </button>
          <button
            type="button"
            className="button button--danger"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Memproses...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
