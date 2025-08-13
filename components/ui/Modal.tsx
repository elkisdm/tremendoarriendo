'use client';

import { useEffect, useRef, RefObject } from 'react';
import { createPortal } from 'react-dom';

let Motion: typeof import('framer-motion') | null = null;
let motion: any = null;
let useReducedMotion: any = null;

async function ensureMotion() {
  if (!Motion) {
    Motion = await import('framer-motion');
    motion = Motion.motion;
    useReducedMotion = Motion.useReducedMotion;
  }
}

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  initialFocusRef?: RefObject<HTMLElement>;
}

export function Modal({ 
  open, 
  onClose, 
  title, 
  description, 
  children, 
  initialFocusRef 
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const reducedMotion = useRef(false);

  // Load motion lazily when modal first opens
  useEffect(() => {
    if (open) {
      ensureMotion();
    }
  }, [open]);

  // Focus trap y manejo de teclado
  useEffect(() => {
    if (!open) return;

    // Guardar elemento activo previo
    previousActiveElement.current = document.activeElement as HTMLElement;

    // Scroll lock
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Función para obtener elementos focusables
    const getFocusableElements = () => {
      if (!modalRef.current) return [];
      return Array.from(
        modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => !el.hasAttribute('disabled')) as HTMLElement[];
    };

    // Función para manejar Tab
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        const focusableElements = getFocusableElements();
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Focus inicial
    const focusInitial = () => {
      if (initialFocusRef?.current) {
        initialFocusRef.current.focus();
      } else {
        const focusableElements = getFocusableElements();
        if (focusableElements.length > 0) {
          focusableElements[0].focus();
        }
      }
    };

    // Pequeño delay para asegurar que el modal esté renderizado
    const timeoutId = setTimeout(focusInitial, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
      
      // Restaurar foco al elemento previo
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [open, onClose, initialFocusRef]);

  // Manejar click en overlay
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!open) return null;

  const Overlay = motion ? motion.div : 'div';
  const Panel = motion ? motion.div : 'div';

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <Overlay 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        {...(motion ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.2 } } : {})}
        onClick={handleOverlayClick}
      />

      {/* Panel */}
      <Panel
        ref={modalRef as any}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby={description ? "modal-description" : undefined}
        className="relative max-w-md w-[92%] rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6 shadow-2xl backdrop-blur-sm"
        {...(motion ? { initial: { opacity: 0, y: 12, scale: 0.98 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: 12, scale: 0.98 }, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } } : {})}
      >
        <div className="space-y-4">
          <div>
            <h2 id="modal-title" className="text-xl font-semibold text-white">
              {title}
            </h2>
            {description && (
              <p id="modal-description" className="mt-2 text-sm text-white/80">
                {description}
              </p>
            )}
          </div>
          {children}
        </div>
      </Panel>
    </div>
  );

  return createPortal(modalContent, document.body);
}
