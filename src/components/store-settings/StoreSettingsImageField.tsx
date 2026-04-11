import { useId, useRef, type ChangeEvent } from 'react';
import { Button } from '@/components/common/Button';
import { cn } from '@/lib/utils';

const MAX_BYTES = 4 * 1024 * 1024;

type StoreSettingsImageFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (next: string) => void;
  disabled?: boolean;
  /** Tall preview for cover, compact for logo */
  variant?: 'logo' | 'cover';
};

export function StoreSettingsImageField({
  id,
  label,
  value,
  onChange,
  disabled,
  variant = 'cover',
}: StoreSettingsImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const hintId = useId();

  const onFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file || !file.type.startsWith('image/')) {
      return;
    }
    if (file.size > MAX_BYTES) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      onChange(String(reader.result ?? ''));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {label}
      </label>
      <p id={hintId} className="text-xs text-muted-foreground">
        PNG or JPG, max 4&nbsp;MB. Used as {variant === 'logo' ? 'store logo' : 'cover image'}.
      </p>
      <div
        className={cn(
          'overflow-hidden rounded-md border border-border bg-muted/30',
          variant === 'logo' ? 'mx-auto aspect-square max-h-32 max-w-32' : 'aspect-[21/9] max-h-40 w-full',
        )}
      >
        {value ? (
          <img
            src={value}
            alt=""
            className={cn(
              'h-full w-full object-cover',
              variant === 'logo' && 'object-contain p-2',
            )}
          />
        ) : (
          <div className="flex h-full min-h-[6rem] items-center justify-center text-xs text-muted-foreground">
            No image selected
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
        >
          Choose image
        </Button>
        {value ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={disabled}
            onClick={() => onChange('')}
          >
            Remove
          </Button>
        ) : null}
      </div>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept="image/*"
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        disabled={disabled}
        onChange={onFile}
      />
    </div>
  );
}
