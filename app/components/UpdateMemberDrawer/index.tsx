import type { getMember } from '../../../services/MembersService';
import { updateMemberSchema } from '../../schemas/Member';
import { Button } from '../ui/Button';
import Dialog from '../ui/Dialog';
import { FormSelect, FormSubmit, createForm } from '../ui/Forms';

type UpdateMemberDrawerProps = {
  onClose: () => void;
  member: Awaited<ReturnType<typeof getMember>>;
  onUpdate: (data: typeof updateMemberSchema.infer) => void;
  onRemove: () => void;
};

const { useAppForm } = createForm({
  fieldComponents: { FormSelect },
  formComponents: { FormSubmit },
});

export function UpdateMemberDrawer({
  member,
  onClose,
  onUpdate,
  onRemove,
}: UpdateMemberDrawerProps) {
  const form = useAppForm({
    validators: { onChange: updateMemberSchema },
    defaultValues: { role: member.member.role as 'admin' | 'member' },
    onSubmit: async ({ value }) => onUpdate(value),
  });

  return (
    <Dialog
      open
      title="Update Member"
      setOpen={onClose}
      footer={
        <div className="w-full flex justify-between gap-2 whitespace-nowrap">
          <Button
            type="button"
            kind="destructive"
            onClick={onRemove}
            label="Remove Member"
          />
          <div className="w-full flex justify-end gap-2">
            <Button
              type="button"
              kind="button"
              onClick={onClose}
              label="Cancel"
            />
            <form.AppForm
              children={<form.FormSubmit label="Update" form="update-form" />}
            />
          </div>
        </div>
      }
    >
      <form
        id="update-form"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div>
          <span className="block text-sm/6 font-medium text-white">
            Member Email
          </span>
          <span className="block pr-8 py-2 text-sm">{member.user?.email}</span>
        </div>
        <form.AppField
          name="role"
          children={(field) => (
            <field.FormSelect
              label="Member role"
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
