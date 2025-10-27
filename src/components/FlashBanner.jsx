import { useEffect, useState } from 'react';

export default function FlashBanner({ message, type = 'success', duration = 2500 }) {
  const [visible, setVisible] = useState(!!message);
  useEffect(() => {
    if (!message) return;
    setVisible(true);
    const id = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(id);
  }, [message, duration]);

  if (!visible || !message) return null;
  const styles = type === 'success'
    ? { background: '#ecfdf5', border: '1px solid #10b981', color: '#065f46' }
    : { background: '#fef2f2', border: '1px solid #ef4444', color: '#991b1b' };

  return (
    <div role={type === 'success' ? 'status' : 'alert'} style={{ marginTop: 16, padding: 12, borderRadius: 6, ...styles }}>
      {message}
    </div>
  );
}


