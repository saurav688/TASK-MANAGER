import { useState, useCallback } from 'react';

let idCounter = 0;

const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = ++idCounter;
    setToasts(prev => {
      const next = [...prev, { id, message, type }];
      return next.slice(-3); // max 3
    });
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
};

export default useToast;
