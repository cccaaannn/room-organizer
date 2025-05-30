import { useMemo } from "react";

import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Eye, LayoutTemplate, PenLine, Trash } from "lucide-react";

import TooltipButton from "@/components/button/tooltip-button";
import GenericError from "@/components/generic-error";
import CrudLayout from "@/components/layout/crud-layout";
import SimpleBreadcrumb from "@/components/simple-breadcrumb";
import GenericTable, { type TableColumns } from "@/components/table/generic-table";
import useModal from "@/hooks/useModal/useModal";
import CreateFurnitureModal from "@/routes/rooms/$roomId/furniture/-components/create-furniture-modal";
import RemoveFurnitureModal from "@/routes/rooms/$roomId/furniture/-components/remove-furniture-modal";
import UpdateFurnitureModal from "@/routes/rooms/$roomId/furniture/-components/update-furniture-modal";
import ViewFurnitureModal from "@/routes/rooms/$roomId/furniture/-components/view-furniture-modal";
import { useTRPC } from "@/trpc/react";


export const Route = createFileRoute("/rooms/$roomId/furniture/")({
	component: List,
	errorComponent: () => <GenericError />,
	loader: async ({ context, params }) => {
		await context.queryClient.ensureQueryData(
			context.trpc.furniture.getByRoomId.queryOptions(params.roomId)
		);
	}
});

function List() {

	const { roomId } = Route.useParams();

	const trpc = useTRPC();
	const { data: furnitureList = [] } = useQuery(trpc.furniture.getByRoomId.queryOptions(roomId));

	const { openModal } = useModal();

	const columns: TableColumns<typeof furnitureList>[] = useMemo(() => [
		{ label: "Name", value: "name", cellClassName: "w-60" },
		{ label: "Description", value: "description", cellClassName: "w-60" },
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
							onClick={() => openModal(<ViewFurnitureModal furniture={row} />)}
						>
							<Eye />
						</TooltipButton>

						<TooltipButton
							tooltip="Edit sections"
							asChild
							variant="default"
						>
							<Link
								to="/rooms/$roomId/furniture/$furnitureId/sections"
								params={{ roomId: row.roomId, furnitureId: row.id }}
							>
								<LayoutTemplate />
							</Link>
						</TooltipButton>

						<TooltipButton
							tooltip="Edit"
							variant="default"
							onClick={() => openModal(<UpdateFurnitureModal furniture={row} />)}
						>
							<PenLine />
						</TooltipButton>

						<TooltipButton
							tooltip="Delete"
							variant="destructive"
							onClick={() => openModal(<RemoveFurnitureModal furnitureId={row.id} />)}
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
			header="Furniture"
			onAdd={() => openModal(<CreateFurnitureModal roomId={roomId} />)}

			breadcrumb={
				<SimpleBreadcrumb
					links={[
						<Link key="rooms" to="/rooms">
							Rooms
						</Link>
					]}
					currentPage="Furniture"
				/>
			}
		>
			<GenericTable
				data={furnitureList}
				columns={columns}
			/>
		</CrudLayout>
	);
}

export default List;
