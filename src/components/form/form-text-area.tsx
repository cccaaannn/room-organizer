import { useStore } from "@tanstack/react-store";

import ErrorMessages from "@/components/form/error-messages";
import { Label } from "@/components/shadcn/ui/label";
import { Textarea } from "@/components/shadcn/ui/textarea";
import { useFieldContext } from "@/hooks/useAppForm";


interface Props {
	label: string;
	rows?: number;
}

const FormTextArea = (props: Props) => {
	const field = useFieldContext<string>();
	const errors = useStore(field.store, state => state.meta.errors);

	const rows = props.rows || 3;

	return (
		<div>
			<Label htmlFor={props.label} className="mb-1 text-l">
				{props.label}
			</Label>

			<Textarea
				id={props.label}
				value={field.state.value}
				onBlur={field.handleBlur}
				rows={rows}
				onChange={e => field.handleChange(e.target.value)}
			/>

			{field.state.meta.isTouched && <ErrorMessages errors={errors} />}
		</div>
	);
};

export default FormTextArea;
