import GenericModal from "@/components/modal/generic-modal";
import Stack from "@/components/stack";
import { Button } from "@/components/shadcn/ui/button";
import useModal from "@/hooks/useModal/useModal";
import type { FromTrpcArrayValue } from "@/trpc/type-utils";


interface Props {
	tag: FromTrpcArrayValue<"tag", "getAll">;
}

const ViewTagModal = (props: Props) => {
	const { closeModal } = useModal();

	return (
		<GenericModal
			header="View tag"
		>
			<Stack
				header="Name"
				description={props.tag.name}
			/>

			<Stack
				header="Description"
				description={props.tag.description}
			/>

			<Stack
				header="Color"
				description={props.tag.color}
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

export default ViewTagModal;
