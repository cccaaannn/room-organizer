import { Button } from "@/components/shadcn/ui/button";
import { useFormContext } from "@/hooks/useAppForm";


interface Props {
	label: string;
	disabled?: boolean;
}

const FormButton = (props: Props) => {
	const form = useFormContext();

	return (
		<form.Subscribe selector={state => state.isSubmitting}>
			{
				isSubmitting =>
					<Button type="submit" disabled={isSubmitting || props.disabled}>
						{props.label}
					</Button>
			}
		</form.Subscribe>
	);
};

export default FormButton;
