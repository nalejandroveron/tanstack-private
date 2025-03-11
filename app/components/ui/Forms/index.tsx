import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { createFormHook, createFormHookContexts } from '@tanstack/react-form';
import { clsx } from 'clsx';
import type {
  ComponentType,
  InputHTMLAttributes,
  SelectHTMLAttributes,
} from 'react';
import { Button, type ButtonKind } from '../Button';
import { FormError } from './utils';

const { fieldContext, useFieldContext, formContext, useFormContext } =
  createFormHookContexts();

export const createForm = <
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  TComponents extends Record<string, ComponentType<any>>,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  TFormComponents extends Record<string, ComponentType<any>>,
>({
  fieldComponents,
  formComponents,
}: { fieldComponents: TComponents; formComponents: TFormComponents }) =>
  createFormHook<TComponents, TFormComponents>({
    fieldContext,
    formContext,
    fieldComponents,
    formComponents,
  });

interface InputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'name' | 'type' | 'clasName'
  > {
  label: string;
  type: 'email' | 'password' | 'search' | 'text' | 'url';
}

export function FormInput({ label, type, ...input }: InputProps) {
  const field = useFieldContext<string>();

  return (
    <div className="space-y-2">
      <label
        htmlFor={field.name}
        className="block text-sm/6 font-medium text-white"
      >
        {label}
      </label>
      <input
        {...input}
        type={type}
        id={field.name}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        className={clsx(
          'block w-full appearance-none rounded-md px-3 py-1.5 text-base/6 bg-white/5 text-white border border-white/10 hover:border-white/20 placeholder:text-zinc-400 sm:text-sm/6 focus:outline-hidden disabled:border-white/15 disabled:bg-white/[2.5%]',
          field.state.meta.errors.length &&
            'border-red-800 hover:border-red-700',
        )}
      />
      <div className="flex min-h-4 w-full">
        <FormError
          errors={field.state.meta.errors}
          touched={field.state.meta.isTouched}
          name={field.name}
          label={label}
        />
      </div>
    </div>
  );
}

interface SelectProps
  extends Omit<
    SelectHTMLAttributes<HTMLSelectElement>,
    'name' | 'type' | 'clasName' | 'children'
  > {
  label: string;
  options: { value: string; label: string }[];
}

export function FormSelect({ label, options, ...input }: SelectProps) {
  const field = useFieldContext<string>();

  return (
    <div className="space-y-2">
      <label
        htmlFor={field.name}
        className="block text-sm/6 font-medium text-white"
      >
        {label}
      </label>
      <div className="grid grid-cols-1">
        <select
          {...input}
          id={field.name}
          name={field.name}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          className={clsx(
            'col-start-1 row-start-1 block w-full appearance-none rounded-md pr-8 px-3 py-1.5 text-base/6 bg-white/5 text-white border border-white/10 hover:border-white/20 placeholder:text-zinc-400 sm:text-sm/6 focus:outline-hidden disabled:border-white/15 disabled:bg-white/[2.5%]',
            field.state.meta.errors.length &&
              'border-red-800 hover:border-red-700',
          )}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDownIcon
          aria-hidden="true"
          className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-400 sm:size-4"
        />
      </div>
      <div className="flex min-h-4 w-full">
        <FormError
          errors={field.state.meta.errors}
          touched={field.state.meta.isTouched}
          name={field.name}
          label={label}
        />
      </div>
    </div>
  );
}

export function FormSubmit({
  label,
  fullWidth,
  form,
  kind = 'primary',
}: { label: string; kind?: ButtonKind; fullWidth?: boolean; form?: string }) {
  const formContext = useFormContext();
  return (
    <formContext.Subscribe
      selector={(state) => [state.canSubmit, state.isSubmitting]}
    >
      {([canSubmit, isSubmitting]) => (
        <Button
          form={form}
          kind={kind}
          type="submit"
          label={label}
          fullWidth={fullWidth}
          disabled={!canSubmit || isSubmitting}
        />
      )}
    </formContext.Subscribe>
  );
}
