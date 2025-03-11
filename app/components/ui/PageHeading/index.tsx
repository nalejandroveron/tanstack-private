import type { ReactNode } from 'react';

type PageHeadingProps = {
  title: string;
  children?: ReactNode;
  actions?: ReactNode;
};

export function PageHeading({ title, children, actions }: PageHeadingProps) {
  return (
    <section className="flex flex-col gap-4">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl/7 font-bold text-white sm:truncate sm:text-3xl sm:tracking-tight">
            {title}
          </h2>
        </div>
        <div className="mt-4 gap-3 flex md:mt-0 md:ml-4">{actions}</div>
      </div>
      {children}
    </section>
  );
}
