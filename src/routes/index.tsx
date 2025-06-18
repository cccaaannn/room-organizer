import { createFileRoute, Link } from "@tanstack/react-router";


export const Route = createFileRoute("/")({
	component: App
});

function App() {
	return (
		<div className="text-center h-full">
			<header className="h-full flex flex-col items-center justify-center gap-4">
				<h1 className="text-4xl font-medium">
					Welcome to the Room organizer
				</h1>

				<p className="text-sm">
					{"Go to "}

					<span className="text-blue-500">
						<Link to="/rooms">Rooms</Link>
					</span>

					{", "}

					<span className="text-blue-500">
						<Link to="/tags">Tags</Link>
					</span>

					{" or "}

					<span className="text-blue-500">
						<Link to="/items">Items</Link>
					</span>

					{" to start organizing your stuff!"}
				</p>
			</header>
		</div>
	);
}
