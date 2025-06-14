import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import AppForm from "@/components/form/app-form";
import GenericModal from "@/components/modal/generic-modal";
import { Button } from "@/components/shadcn/ui/button";
import { useAppForm } from "@/hooks/useAppForm";
import useModal from "@/hooks/useModal/useModal";
import { updateTag, UpdateTagScheme } from "@/routes/tags/-server-functions/update";
import { useTRPC } from "@/trpc/react";
import type { FromTrpcArrayValue } from "@/trpc/type-utils";


interface Props {
	tag: FromTrpcArrayValue<"tag", "getAll">;
}

const UpdateTagModal = (props: Props) => {
	const { closeModal } = useModal();

	const queryClient = useQueryClient();
	const trpc = useTRPC();

	const form = useAppForm({
		defaultValues: {
			id: props.tag.id,
			name: props.tag.name,
			description: props.tag.description,
			color: props.tag.color
		},
		validators: {
			onChange: UpdateTagScheme
		},
		onSubmit: async ctx => {
			try {
				const response = await updateTag({ data: ctx.value });
				queryClient.invalidateQueries({ queryKey: trpc.tag.getAll.queryKey() });
				closeModal();
				toast(`${response.result.name} updated`);
			}
			catch (error) {
				console.error(error);
				toast(`${error}`);
			}
		}
	});

	return (
		<GenericModal
			header="Update tag"
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

export default UpdateTagModal;
