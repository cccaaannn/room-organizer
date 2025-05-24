import GenericModal from "@/components/modal/generic-modal";
import { Button } from "@/components/shadcn/ui/button";
import Stack from "@/components/stack";
import useModal from "@/hooks/useModal/useModal";
import type { FromTrpcArrayValue } from "@/trpc/type-utils";


interface Props {
	room: FromTrpcArrayValue<"room", "getAll">;
}

const ViewRoomModal = (props: Props) => {
	const { closeModal } = useModal();

	return (
		<GenericModal
			header="View room"
		>
			<Stack
				header="Name"
				description={props.room.name}
			/>

			<Stack
				header="Description"
				description={props.room.description}
			/>

			<div className="flex justify-end gap-2">
				<Button
					variant="secondary"
					onClick={closeModal}
				>
					Cancel
				</Button>
			</div>
		</GenericModal>
	);
};

export default ViewRoomModal;
