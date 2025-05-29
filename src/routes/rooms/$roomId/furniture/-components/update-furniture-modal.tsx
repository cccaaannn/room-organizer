import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import AppForm from "@/components/form/app-form";
import GenericModal from "@/components/modal/generic-modal";
import { Button } from "@/components/shadcn/ui/button";
import { useAppForm } from "@/hooks/useAppForm";
import useModal from "@/hooks/useModal/useModal";
import { updateFurniture, UpdateFurnitureScheme } from "@/routes/rooms/$roomId/furniture/-server-functions/update";
import { useTRPC } from "@/trpc/react";
import type { FromTrpcArrayValue } from "@/trpc/type-utils";


interface Props {
	furniture: FromTrpcArrayValue<"furniture", "getByRoomId">;
}

const UpdateFurnitureModal = (props: Props) => {
	const { closeModal } = useModal();

	const queryClient = useQueryClient();
	const trpc = useTRPC();
	const { data: rooms = [], isLoading: roomsLoading } = useQuery(trpc.room.getAll.queryOptions());

	const roomSelectValues = rooms.map(r => ({ value: r.id, label: r.name })) ?? [];

	const form = useAppForm({
		defaultValues: {
			id: props.furniture.id,
			name: props.furniture.name,
			description: props.furniture.description,
			roomId: props.furniture.roomId
		},
		validators: {
			onChange: UpdateFurnitureScheme
		},
		onSubmit: async ctx => {
			try {
				const response = await updateFurniture({ data: ctx.value });
				queryClient.invalidateQueries({ queryKey: trpc.furniture.getByRoomId.queryKey() });
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
			header="Update furniture"
		>
			<AppForm handleSubmit={form.handleSubmit}>
				<form.AppField name="name">
					{field => <field.TextField label="Name" />}
				</form.AppField>

				<form.AppField name="description">
					{field => <field.TextArea label="Description" />}
				</form.AppField>

				<form.AppField name="roomId">
					{field => <field.Select label="Room" values={roomSelectValues} />}
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
							disabled={roomsLoading}
							label="Save"
						/>
					</form.AppForm>
				</div>
			</AppForm>
		</GenericModal>
	);
};

export default UpdateFurnitureModal;
