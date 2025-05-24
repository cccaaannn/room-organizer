import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import AppForm from "@/components/form/app-form";
import GenericModal from "@/components/modal/generic-modal";
import { Button } from "@/components/shadcn/ui/button";
import { useAppForm } from "@/hooks/useAppForm";
import useModal from "@/hooks/useModal/useModal";
import { updateRoom, UpdateRoomScheme } from "@/routes/rooms/-server-functions/update";
import { useTRPC } from "@/trpc/react";
import type { FromTrpcArrayValue } from "@/trpc/type-utils";


interface Props {
	room: FromTrpcArrayValue<"room", "getAll">;
}

const UpdateRoomModal = (props: Props) => {
	const { closeModal } = useModal();

	const queryClient = useQueryClient();
	const trpc = useTRPC();

	const form = useAppForm({
		defaultValues: {
			id: props.room.id,
			name: props.room.name,
			description: props.room.description
		},
		validators: {
			onChange: UpdateRoomScheme
		},
		onSubmit: async ctx => {
			try {
				const response = await updateRoom({ data: ctx.value });
				queryClient.invalidateQueries({ queryKey: trpc.room.getAll.queryKey() });
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
			header="Update room"
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
						<form.Button label="Save" />
					</form.AppForm>
				</div>
			</AppForm>
		</GenericModal>
	);
};

export default UpdateRoomModal;
