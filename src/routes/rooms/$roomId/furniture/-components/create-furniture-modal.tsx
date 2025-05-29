import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import AppForm from "@/components/form/app-form";
import GenericModal from "@/components/modal/generic-modal";
import { Button } from "@/components/shadcn/ui/button";
import { useAppForm } from "@/hooks/useAppForm";
import useModal from "@/hooks/useModal/useModal";
import { createFurniture, CreateFurnitureScheme } from "@/routes/rooms/$roomId/furniture/-server-functions/create";
import { useTRPC } from "@/trpc/react";


interface Props {
	roomId: string;
}

const CreateFurnitureModal = (props: Props) => {
	const { closeModal } = useModal();

	const queryClient = useQueryClient();
	const trpc = useTRPC();
	const { data: rooms = [], isLoading } = useQuery(trpc.room.getAll.queryOptions());

	const roomSelectValues = rooms.map(r => ({ value: r.id, label: r.name })) ?? [];

	const form = useAppForm({
		defaultValues: {
			name: "",
			description: "",
			roomId: props.roomId
		},
		validators: {
			onChange: CreateFurnitureScheme
		},
		onSubmit: async ctx => {
			try {
				const response = await createFurniture({ data: ctx.value });
				queryClient.invalidateQueries({ queryKey: trpc.furniture.getByRoomId.queryKey() });
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
			header="Add furniture"
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
							disabled={isLoading}
							label="Save"
						/>
					</form.AppForm>
				</div>
			</AppForm>
		</GenericModal>
	);
};

export default CreateFurnitureModal;
