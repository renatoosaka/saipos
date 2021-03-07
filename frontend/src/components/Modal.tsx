import { useState } from 'react';
import ReactDom from 'react-dom'

import styles from '../styles/components/Modal.module.css'

interface ModalProps {
  children: React.ReactNode
  isShowing: boolean
  toggle: () => void
}


export function Modal({ children, isShowing, toggle }: ModalProps) {
  return (
    isShowing ? ReactDom.createPortal(
      <div className={styles.modalOverlay}>
        <div className={styles.modal}>
          { children }
        </div>
      </div>, document.body
    ) : null
  )
}

export const useModal = () => {
  const [isShowing, setIsShowing] = useState(false);

  function toggle() {
    setIsShowing(!isShowing);
  }

  return {
    isShowing,
    toggle,
  }
}
