import { cn } from "@/components/shadcn/lib/utils";


interface Props {
	children: React.ReactNode;
	handleSubmit: () => Promise<void>;
	className?: string;
}

const AppForm = (props: Props) => {
	return (
		<form
			onSubmit={e => {
				e.preventDefault();
				e.stopPropagation();
				props.handleSubmit();
			}}
			className={cn("flex flex-col gap-4", props.className)}
		>
			{props.children}
		</form>
	);
};

export default AppForm;