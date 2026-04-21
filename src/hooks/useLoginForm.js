import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAxiosErrorMessage } from '@/utils/apiError';
import { getStoredAuthToken, setStoredAuthToken } from '@/utils/authToken';
import { extractAuthTokenFromResponse, login as loginRequest } from '@/services/authService';

const initialFieldErrors = () => ({
  username: '',
  password: '',
});

function validateFields(username, password) {
  const next = initialFieldErrors();
  let valid = true;
  if (!username.trim()) {
    next.username = 'Username is required';
    valid = false;
  }
  if (!password) {
    next.password = 'Password is required';
    valid = false;
  }
  return { valid, fieldErrors: next };
}

export function useLoginForm() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState(initialFieldErrors);
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getStoredAuthToken()) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const clearFieldError = useCallback((fieldName) => {
    setFieldErrors((previous) => ({ ...previous, [fieldName]: '' }));
  }, []);

  const onUsernameChange = useCallback(
    (value) => {
      setUsername(value);
      clearFieldError('username');
      setFormError('');
    },
    [clearFieldError],
  );

  const onPasswordChange = useCallback(
    (value) => {
      setPassword(value);
      clearFieldError('password');
      setFormError('');
    },
    [clearFieldError],
  );

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setFormError('');
      const { valid, fieldErrors: nextErrors } = validateFields(username, password);
      setFieldErrors(nextErrors);
      if (!valid) {
        return;
      }
      setLoading(true);
      try {
        const payload = await loginRequest({
          username: username.trim(),
          password,
          user_type: 'store',
          guest_token: null,
        });
        const token = extractAuthTokenFromResponse(payload);
        if (token) {
          setStoredAuthToken(token);
        }
        navigate('/dashboard', { replace: true });
      } catch (error) {
        setFormError(getAxiosErrorMessage(error));
      } finally {
        setLoading(false);
      }
    },
    [username, password, navigate],
  );

  return {
    username,
    password,
    fieldErrors,
    formError,
    loading,
    onUsernameChange,
    onPasswordChange,
    handleSubmit,
  };
}
