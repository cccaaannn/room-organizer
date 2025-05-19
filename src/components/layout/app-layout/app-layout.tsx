import React from "react";

import Header from "@/components/layout/app-layout/header";


interface Props {
	children: React.ReactNode;
}

const AppLayout = (props: Props) => {
	return (
		<div className="w-full h-screen flex flex-col">
			<Header />

			<main className="flex-1 h-full overflow-auto bg-gray-50 dark:bg-gray-900">
				{props.children}
			</main>
		</div>
	);
};

export default AppLayout;
