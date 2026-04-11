import styles from './FormTextField.module.css';

export function FormTextField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  errorMessage,
  disabled,
  autoComplete,
  placeholder,
}) {
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className={`${styles.input} ${errorMessage ? styles.inputError : ''}`}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        autoComplete={autoComplete}
        placeholder={placeholder}
      />
      <div className={styles.fieldError} role="status" aria-live="polite">
        {errorMessage || ''}
      </div>
    </div>
  );
}
