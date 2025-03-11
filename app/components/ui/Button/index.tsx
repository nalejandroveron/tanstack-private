import clsx from 'clsx';

export type ButtonKind = 'primary' | 'button' | 'destructive';

type DistinctButtonProps =
  | { type: 'button'; onClick: () => void }
  | { type: 'submit'; form?: string };

export type ButtonProps = {
  label: string;
  fullWidth?: boolean;
  disabled?: boolean;
  kind: ButtonKind;
} & DistinctButtonProps;

export function Button({
  label,
  fullWidth,
  disabled,
  kind,
  type,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      type={type}
      disabled={disabled}
      aria-disabled={disabled}
      className={clsx(
        'cursor-pointer justify-center items-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed',
        fullWidth ? 'w-full flex' : 'inline-flex',
        kind === 'button' &&
          'bg-white/10 hover:bg-white/20 focus-visible:outline-white/30 disabled:bg-white/5',
        kind === 'primary' &&
          'bg-indigo-500 hover:bg-indigo-400 focus-visible:outline-indigo-500 disabled:bg-indigo-600/40',
        kind === 'destructive' &&
          'bg-red-500 hover:bg-red-400 focus-visible:outline-red-500 disabled:bg-red-600/40',
      )}
    >
      {label}
    </button>
  );
}
