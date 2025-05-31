import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import GenericModal from "@/components/modal/generic-modal";
import { Button } from "@/components/shadcn/ui/button";
import useModal from "@/hooks/useModal/useModal";
import { removeSection } from "@/routes/rooms/$roomId/furniture/$furnitureId/sections/-server-functions/remove";
import { useTRPC } from "@/trpc/react";


interface Props {
	sectionId: string;
}

const RemoveSectionModal = (props: Props) => {

	const { closeModal } = useModal();

	const queryClient = useQueryClient();
	const trpc = useTRPC();

	const remove = async () => {
		try {
			await removeSection({ data: { id: props.sectionId } });
			queryClient.invalidateQueries({ queryKey: trpc.section.getByFurnitureId.queryKey() });
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
			header="Remove section"
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

export default RemoveSectionModal;
