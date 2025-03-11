import { Link } from '@tanstack/react-router';
import { forgotPasswordSetSchema } from '../../schemas/Auth';
import { Alert } from '../ui/Alerts';
import { FormInput, FormSubmit, createForm } from '../ui/Forms';

type ForgotPasswordSetProps = {
  onSubmit: (value: typeof forgotPasswordSetSchema.infer) => Promise<unknown>;
  message?: {
    message: string;
    messageType: 'error' | 'info' | 'success' | 'warning';
  };
};

const { useAppForm } = createForm({
  fieldComponents: { FormInput },
  formComponents: { FormSubmit },
});

export function ForgotPasswordSet({
  onSubmit,
  message,
}: ForgotPasswordSetProps) {
  const form = useAppForm({
    validators: { onChange: forgotPasswordSetSchema },
    defaultValues: {
      password: '',
    },
    onSubmit: ({ value }) => onSubmit(value),
  });

  return (
    <div className="flex min-h-full flex-1">
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <img
              alt="My App"
              src="https://tailwindui.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
              className="h-10 w-auto"
            />
            <h2 className="mt-8 text-2xl/9 font-bold tracking-tight text-white">
              Recover Password
            </h2>
            <p className="mt-2 text-sm/6 text-white">
              <Link
                to="/login"
                className="font-semibold text-white underline decoration-zinc-600 hover:decoration-white underline-offset-3"
              >
                Go back to login
              </Link>
            </p>
          </div>

          <div className="mt-10">
            <div>
              <form
                className="space-y-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  form.handleSubmit();
                }}
              >
                <form.AppField
                  name="password"
                  children={(field) => (
                    <field.FormInput
                      label="New Password"
                      type="password"
                      autoComplete="new-password"
                    />
                  )}
                />

                <div>
                  {message && (
                    <Alert type={message.messageType} text={message.message} />
                  )}
                </div>
                <form.AppForm
                  children={<form.FormSubmit fullWidth label="Send" />}
                />
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="relative hidden w-0 flex-1 lg:block bg-linear-to-br transition-all from-[#2C5364] via-[#203A43] to-[#0F2027]" />
    </div>
  );
}
