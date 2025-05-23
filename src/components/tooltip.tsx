import React from "react";

import {
	Tooltip as ShadcnTooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from "@/components/shadcn/ui/tooltip";


interface Props {
	children: React.ReactNode;
	title: React.ReactNode;
	contentClassName?: string;
	childrenClassName?: string;
}

const Tooltip = (props: Props) => {
	return (
		<TooltipProvider>
			<ShadcnTooltip>
				<TooltipTrigger className={props.childrenClassName}>
					{props.children}
				</TooltipTrigger>

				<TooltipContent className={props.contentClassName}>
					{
						React.isValidElement(props.title) ? props.title :
							<p>
								{props.title}
							</p>
					}
				</TooltipContent>
			</ShadcnTooltip>
		</TooltipProvider>
	);
};

export default Tooltip;
