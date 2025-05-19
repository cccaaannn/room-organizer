import type React from "react";

import type SimpleBreadcrumb from "@/components/simple-breadcrumb";


interface Props {
	children: React.ReactNode;
	header: string;
	breadcrumb: React.ReactElement<typeof SimpleBreadcrumb>;
}

const GenericLayout = (props: Props) => {
	return (
		<div className="flex flex-col gap-2 p-4">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl">
					{props.header}
				</h1>
			</div>

			{props.breadcrumb}

			{props.children}
		</div>
	);
};

export default GenericLayout;
