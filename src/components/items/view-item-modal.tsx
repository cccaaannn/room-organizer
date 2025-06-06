import TagBadge from "@/components/badge/tag-badge";
import RelatedItemSection from "@/components/items/related-item-section";
import GenericModal from "@/components/modal/generic-modal";
import { Button } from "@/components/shadcn/ui/button";
import Stack from "@/components/stack";
import useModal from "@/hooks/useModal/useModal";
import type { FromTrpcArrayValue } from "@/trpc/type-utils";


interface Props {
	item: FromTrpcArrayValue<"item", "getBySectionId">;
}

const ViewItemModal = (props: Props) => {
	const { closeModal } = useModal();

	return (
		<GenericModal
			header="View item"
		>
			<Stack
				header="Name"
				description={props.item.name}
			/>

			<Stack
				header="Description"
				description={props.item.description}
			/>

			<Stack
				header="Tags"
				description={
					<div className="flex gap-2 flex-wrap justify-start">
						{
							props.item.itemsTags.length === 0 ? "-" :
								props.item.itemsTags.map(tag =>
									<TagBadge
										key={tag.tag.id}
										tag={tag.tag}
									/>
								)
						}
					</div>
				}
			/>

			<Stack
				header="Related items"
				description={
					<div className="flex gap-2 flex-wrap justify-start h-[200px] overflow-y-auto">
						<RelatedItemSection itemId={props.item.id} />
					</div>
				}
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

export default ViewItemModal;
