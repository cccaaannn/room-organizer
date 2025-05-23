import GenericModal from "@/components/modal/generic-modal";
import { Button } from "@/components/shadcn/ui/button";
import useModal from "@/hooks/useModal/useModal";


interface Props {
	onRemove: () => void;
}

const RemoveModal = (props: Props) => {
	const { closeModal } = useModal();

	return (
		<GenericModal
			header="Are you sure you want to delete this resource?"
		>
			<div className="flex justify-end gap-2">
				<Button
					variant="secondary"
					onClick={closeModal}
				>
					Cancel
				</Button>

				<Button variant="destructive" onClick={props.onRemove}>
					Remove
				</Button>
			</div>
		</GenericModal>
	);
};

export default RemoveModal;
