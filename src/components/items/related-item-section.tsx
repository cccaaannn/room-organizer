import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";

import { Button } from "@/components/shadcn/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/ui/table";
import useModal from "@/hooks/useModal/useModal";
import { useTRPC } from "@/trpc/react";


interface Props {
	itemId: string;
}

const RelatedItemSection = (props: Props) => {

	const { closeModal } = useModal();
	const trpc = useTRPC();
	const { data: item, isLoading } = useQuery(trpc.item.getById.queryOptions(props.itemId));

	const linkClick = () => {
		closeModal();
	};

	return (
		<div className="w-full h-full">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="text-center">
							Item
						</TableHead>

						<TableHead className="text-center">
							Section
						</TableHead>

						<TableHead className="text-center">
							Furniture
						</TableHead>

						<TableHead className="text-center">
							Room
						</TableHead>
					</TableRow>
				</TableHeader>

				<TableBody>
					{
						isLoading
						&&
						<TableRow>
							<TableCell colSpan={4} className="text-center">Loading...</TableCell>
						</TableRow>
					}

					{
						!isLoading && (!item?.relatedItems || item.relatedItems.length === 0)
						&&
						<TableRow>
							<TableCell colSpan={4} className="text-center">No related items</TableCell>
						</TableRow>
					}

					{
						item?.relatedItems
						&&
						item.relatedItems.map(relatedItemMap =>
							<TableRow key={relatedItemMap.relatedItem.id}>
								<TableCell className="text-center">
									{relatedItemMap.relatedItem.name}
								</TableCell>

								<TableCell className="text-center">
									<Button asChild variant="link" onClick={linkClick}>
										<Link
											key="sections"
											to="/rooms/$roomId/furniture/$furnitureId/sections"
											params={{ roomId: relatedItemMap.relatedItem.section.furniture.roomId, furnitureId: relatedItemMap.relatedItem.section.furnitureId }}
										>
											{relatedItemMap.relatedItem.section.name}
										</Link>
									</Button>
								</TableCell>

								<TableCell className="text-center">
									<Button asChild variant="link" onClick={linkClick}>
										<Link
											key="furniture"
											to="/rooms/$roomId/furniture"
											params={{ roomId: relatedItemMap.relatedItem.section.furniture.roomId }}
										>
											{relatedItemMap.relatedItem.section.furniture.name}
										</Link>
									</Button>
								</TableCell>

								<TableCell className="text-center">
									<Button asChild variant="link" onClick={linkClick}>
										<Link
											key="room"
											to="/rooms"
										>
											{relatedItemMap.relatedItem.section.furniture.room.name}
										</Link>
									</Button>
								</TableCell>
							</TableRow>
						)
					}
				</TableBody>
			</Table>
		</div >
	);
};

export default RelatedItemSection;
