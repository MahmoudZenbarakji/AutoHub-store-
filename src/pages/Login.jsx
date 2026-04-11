import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { FormTextField } from '@/components/FormTextField';
import { useLoginForm } from '@/hooks/useLoginForm';
import styles from '@/styles/login.module.css';

export function Login() {
  const {
    username,
    password,
    fieldErrors,
    formError,
    loading,
    forgotPasswordLoading,
    forgotPasswordFeedback,
    onUsernameChange,
    onPasswordChange,
    handleSubmit,
    handleForgotPassword,
  } = useLoginForm();

  return (
    <>
      <Helmet>
        <title>Sign in | AutoHub Admin</title>
      </Helmet>
      <div className={styles.page}>
        <div className={styles.card}>
          <header className={styles.header}>
            <h1 className={styles.title}>AutoHub Admin</h1>
            <p className={styles.subtitle}>Sign in with your administrator account</p>
          </header>
          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <FormTextField
              id="login-username"
              label="Username"
              type="text"
              value={username}
              onChange={onUsernameChange}
              errorMessage={fieldErrors.username}
              disabled={loading}
              autoComplete="username"
            />
            <FormTextField
              id="login-password"
              label="Password"
              type="password"
              value={password}
              onChange={onPasswordChange}
              errorMessage={fieldErrors.password}
              disabled={loading}
              autoComplete="current-password"
            />
            <div className={styles.forgotRow}>
              <button
                type="button"
                className={styles.forgotButton}
                onClick={() => void handleForgotPassword()}
                disabled={loading || forgotPasswordLoading}
              >
                {forgotPasswordLoading ? 'Sending…' : 'Forgot password?'}
              </button>
              <Link to="/reset-password" className={styles.secondaryLink}>
                Reset with code
              </Link>
            </div>
            {forgotPasswordFeedback ? (
              <div
                className={
                  forgotPasswordFeedback.type === 'success' ? styles.formSuccess : styles.formError
                }
                role="status"
              >
                {forgotPasswordFeedback.message}
              </div>
            ) : null}
            {formError ? <div className={styles.formError}>{formError}</div> : null}
            <button className={styles.submit} type="submit" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
