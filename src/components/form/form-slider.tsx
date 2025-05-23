import { useStore } from "@tanstack/react-store";

import ErrorMessages from "@/components/form/error-messages";
import { Label } from "@/components/shadcn/ui/label";
import { Slider } from "@/components/shadcn/ui/slider";
import { useFieldContext } from "@/hooks/useAppForm";


interface Props {
	label: string;
}

const FormSlider = (props: Props) => {
	const field = useFieldContext<number>();
	const errors = useStore(field.store, state => state.meta.errors);

	return (
		<div>
			<Label htmlFor={props.label} className="mb-1 text-l">
				{props.label}
			</Label>

			<Slider
				id={props.label}
				onBlur={field.handleBlur}
				value={[field.state.value]}
				onValueChange={value => field.handleChange(value[0])}
			/>

			{field.state.meta.isTouched && <ErrorMessages errors={errors} />}
		</div>
	);
};

export default FormSlider;
