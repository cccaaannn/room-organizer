import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import AppForm from "@/components/form/app-form";
import GenericModal from "@/components/modal/generic-modal";
import { Button } from "@/components/shadcn/ui/button";
import { useAppForm } from "@/hooks/useAppForm";
import useModal from "@/hooks/useModal/useModal";
import { createTag, CreateTagScheme } from "@/routes/tags/-server-functions/create";
import { useTRPC } from "@/trpc/react";


const CreateTagModal = () => {
	const { closeModal } = useModal();

	const queryClient = useQueryClient();
	const trpc = useTRPC();

	const form = useAppForm({
		defaultValues: {
			name: "",
			description: "",
			color: ""
		},
		validators: {
			onChange: CreateTagScheme
		},
		onSubmit: async ctx => {
			try {
				const response = await createTag({ data: ctx.value });
				queryClient.invalidateQueries({ queryKey: trpc.tag.getAll.queryKey() });
				closeModal();
				toast(`${response.result.name} created`);
			}
			catch (error) {
				console.error(error);
				toast(`${error}`);
			}
		}
	});

	return (
		<GenericModal
			header="Add tag"
		>
			<AppForm handleSubmit={form.handleSubmit}>
				<form.AppField name="name">
					{field => <field.TextField label="Name" />}
				</form.AppField>

				<form.AppField name="description">
					{field => <field.TextArea label="Description" />}
				</form.AppField>

				<form.AppField name="color">
					{field => <field.ColorPicker label="Color" />}
				</form.AppField>

				<div className="flex justify-end gap-2">
					<Button
						variant="secondary"
						onClick={closeModal}
					>
						Cancel
					</Button>

					<form.AppForm>
						<form.Button
							label="Save"
						/>
					</form.AppForm>
				</div>
			</AppForm>
		</GenericModal>
	);
};

export default CreateTagModal;
