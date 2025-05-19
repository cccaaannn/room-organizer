import { Copy } from "lucide-react";

import TooltipButton from "@/components/button/tooltip-button";


interface Props {
	text: string;
}

const CopyButton = (props: Props) => {
	const copyToClipboard = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.preventDefault();
		e.stopPropagation();

		if (!navigator?.clipboard?.writeText) return;
		if (!props.text) return;

		try {
			navigator.clipboard.writeText(props.text);
		}
		catch (err) {
			console.error("Failed to copy: ", err);
		}
	};

	return (
		<TooltipButton
			tooltip="Copy"
			variant="ghost"
			size="sm"
			type="button"
			onClick={copyToClipboard}
		>
			<Copy />
		</TooltipButton>
	);
};

export default CopyButton;