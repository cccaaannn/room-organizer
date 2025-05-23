import type React from "react";

import { Link } from "@tanstack/react-router";

import {
	Breadcrumb as ShadcnBreadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator
} from "@/components/shadcn/ui/breadcrumb";


interface Props {
	links?: Array<React.ReactElement<typeof Link>>;
	currentPage: string;
}

const SimpleBreadcrumb = (props: Props) => {
	return (
		<ShadcnBreadcrumb>
			<BreadcrumbList>
				{
					props.links?.map((link, index) =>
						<>
							<BreadcrumbItem key={index}>
								<BreadcrumbLink asChild>
									{link}
								</BreadcrumbLink>
							</BreadcrumbItem>

							<BreadcrumbSeparator />
						</>
					)
				}

				<BreadcrumbItem>
					<BreadcrumbPage>
						{props.currentPage}
					</BreadcrumbPage>
				</BreadcrumbItem>
			</BreadcrumbList>
		</ShadcnBreadcrumb>
	);
};

export default SimpleBreadcrumb;
