import { useMemo } from "react";

import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AlignVerticalJustifyEnd, Eye, PenLine, Trash } from "lucide-react";

import TooltipButton from "@/components/button/tooltip-button";
import GenericError from "@/components/generic-error";
import CrudLayout from "@/components/layout/crud-layout";
import SimpleBreadcrumb from "@/components/simple-breadcrumb";
import GenericTable, { type TableColumns } from "@/components/table/generic-table";
import useModal from "@/hooks/useModal/useModal";
import CreateSectionModal from "@/routes/rooms/$roomId/furniture/$furnitureId/sections/-components/create-section-modal";
import RemoveSectionModal from "@/routes/rooms/$roomId/furniture/$furnitureId/sections/-components/remove-section-modal";
import UpdateSectionModal from "@/routes/rooms/$roomId/furniture/$furnitureId/sections/-components/update-section-modal";
import ViewSectionModal from "@/routes/rooms/$roomId/furniture/$furnitureId/sections/-components/view-section-modal";
import { useTRPC } from "@/trpc/react";


export const Route = createFileRoute("/rooms/$roomId/furniture/$furnitureId/sections/")({
	component: List,
	errorComponent: () => <GenericError />,
	loader: async ({ context, params }) => {
		await context.queryClient.ensureQueryData(
			context.trpc.section.getByFurnitureId.queryOptions(params.furnitureId)
		);
	}
});

function List() {

	const { roomId, furnitureId } = Route.useParams();

	const trpc = useTRPC();
	const { data: sectionList = [] } = useQuery(trpc.section.getByFurnitureId.queryOptions(furnitureId));

	const { openModal } = useModal();

	const columns: TableColumns<typeof sectionList>[] = useMemo(() => [
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
							onClick={() => openModal(<ViewSectionModal section={row} />)}
						>
							<Eye />
						</TooltipButton>

						<TooltipButton
							tooltip="Edit items"
							asChild
							variant="default"
						>
							<Link
								to="/rooms/$roomId/furniture/$furnitureId/sections/$sectionId/items"
								params={{ roomId: roomId, furnitureId: furnitureId, sectionId: row.id }}
							>
								<AlignVerticalJustifyEnd />
							</Link>
						</TooltipButton>

						<TooltipButton
							tooltip="Edit"
							variant="default"
							onClick={() => openModal(<UpdateSectionModal section={row} />)}
						>
							<PenLine />
						</TooltipButton>

						<TooltipButton
							tooltip="Delete"
							variant="destructive"
							onClick={() => openModal(<RemoveSectionModal sectionId={row.id} />)}
						>
							<Trash />
						</TooltipButton>
					</div>
				);
			}
		}
	], [furnitureId, openModal, roomId]);

	return (
		<CrudLayout
			header="Sections"
			onAdd={() => openModal(<CreateSectionModal furnitureId={furnitureId} />)}

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
						</Link>
					]}
					currentPage="Sections"
				/>
			}
		>
			<GenericTable
				data={sectionList}
				columns={columns}
			/>
		</CrudLayout>
	);
}

export default List;
