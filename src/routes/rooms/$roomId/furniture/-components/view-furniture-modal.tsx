import GenericModal from "@/components/modal/generic-modal";
import { Button } from "@/components/shadcn/ui/button";
import Stack from "@/components/stack";
import useModal from "@/hooks/useModal/useModal";
import type { FromTrpcArrayValue } from "@/trpc/type-utils";


interface Props {
	furniture: FromTrpcArrayValue<"furniture", "getByRoomId">;
}

const ViewFurnitureModal = (props: Props) => {
	const { closeModal } = useModal();

	return (
		<GenericModal
			header="View furniture"
		>
			<Stack
				header="Name"
				description={props.furniture.name}
			/>

			<Stack
				header="Description"
				description={props.furniture.description}
			/>

			<Stack
				header="Room"
				description={props.furniture.room?.name}
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

export default ViewFurnitureModal;
