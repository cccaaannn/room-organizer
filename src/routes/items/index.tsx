import { useEffect, useMemo, useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { AlignVerticalJustifyEnd, Eye } from "lucide-react";
import { z } from "zod";

import TooltipButton from "@/components/button/tooltip-button";
import NameFilter from "@/components/filter/name-filter";
import TagFilter from "@/components/filter/tag-filter";
import GenericError from "@/components/generic-error";
import TagsCell from "@/components/items/tags-cell";
import ViewItemModal from "@/components/items/view-item-modal";
import GenericLayout from "@/components/layout/generic-layout";
import SimpleBreadcrumb from "@/components/simple-breadcrumb";
import GenericTable, { type TableColumns } from "@/components/table/generic-table";
import useModal from "@/hooks/useModal/useModal";
import { getCurrentUser } from "@/middlewares/current-user-middleware";
import { useTRPC } from "@/trpc/react";


const SearchSchema = z.object({
	tags: z.array(z.string().uuid()).default([]),
	name: z.string().optional()
});

export const Route = createFileRoute("/items/")({
	component: List,
	errorComponent: () => <GenericError />,
	beforeLoad: async () => {
		const userResponse = await getCurrentUser();
		if (userResponse.error || !userResponse.result.user) {
			redirect({
				to: "/auth/signin",
				throw: true
			});
		}
		return { user: userResponse.result.user };
	},
	loader: async ({ context }) => {
		await context.queryClient.ensureQueryData(
			context.trpc.item.getAll.queryOptions()
		);

		return {
			user: context.user
		};
	},
	validateSearch: SearchSchema
});

function List() {

	const { openModal } = useModal();

	const trpc = useTRPC();
	const { data: itemList = [] } = useQuery(trpc.item.getAll.queryOptions());

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
		{
			label: "Section",
			value: "section",
			cellClassName: "w-40",
			renderCell: row => row.section.name
		},
		{
			label: "Furniture",
			value: "section",
			cellClassName: "w-40",
			renderCell: row => row.section.furniture.name
		},
		{
			label: "Room",
			value: "section",
			cellClassName: "w-40",
			renderCell: row => row.section.furniture.room.name
		},
		{
			label: "tags",
			value: "itemsTags",
			cellClassName: "w-40",
			renderCell: row => <TagsCell itemsTags={row.itemsTags} />
		},
		{ label: "Created", value: "createdAt", type: "datetime", cellClassName: "w-40" },
		{ label: "Updated", value: "updatedAt", type: "datetime", cellClassName: "w-40" },
		{
			label: "actions",
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
							tooltip="Go to section"
							asChild
							variant="default"
						>
							<Link
								to="/rooms/$roomId/furniture/$furnitureId/sections/$sectionId/items"
								params={{ roomId: row.section.furniture.roomId, furnitureId: row.section.furnitureId, sectionId: row.sectionId }}
							>
								<AlignVerticalJustifyEnd />
							</Link>
						</TooltipButton>
					</div>
				);
			}
		}
	], [openModal]);

	return (
		<GenericLayout
			header="All Items"
			breadcrumb={
				<SimpleBreadcrumb
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
		</GenericLayout>
	);
}

export default List;
