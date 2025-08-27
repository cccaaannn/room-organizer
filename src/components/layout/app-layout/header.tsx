import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "react-toastify";

import ModeToggle from "@/components/shadcn/hooks/theme/mode-toggle";
import { Button } from "@/components/shadcn/ui/button";
import { Separator } from "@/components/shadcn/ui/separator";
import { signOut, useSession } from "@/lib/auth-client";


const Header = () => {

	const navigate = useNavigate();

	const { data: session } = useSession();
	const loggedIn = !!session?.user;

	const onSignout = async () => {
		await signOut();
		toast("Signed out");
		navigate({ to: "/" });
	};

	return (
		<header className="p-2 sticky top-0 bg-gray-100 dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700 z-10">
			<nav className="flex gap-2 font-medium justify-between items-center">
				<div className="flex gap-2 font-medium h-5">
					<Link
						to="/"
						className="hover:underline"
					>
						<img src="/image/icon-500x500.png" alt="Logo" className="h-6" />
					</Link>

					<Separator orientation="vertical" className="bg-gray-400" />

					{
						loggedIn ?
							<>
								<Link
									to="/rooms"
									className="hover:underline"
								>
									Rooms
								</Link>

								<Separator orientation="vertical" className="bg-gray-400" />

								<Link
									to="/tags"
									className="hover:underline"
								>
									Tags
								</Link>

								<Separator orientation="vertical" className="bg-gray-400" />

								<Link
									to="/items"
									className="hover:underline"
								>
									All items
								</Link>

								<Separator orientation="vertical" className="bg-gray-400" />

								<Button
									variant="link"
									size="sm"
									className="p-0 h-6 text-md hover:cursor-pointer text-red-400 hover:text-red-500"
									onClick={onSignout}
								>
									Sign out
								</Button>
							</>
							:
							<>
								<Link
									to="/auth/signup"
									className="hover:underline"
								>
									Sign up
								</Link>

								<Separator orientation="vertical" className="bg-gray-400" />

								<Link
									to="/auth/signin"
									className="hover:underline"
								>
									Sign in
								</Link>
							</>
					}
				</div>

				<div
					className="flex items-center gap-2 text-gray-500 dark:text-gray-400"
				>
					{
						loggedIn &&
						<p>
							{session.user?.email}
						</p>
					}

					<ModeToggle />
				</div>
			</nav>
		</header >
	);
};

export default Header;
