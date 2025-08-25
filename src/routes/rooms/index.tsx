import { useMemo } from "react";

import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { Armchair, Eye, PenLine, Trash } from "lucide-react";

import TooltipButton from "@/components/button/tooltip-button";
import GenericError from "@/components/generic-error";
import CrudLayout from "@/components/layout/crud-layout";
import SimpleBreadcrumb from "@/components/simple-breadcrumb";
import GenericTable, { type TableColumns } from "@/components/table/generic-table";
import useModal from "@/hooks/useModal/useModal";
import { getCurrentUser } from "@/middlewares/current-user-middleware";
import CreateRoomModal from "@/routes/rooms/-components/create-room-modal";
import RemoveRoomModal from "@/routes/rooms/-components/remove-room-modal";
import UpdateRoomModal from "@/routes/rooms/-components/update-room-modal";
import ViewRoomModal from "@/routes/rooms/-components/view-room-modal";
import { useTRPC } from "@/trpc/react";


export const Route = createFileRoute("/rooms/")({
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
			context.trpc.room.getAll.queryOptions()
		);

		return {
			user: context.user
		};
	}
});

function List() {

	const trpc = useTRPC();
	const { data: rooms = [] } = useQuery(trpc.room.getAll.queryOptions());

	const { openModal } = useModal();

	const columns: TableColumns<typeof rooms>[] = useMemo(() => [
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
							onClick={() => openModal(<ViewRoomModal room={row} />)}
						>
							<Eye />
						</TooltipButton>

						<TooltipButton
							asChild
							tooltip="Edit furniture"
							variant="default"
						>
							<Link
								to="/rooms/$roomId/furniture"
								params={{ roomId: row.id }}
							>
								<Armchair />
							</Link>
						</TooltipButton>

						<TooltipButton
							tooltip="Edit"
							variant="default"
							onClick={() => openModal(<UpdateRoomModal room={row} />)}
						>
							<PenLine />
						</TooltipButton>

						<TooltipButton
							tooltip="Delete"
							variant="destructive"
							onClick={() => openModal(<RemoveRoomModal roomId={row.id} />)}
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
			header="Rooms"
			onAdd={() => openModal(<CreateRoomModal />)}

			breadcrumb={
				<SimpleBreadcrumb
					currentPage="Rooms"
				/>
			}
		>
			<GenericTable
				data={rooms}
				columns={columns}
			/>
		</CrudLayout>
	);
}

export default List;
