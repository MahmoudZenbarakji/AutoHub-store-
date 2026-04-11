import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout as logoutRequest } from '@/services/authService';
import { clearStoredAuthToken } from '@/utils/authToken';

export function useLogout() {
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const performLogout = useCallback(async () => {
    setLoggingOut(true);
    try {
      await logoutRequest();
    } catch {
      // Still clear session locally; token may already be invalid.
    } finally {
      clearStoredAuthToken();
      setLoggingOut(false);
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  return { performLogout, loggingOut };
}
