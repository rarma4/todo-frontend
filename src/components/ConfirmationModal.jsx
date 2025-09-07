import { memo, useEffect } from 'react'
import { MODAL_TEXTS } from '../constants'

const ConfirmationModal = memo(({ 
  isOpen, 
  onConfirm, 
  onCancel 
}) => {
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onCancel()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onCancel])

  if (!isOpen) return null

  return (
    <div 
      className="modal-overlay"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className="modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="modal-title">{MODAL_TEXTS.TITLE}</h2>
        <div className="modal-actions">
          <button 
            className="btn-cancel" 
            onClick={onCancel}
            autoFocus
          >
            {MODAL_TEXTS.CANCEL}
          </button>
          <button 
            className="btn-confirm" 
            onClick={onConfirm}
          >
            {MODAL_TEXTS.CONFIRM}
          </button>
        </div>
      </div>
    </div>
  )
})

ConfirmationModal.displayName = 'ConfirmationModal'

export default ConfirmationModal
