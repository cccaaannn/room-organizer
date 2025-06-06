import { useEffect, useMemo, useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Eye, PenLine, Trash } from "lucide-react";
import { z } from "zod";

import TooltipButton from "@/components/button/tooltip-button";
import NameFilter from "@/components/filter/name-filter";
import TagFilter from "@/components/filter/tag-filter";
import GenericError from "@/components/generic-error";
import TagsCell from "@/components/items/tags-cell";
import ViewItemModal from "@/components/items/view-item-modal";
import CrudLayout from "@/components/layout/crud-layout";
import SimpleBreadcrumb from "@/components/simple-breadcrumb";
import GenericTable, { type TableColumns } from "@/components/table/generic-table";
import useModal from "@/hooks/useModal/useModal";
import CreateItemModal from "@/routes/rooms/$roomId/furniture/$furnitureId/sections/$sectionId/items/-components/create-item-modal";
import RemoveItemModal from "@/routes/rooms/$roomId/furniture/$furnitureId/sections/$sectionId/items/-components/remove-item-modal";
import UpdateItemModal from "@/routes/rooms/$roomId/furniture/$furnitureId/sections/$sectionId/items/-components/update-item-modal";
import { useTRPC } from "@/trpc/react";


const SearchSchema = z.object({
	tags: z.array(z.string().uuid()).default([]),
	name: z.string().optional()
});

export const Route = createFileRoute("/rooms/$roomId/furniture/$furnitureId/sections/$sectionId/items/")({
	component: List,
	errorComponent: () => <GenericError />,
	loader: async ({ context, params }) => {
		await context.queryClient.ensureQueryData(
			context.trpc.item.getBySectionId.queryOptions(params.sectionId)
		);
	},
	validateSearch: SearchSchema
});

function List() {

	const { roomId, furnitureId, sectionId } = Route.useParams();

	const { openModal } = useModal();

	const trpc = useTRPC();
	const { data: itemList = [] } = useQuery(trpc.item.getBySectionId.queryOptions(sectionId));

	const [filteredItemList, setFilteredItemList] = useState(itemList ?? []);
	const { tags, name } = Route.useSearch();

	useEffect(() => {
		let filteredList = [...itemList];
		if (name) {
			filteredList = filteredList.filter(item =>
				item.name.toLowerCase().includes(name.toLowerCase())
			);
		}

		if (tags.length > 0) {
			filteredList = filteredList.filter(item =>
				item.itemsTags.some(itemTag => tags.some(selectedTag => selectedTag === itemTag.tagId))
			);
		}

		setFilteredItemList(filteredList);
	}, [tags, name, itemList]);

	const columns: TableColumns<typeof itemList>[] = useMemo(() => [
		{ label: "Name", value: "name", cellClassName: "w-60" },
		{ label: "Description", value: "description", cellClassName: "w-60" },
		{ label: "Created", value: "createdAt", type: "datetime", cellClassName: "w-40" },
		{ label: "Updated", value: "updatedAt", type: "datetime", cellClassName: "w-40" },
		{
			label: "Tags",
			value: "itemsTags",
			cellClassName: "w-40",
			renderCell: row => <TagsCell itemsTags={row.itemsTags} />
		},
		{
			label: "Actions",
			type: "action",
			colClassName: "pr-14 text-right",
			renderCell: row => {
				return (
					<div className="flex items-center justify-end gap-2">
						<TooltipButton
							tooltip="View"
							variant="secondary"
							onClick={() => openModal(<ViewItemModal item={row} />)}
						>
							<Eye />
						</TooltipButton>

						<TooltipButton
							tooltip="Edit"
							variant="default"
							onClick={() => openModal(<UpdateItemModal item={row} />)}
						>
							<PenLine />
						</TooltipButton>

						<TooltipButton
							tooltip="Delete"
							variant="destructive"
							onClick={() => openModal(<RemoveItemModal itemId={row.id} />)}
						>
							<Trash />
						</TooltipButton>
					</div>
				);
			}
		}
	], [openModal]);

	return (
		<CrudLayout
			header="Items"
			onAdd={() => openModal(<CreateItemModal sectionId={sectionId} />)}
			breadcrumb={
				<SimpleBreadcrumb
					links={[
						<Link key="rooms" to="/rooms">
							Rooms
						</Link>,
						<Link
							key="furniture"
							to="/rooms/$roomId/furniture"
							params={{ roomId: roomId }}
						>
							Furniture
						</Link>,
						<Link
							key="sections"
							to="/rooms/$roomId/furniture/$furnitureId/sections"
							params={{ roomId: roomId, furnitureId: furnitureId }}
						>
							Sections
						</Link>
					]}
					currentPage="Items"
				/>
			}
		>
			<div className="flex gap-2 items-center flex-wrap self-end">
				<NameFilter route={Route} />

				<TagFilter route={Route} />
			</div>

			<GenericTable
				data={filteredItemList}
				columns={columns}
			/>
		</CrudLayout>
	);
}

export default List;
