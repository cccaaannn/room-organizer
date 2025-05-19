import { Link } from "@tanstack/react-router";

import ModeToggle from "@/components/shadcn/hooks/theme/mode-toggle";
import { Separator } from "@/components/shadcn/ui/separator";


const header = () => {
	return (
		<header className="p-2 sticky top-0 bg-gray-100 dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700 z-10">
			<nav className="flex gap-2 font-medium justify-between items-center">
				<div className="flex gap-2 font-medium h-5">
					<Link to="/">Home</Link>

					<Separator orientation="vertical" className="bg-gray-400" />

					<Link to="/rooms">Rooms</Link>

					<Separator orientation="vertical" className="bg-gray-400" />

					<Link to="/tags">Tags</Link>

					<Separator orientation="vertical" className="bg-gray-400" />

					<Link to="/items">All items</Link>
				</div>

				<ModeToggle />
			</nav>
		</header>
	);
};

export default header;
