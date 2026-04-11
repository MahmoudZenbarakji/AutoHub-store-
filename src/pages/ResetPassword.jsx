import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { FormTextField } from '@/components/FormTextField';
import { useResetPasswordForm } from '@/hooks/useResetPasswordForm';
import styles from '@/styles/login.module.css';

export function ResetPassword() {
  const {
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
  } = useResetPasswordForm();

  return (
    <>
      <Helmet>
        <title>Reset password | AutoHub Admin</title>
      </Helmet>
      <div className={styles.page}>
        <div className={styles.card}>
          <header className={styles.header}>
            <h1 className={styles.title}>Reset password</h1>
            <p className={styles.subtitle}>Enter your username, the code from your email, and a new password</p>
          </header>
          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <FormTextField
              id="reset-username"
              label="Username"
              type="text"
              value={username}
              onChange={onUsernameChange}
              errorMessage={fieldErrors.username}
              disabled={loading}
              autoComplete="username"
            />
            <FormTextField
              id="reset-token"
              label="Token"
              type="text"
              value={token}
              onChange={onTokenChange}
              errorMessage={fieldErrors.token}
              disabled={loading}
              autoComplete="one-time-code"
            />
            <FormTextField
              id="reset-password"
              label="New password"
              type="password"
              value={password}
              onChange={onPasswordChange}
              errorMessage={fieldErrors.password}
              disabled={loading}
              autoComplete="new-password"
            />
            <FormTextField
              id="reset-password-confirm"
              label="Confirm password"
              type="password"
              value={confirmPassword}
              onChange={onConfirmPasswordChange}
              errorMessage={fieldErrors.confirmPassword}
              disabled={loading}
              autoComplete="new-password"
            />
            {successMessage ? <div className={styles.formSuccess}>{successMessage}</div> : null}
            {formError ? <div className={styles.formError}>{formError}</div> : null}
            <button className={styles.submit} type="submit" disabled={loading}>
              {loading ? 'Updating…' : 'Update password'}
            </button>
            <div className={styles.forgotRow}>
              <Link to="/login" className={styles.secondaryLink}>
                Back to sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
