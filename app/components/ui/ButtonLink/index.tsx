import { Link, type LinkProps } from '@tanstack/react-router';
import clsx from 'clsx';

export type ButtonLinkKind = 'primary' | 'button';

export type ButtonLinkProps = {
  label: string;
  fullWidth?: boolean;
  kind: ButtonLinkKind;
} & LinkProps;

export function ButtonLink({
  label,
  fullWidth,
  kind,
  ...rest
}: ButtonLinkProps) {
  return (
    <Link
      {...rest}
      className={clsx(
        'appearance-none cursor-pointer justify-center items-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed',
        fullWidth ? 'w-full flex' : 'inline-flex',
        kind === 'button' &&
          'bg-white/10 hover:bg-white/20 focus-visible:outline-white/30 disabled:bg-white/5',
        kind === 'primary' &&
          'bg-indigo-500 hover:bg-indigo-400 focus-visible:outline-indigo-500 disabled:bg-indigo-600/40',
      )}
    >
      {label}
    </Link>
  );
}
