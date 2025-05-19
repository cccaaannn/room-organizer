import React from "react";

import { Button } from "@/components/shadcn/ui/button";
import Tooltip from "@/components/tooltip";


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
