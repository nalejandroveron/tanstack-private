import { inviteMemberSchema } from '../../schemas/Member';
import { Button } from '../ui/Button';
import Dialog from '../ui/Dialog';
import { FormInput, FormSelect, FormSubmit, createForm } from '../ui/Forms';

type InviteMemberDrawerProps = {
  onClose: () => void;
  onInvite: (data: typeof inviteMemberSchema.infer) => void;
};

const { useAppForm } = createForm({
  fieldComponents: { FormInput, FormSelect },
  formComponents: { FormSubmit },
});

export function InviteMemberDrawer({
  onClose,
  onInvite,
}: InviteMemberDrawerProps) {
  const form = useAppForm({
    validators: { onChange: inviteMemberSchema },
    defaultValues: { email: '', role: 'member' as const },
    onSubmit: async ({ value }) => onInvite(value),
  });

  return (
    <Dialog
      open
      title="Invite Member"
      setOpen={onClose}
      footer={
        <>
          <Button
            type="button"
            kind="button"
            onClick={onClose}
            label="Cancel"
          />
          <form.AppForm
            children={<form.FormSubmit label="Invite" form="invite-form" />}
          />
        </>
      }
    >
      <form
        id="invite-form"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <form.AppField
          name="email"
          children={(field) => (
            <field.FormInput
              label="Invitee email"
              type="email"
              autoComplete="email"
            />
          )}
        />
        <form.AppField
          name="role"
          children={(field) => (
            <field.FormSelect
              label="Invitee role"
              options={[
                { label: 'Admin', value: 'admin' },
                { label: 'Member', value: 'member' },
              ]}
            />
          )}
        />
      </form>
    </Dialog>
  );
}
