import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import GenericModal from "@/components/modal/generic-modal";
import { Button } from "@/components/shadcn/ui/button";
import useModal from "@/hooks/useModal/useModal";
import { removeFurniture } from "@/routes/rooms/$roomId/furniture/-server-functions/remove";
import { useTRPC } from "@/trpc/react";


interface Props {
	furnitureId: string;
}

const RemoveFurnitureModal = (props: Props) => {

	const { closeModal } = useModal();

	const queryClient = useQueryClient();
	const trpc = useTRPC();

	const remove = async () => {
		try {
			await removeFurniture({ data: { id: props.furnitureId } });
			queryClient.invalidateQueries({ queryKey: trpc.furniture.getByRoomId.queryKey() });
			closeModal();
			toast("Deleted");
		}
		catch (error) {
			console.error(error);
			toast(`${error}`);
		}
	};

	return (
		<GenericModal
			header="Remove furniture"
		>
			<div className="flex justify-end gap-2">
				<Button
					variant="secondary"
					onClick={closeModal}
				>
					Cancel
				</Button>

				<Button variant="destructive" onClick={remove}>
					Remove
				</Button>
			</div>
		</GenericModal>
	);
};

export default RemoveFurnitureModal;
