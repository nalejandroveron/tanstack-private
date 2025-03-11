import { Link } from '@tanstack/react-router';
import { signupSchema } from '../../schemas/Auth';
import { FormInput, FormSubmit, createForm } from '../ui/Forms';

const { useAppForm } = createForm({
  fieldComponents: { FormInput },
  formComponents: { FormSubmit },
});

type SignupProps = {
  onSubmit: (value: typeof signupSchema.infer) => Promise<unknown>;
};

export function Signup({ onSubmit }: SignupProps) {
  const form = useAppForm({
    validators: { onChange: signupSchema },
    defaultValues: {
      userName: '',
      userEmail: '',
      userPassword: '',
      organizationName: '',
    },
    onSubmit: async ({ value }) => onSubmit(value),
  });

  return (
    <div className="flex min-h-full flex-1">
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <img
              alt="Your Company"
              src="https://tailwindui.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
              className="h-10 w-auto"
            />
            <h2 className="mt-8 text-2xl/9 font-bold tracking-tight text-white">
              Create an account
            </h2>
            <p className="mt-2 text-sm/6 text-white">
              Already a member?{' '}
              <Link
                to="/login"
                className="font-semibold text-white underline decoration-zinc-600 hover:decoration-white underline-offset-3"
              >
                Sign in
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
                  name="organizationName"
                  children={(field) => (
                    <field.FormInput label="Organization Name" type="text" />
                  )}
                />
                <form.AppField
                  name="userName"
                  children={(field) => (
                    <field.FormInput label="User Name" type="text" />
                  )}
                />
                <form.AppField
                  name="userEmail"
                  children={(field) => (
                    <field.FormInput label="Email address" type="email" />
                  )}
                />
                <form.AppField
                  name="userPassword"
                  children={(field) => (
                    <field.FormInput label="Password" type="password" />
                  )}
                />
                <form.AppForm
                  children={<form.FormSubmit fullWidth label="Sign Up" />}
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
