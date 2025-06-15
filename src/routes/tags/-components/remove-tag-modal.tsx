import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import GenericModal from "@/components/modal/generic-modal";
import { Button } from "@/components/shadcn/ui/button";
import useModal from "@/hooks/useModal/useModal";
import { removeTag } from "@/routes/tags/-server-functions/remove";
import { useTRPC } from "@/trpc/react";


interface Props {
	tagId: string;
}

const RemoveTagModal = (props: Props) => {

	const { closeModal } = useModal();

	const queryClient = useQueryClient();
	const trpc = useTRPC();

	const remove = async () => {
		try {
			await removeTag({ data: { id: props.tagId } });
			queryClient.invalidateQueries({ queryKey: trpc.tag.getAll.queryKey() });
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
			header="Remove tag"
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

export default RemoveTagModal;
