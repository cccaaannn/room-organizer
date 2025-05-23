import { useStore } from "@tanstack/react-store";

import ErrorMessages from "@/components/form/error-messages";
import { Input } from "@/components/shadcn/ui/input";
import { Label } from "@/components/shadcn/ui/label";
import { useFieldContext } from "@/hooks/useAppForm";


interface Props {
	label: string;
	placeholder?: string;
}

const FormTextField = (props: Props) => {
	const field = useFieldContext<string>();
	const errors = useStore(field.store, state => state.meta.errors);

	return (
		<div>
			<Label htmlFor={props.label} className="mb-1 text-l">
				{props.label}
			</Label>

			<Input
				value={field.state.value}
				placeholder={props.placeholder}
				onBlur={field.handleBlur}
				onChange={e => field.handleChange(e.target.value)}
			/>

			{field.state.meta.isTouched && <ErrorMessages errors={errors} />}
		</div>
	);
};

export default FormTextField;
