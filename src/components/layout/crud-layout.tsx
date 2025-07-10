import type React from "react";

import { Plus } from "lucide-react";

import TooltipButton from "@/components/button/tooltip-button";
import type SimpleBreadcrumb from "@/components/simple-breadcrumb";


interface Props {
	children: React.ReactNode;
	header: string;
	breadcrumb: React.ReactElement<typeof SimpleBreadcrumb>;
	onAdd: () => void;
}

const CrudLayout = (props: Props) => {
	return (
		<div className="flex flex-col gap-2 p-4">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl">
					{props.header}
				</h1>

				<TooltipButton
					variant="default"
					tooltip="Add new"
					onClick={props.onAdd}
				>
					<Plus />
				</TooltipButton>
			</div>

			{props.breadcrumb}

			{props.children}
		</div>
	);
};

export default CrudLayout;
