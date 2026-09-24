import { useForm } from '@tanstack/react-form';
import { useEffect, useRef } from 'react';
import { z } from 'zod/v4';

import { Button } from '@colanode/ui/components/ui/button';
import { Field, FieldError } from '@colanode/ui/components/ui/field';
import { Input } from '@colanode/ui/components/ui/input';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
});

export type CategoryFormValues = z.infer<typeof formSchema>;

interface CategoryFormProps {
  values: CategoryFormValues;
  submitText: string;
  onCancel: () => void;
  onSubmit: (values: CategoryFormValues) => void;
}

export const CategoryForm = ({
  values,
  submitText,
  onCancel,
  onSubmit,
}: CategoryFormProps) => {
  const nameInputRef = useRef<HTMLInputElement>(null);

  const form = useForm({
    defaultValues: values,
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      onSubmit(value);
    },
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      nameInputRef.current?.focus();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <form
      className="flex flex-col"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <div className="grow py-2 pb-4">
        <form.Field
          name="name"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <Input
                  ref={nameInputRef}
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="Category name"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{submitText}</Button>
      </div>
    </form>
  );
};
