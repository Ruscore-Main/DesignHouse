import { useEffect } from "react";
import styles from "./Modal.module.scss";

const Modal = ({ isVisible = false, title, content, footer, onClose }) => {
  const keydownHandler = ({ key }) => {
    switch (key) {
      case "Escape":
        onClose();
        break;
      default:
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", keydownHandler);
    return () => document.removeEventListener("keydown", keydownHandler);
  });

  return !isVisible ? null : (
    <div className={styles.modal}>
      <div className={styles.modalDialog} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>{title}</h3>
          <span className={styles.modalClose} onClick={onClose}>
            &times;
          </span>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.modalContent}>{content}</div>
        </div>
        {footer && <div className={styles.modalFooter}>{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;
