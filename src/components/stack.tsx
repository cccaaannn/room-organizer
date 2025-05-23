import type React from "react";


interface Props {
	header: string;
	description?: React.ReactNode;
}

const Stack = (props: Props) => {
	return (
		<div className="flex flex-col gap-2">
			<h4 className="text-sm font-medium leading-none">
				{props.header}
			</h4>

			{
				typeof props.description === "string" &&
				<p className="text-sm text-muted-foreground">
					{props.description ?? "-"}
				</p>
			}

			{
				typeof props.description !== "string" &&
				props.description
			}
		</div>
	);
};

export default Stack;
