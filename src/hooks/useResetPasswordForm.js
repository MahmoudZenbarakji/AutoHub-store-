import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getAxiosErrorMessage } from '@/utils/apiError';
import { resetPassword as resetPasswordRequest } from '@/services/authService';

const initialFieldErrors = () => ({
  username: '',
  token: '',
  password: '',
  confirmPassword: '',
});

function validate(username, token, password, confirmPassword) {
  const next = initialFieldErrors();
  let valid = true;
  if (!username.trim()) {
    next.username = 'Username is required';
    valid = false;
  }
  if (!token.trim()) {
    next.token = 'Token is required';
    valid = false;
  }
  if (!password) {
    next.password = 'Password is required';
    valid = false;
  }
  if (!confirmPassword) {
    next.confirmPassword = 'Confirm your password';
    valid = false;
  }
  if (password && confirmPassword && password !== confirmPassword) {
    next.confirmPassword = 'Passwords do not match';
    valid = false;
  }
  return { valid, fieldErrors: next };
}

export function useResetPasswordForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [username, setUsername] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState(initialFieldErrors);
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    }
  }, [searchParams]);

  const clearFieldError = useCallback((fieldName) => {
    setFieldErrors((previous) => ({ ...previous, [fieldName]: '' }));
  }, []);

  const onUsernameChange = useCallback(
    (value) => {
      setUsername(value);
      clearFieldError('username');
      setFormError('');
      setSuccessMessage('');
    },
    [clearFieldError],
  );

  const onTokenChange = useCallback(
    (value) => {
      setToken(value);
      clearFieldError('token');
      setFormError('');
      setSuccessMessage('');
    },
    [clearFieldError],
  );

  const onPasswordChange = useCallback(
    (value) => {
      setPassword(value);
      clearFieldError('password');
      clearFieldError('confirmPassword');
      setFormError('');
      setSuccessMessage('');
    },
    [clearFieldError],
  );

  const onConfirmPasswordChange = useCallback(
    (value) => {
      setConfirmPassword(value);
      clearFieldError('confirmPassword');
      setFormError('');
      setSuccessMessage('');
    },
    [clearFieldError],
  );

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setFormError('');
      setSuccessMessage('');
      const { valid, fieldErrors: nextErrors } = validate(
        username,
        token,
        password,
        confirmPassword,
      );
      setFieldErrors(nextErrors);
      if (!valid) {
        return;
      }
      setLoading(true);
      try {
        await resetPasswordRequest({
          username: username.trim(),
          token: token.trim(),
          password,
          password_confirmation: confirmPassword,
        });
        setSuccessMessage('Password updated. You can sign in now.');
        window.setTimeout(() => {
          navigate('/login', { replace: true });
        }, 1500);
      } catch (error) {
        setFormError(getAxiosErrorMessage(error));
      } finally {
        setLoading(false);
      }
    },
    [username, token, password, confirmPassword, navigate],
  );

  return {
    username,
    token,
    password,
    confirmPassword,
    fieldErrors,
    formError,
    successMessage,
    loading,
    onUsernameChange,
    onTokenChange,
    onPasswordChange,
    onConfirmPasswordChange,
    handleSubmit,
  };
}
