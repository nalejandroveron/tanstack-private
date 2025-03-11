import { Link } from '@tanstack/react-router';
import { acceptInviteSchema } from '../../schemas/Auth';
import { FormInput, FormSubmit, createForm } from '../ui/Forms';

const { useAppForm } = createForm({
  fieldComponents: { FormInput },
  formComponents: { FormSubmit },
});

type AcceptInvitationProps = {
  invitation: {
    inviterName: string;
    organizationName: string;
  };
  onSubmit: (value: typeof acceptInviteSchema.infer) => Promise<unknown>;
};

export function AcceptInvitation({
  invitation,
  onSubmit,
}: AcceptInvitationProps) {
  const form = useAppForm({
    validators: { onChange: acceptInviteSchema },
    defaultValues: {
      userName: '',
      userPassword: '',
    },
    onSubmit: async ({ value }) => onSubmit(value),
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
            <h2 className="mt-8 text-l font-bold tracking-tight text-white">
              {invitation.inviterName} has invited you to join{' '}
              {invitation.organizationName}
            </h2>
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
                  name="userName"
                  children={(field) => (
                    <field.FormInput label="User Name" type="text" />
                  )}
                />
                <form.AppField
                  name="userPassword"
                  children={(field) => (
                    <field.FormInput label="Password" type="password" />
                  )}
                />
                <form.AppForm
                  children={
                    <form.FormSubmit fullWidth label="Accept Invitation" />
                  }
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
