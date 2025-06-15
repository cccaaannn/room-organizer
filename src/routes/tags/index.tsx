import { useMemo } from "react";

import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Eye, PenLine, Trash } from "lucide-react";

import TooltipButton from "@/components/button/tooltip-button";
import GenericError from "@/components/generic-error";
import CrudLayout from "@/components/layout/crud-layout";
import SimpleBreadcrumb from "@/components/simple-breadcrumb";
import GenericTable, { type TableColumns } from "@/components/table/generic-table";
import useModal from "@/hooks/useModal/useModal";
import CreateTagModal from "@/routes/tags/-components/create-tag-modal";
import RemoveTagModal from "@/routes/tags/-components/remove-tag-modal";
import UpdateTagModal from "@/routes/tags/-components/update-tag-modal";
import ViewTagModal from "@/routes/tags/-components/view-tag-modal";
import { useTRPC } from "@/trpc/react";


export const Route = createFileRoute("/tags/")({
	component: List,
	errorComponent: () => <GenericError />,
	loader: async ({ context }) => {
		await context.queryClient.ensureQueryData(
			context.trpc.tag.getAll.queryOptions()
		);
	}
});

function List() {

	const trpc = useTRPC();
	const { data: tagList = [] } = useQuery(trpc.tag.getAll.queryOptions());

	const { openModal } = useModal();

	const columns: TableColumns<typeof tagList>[] = useMemo(() => [
		{ label: "Name", value: "name", cellClassName: "w-60" },
		{ label: "Description", value: "description", cellClassName: "w-60" },
		{
			label: "Color",
			value: "color",
			cellClassName: "w-20",
			renderCell: row => <div className="w-4 h-4 rounded-full" style={{ backgroundColor: row.color }} />
		},
		{ label: "Created", value: "createdAt", type: "datetime", cellClassName: "w-40" },
		{ label: "Updated", value: "updatedAt", type: "datetime", cellClassName: "w-40" },
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
							onClick={() => openModal(<ViewTagModal tag={row} />)}
						>
							<Eye />
						</TooltipButton>

						<TooltipButton
							tooltip="Edit"
							variant="default"
							onClick={() => openModal(<UpdateTagModal tag={row} />)}
						>
							<PenLine />
						</TooltipButton>

						<TooltipButton
							tooltip="Delete"
							variant="destructive"
							onClick={() => openModal(<RemoveTagModal tagId={row.id} />)}
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
			header="Tags"
			onAdd={() => openModal(<CreateTagModal />)}

			breadcrumb={
				<SimpleBreadcrumb
					currentPage="Tags"
				/>
			}
		>
			<GenericTable
				data={tagList}
				columns={columns}
			/>
		</CrudLayout>
	);
}

export default List;
