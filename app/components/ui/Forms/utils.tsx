export function FormError({
  errors,
  name,
  touched,
  label,
}: { errors: string[]; name: string; touched: boolean; label: string }) {
  return errors.length && touched ? (
    <p className="text-xs text-red-600" id="email-error">
      {errors?.map((err) => String(err).replace(name, label)).join(', ')}.
    </p>
  ) : null;
}
