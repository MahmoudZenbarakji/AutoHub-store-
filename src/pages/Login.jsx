import { Helmet } from 'react-helmet-async';
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
    onUsernameChange,
    onPasswordChange,
    handleSubmit,
  } = useLoginForm();

  return (
    <>
      <Helmet>
        <title>Sign in | SparesHub</title>
      </Helmet>
      <div className={styles.page}>
        <div className={styles.card}>
          <header className={styles.header}>
            <h1 className="sr-only">Sign in</h1>
            <img
              src="/media/G_SLogo-01-02.png"
              alt="SparesHub — Built For Every Part"
              className={styles.logo}
              width={340}
              height={120}
            />
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
