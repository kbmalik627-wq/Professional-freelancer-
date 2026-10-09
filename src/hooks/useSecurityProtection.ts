import { useEffect, useState, useCallback } from 'react';

export function useSecurityProtection() {
  const [securityAlert, setSecurityAlert] = useState<string | null>(null);

  const showAlert = useCallback((message: string) => {
    setSecurityAlert(message);
    const timer = setTimeout(() => {
      setSecurityAlert(null);
    }, 3200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // 1. Disable Right-Click (Context Menu)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      showAlert('Protected Content: Right-click is disabled to safeguard deliverables.');
    };

    // 2. Disable Image and Element Dragging
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
    };

    // 3. Disable Copy Event
    const handleCopy = (e: ClipboardEvent) => {
      // Allow copy if within input/textarea
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return;
      }
      e.preventDefault();
      showAlert('Protected Content: Copying text is restricted on this portfolio.');
    };

    // 4. Disable Keyboard Shortcuts: Ctrl+C, Ctrl+U, Ctrl+S, Ctrl+P, Ctrl+A, F12, DevTools shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Allow standard typing within inputs
      const target = e.target as HTMLElement | null;
      const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA');

      // F12 key
      if (e.key === 'F12') {
        e.preventDefault();
        showAlert('Developer console inspection is disabled.');
        return;
      }

      const isCtrlOrMeta = e.ctrlKey || e.metaKey;

      if (isCtrlOrMeta) {
        const key = e.key.toLowerCase();

        // Prevent View Source (Ctrl+U)
        if (key === 'u') {
          e.preventDefault();
          showAlert('View Page Source is disabled.');
          return;
        }

        // Prevent Save Page (Ctrl+S)
        if (key === 's') {
          e.preventDefault();
          showAlert('Saving page assets is disabled.');
          return;
        }

        // Prevent Print (Ctrl+P)
        if (key === 'p') {
          e.preventDefault();
          showAlert('Printing is disabled to protect client files.');
          return;
        }

        // Prevent Copy (Ctrl+C) if not in input
        if (key === 'c' && !isInput && !e.shiftKey) {
          e.preventDefault();
          showAlert('Copy shortcut (Ctrl+C) is disabled.');
          return;
        }

        // Prevent Select All (Ctrl+A) if not in input
        if (key === 'a' && !isInput) {
          e.preventDefault();
          showAlert('Select-all shortcut is disabled.');
          return;
        }

        // Prevent Inspect Element (Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C)
        if (e.shiftKey && ['i', 'j', 'c'].includes(key)) {
          e.preventDefault();
          showAlert('Developer tools shortcut is disabled.');
          return;
        }
      }
    };

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('dragstart', handleDragStart);
    window.addEventListener('copy', handleCopy);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('dragstart', handleDragStart);
      window.removeEventListener('copy', handleCopy);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showAlert]);

  return {
    securityAlert,
    dismissAlert: () => setSecurityAlert(null)
  };
}
