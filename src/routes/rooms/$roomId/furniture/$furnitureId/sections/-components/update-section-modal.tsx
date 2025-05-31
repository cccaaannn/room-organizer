import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import AppForm from "@/components/form/app-form";
import GenericModal from "@/components/modal/generic-modal";
import { Button } from "@/components/shadcn/ui/button";
import { useAppForm } from "@/hooks/useAppForm";
import useModal from "@/hooks/useModal/useModal";
import { updateSection, UpdateSectionScheme } from "@/routes/rooms/$roomId/furniture/$furnitureId/sections/-server-functions/update";
import { useTRPC } from "@/trpc/react";
import type { FromTrpcArrayValue } from "@/trpc/type-utils";


interface Props {
	section: FromTrpcArrayValue<"section", "getByFurnitureId">;
}

const UpdateSectionModal = (props: Props) => {
	const { closeModal } = useModal();

	const queryClient = useQueryClient();
	const trpc = useTRPC();

	const form = useAppForm({
		defaultValues: {
			id: props.section.id,
			name: props.section.name,
			description: props.section.description,
			furnitureId: props.section.furnitureId
		},
		validators: {
			onChange: UpdateSectionScheme
		},
		onSubmit: async ctx => {
			try {
				const response = await updateSection({ data: ctx.value });
				queryClient.invalidateQueries({ queryKey: trpc.section.getByFurnitureId.queryKey() });
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
			header="Update section"
		>
			<AppForm handleSubmit={form.handleSubmit}>
				<form.AppField name="name">
					{field => <field.TextField label="Name" />}
				</form.AppField>

				<form.AppField name="description">
					{field => <field.TextArea label="Description" />}
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

export default UpdateSectionModal;
