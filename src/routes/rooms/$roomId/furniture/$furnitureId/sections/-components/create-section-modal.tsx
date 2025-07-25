import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import AppForm from "@/components/form/app-form";
import GenericModal from "@/components/modal/generic-modal";
import { Button } from "@/components/shadcn/ui/button";
import { useAppForm } from "@/hooks/useAppForm";
import useModal from "@/hooks/useModal/useModal";
import { createSection, CreateSectionScheme } from "@/routes/rooms/$roomId/furniture/$furnitureId/sections/-server-functions/create";
import { useTRPC } from "@/trpc/react";


interface Props {
	furnitureId: string;
}

const CreateSectionModal = (props: Props) => {
	const { closeModal } = useModal();

	const queryClient = useQueryClient();
	const trpc = useTRPC();

	const form = useAppForm({
		defaultValues: {
			name: "",
			description: "",
			furnitureId: props.furnitureId
		},
		validators: {
			onChange: CreateSectionScheme
		},
		onSubmit: async ctx => {
			try {
				const response = await createSection({ data: ctx.value });
				queryClient.invalidateQueries({ queryKey: trpc.section.getByFurnitureId.queryKey() });
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
			header="Add section"
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

export default CreateSectionModal;
