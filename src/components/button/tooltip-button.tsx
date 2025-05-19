import React from "react";

import Tooltip from "@/components/tooltip";
import { Button } from "@/components/shadcn/ui/button";


interface Props extends React.ComponentProps<typeof Button> {
	tooltip: string;
}

const TooltipButton = (props: Props) => {
	const { tooltip, ...rest } = props;

	return (
		<Tooltip
			title={tooltip}
		>
			<Button
				{...rest}
			/>
		</Tooltip>
	);
};

export default TooltipButton;
