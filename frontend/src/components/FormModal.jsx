function FormModal({ open, onClose, children }) {
  if (!open) {
    return null
  }

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="modal modal--form"
        role="dialog"
        aria-modal="true"
        aria-label="Form produk"
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

export default FormModal
