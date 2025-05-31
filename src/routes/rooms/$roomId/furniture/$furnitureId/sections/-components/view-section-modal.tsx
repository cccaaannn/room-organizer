import GenericModal from "@/components/modal/generic-modal";
import Stack from "@/components/stack";
import { Button } from "@/components/shadcn/ui/button";
import useModal from "@/hooks/useModal/useModal";
import type { FromTrpcArrayValue } from "@/trpc/type-utils";


interface Props {
	section: FromTrpcArrayValue<"section", "getByFurnitureId">;
}

const ViewSectionModal = (props: Props) => {
	const { closeModal } = useModal();

	return (
		<GenericModal
			header="View section"
		>
			<Stack
				header="Name"
				description={props.section.name}
			/>

			<Stack
				header="Description"
				description={props.section.description}
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

export default ViewSectionModal;
