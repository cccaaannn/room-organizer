import React from "react";

import { Button } from "@/components/shadcn/ui/button";
import useModal from "@/hooks/useModal/useModal";
import { cn } from "@/components/shadcn/lib/utils";


interface Props {
	children: React.ReactNode;
	header?: React.ReactNode;
	className?: string;
}

const GenericModal = (props: Props) => {

	const { closeModal } = useModal();

	return (
		<div
			className={cn(
				"flex flex-col gap-4 bg-background rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg w-full",
				props.className
			)}
		>
			<div className="flex items-center justify-between w-full">
				{
					React.isValidElement(props.header) ? props.header :
						<h2 className="text-lg font-semibold">
							{props.header ?? ""}
						</h2>
				}

				<Button
					variant="outline"
					size="sm"
					onClick={closeModal}
				>
					X
				</Button>
			</div>

			{props.children}
		</div>
	);
};

export default GenericModal;
