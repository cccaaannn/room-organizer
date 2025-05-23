import type React from "react";

import { useStore } from "@tanstack/react-store";

import ErrorMessages from "@/components/form/error-messages";
import { MultiSelect } from "@/components/multi-select/multi-select";
import { Label } from "@/components/shadcn/ui/label";
import { useFieldContext } from "@/hooks/useAppForm";


interface Props extends Omit<React.ComponentProps<typeof MultiSelect>, "value" | "onValueChange"> {
	label?: string;
}

const FormMultiSelect = (props: Props) => {
	const field = useFieldContext<string[]>();
	const errors = useStore(field.store, state => state.meta.errors);

	const { label, ...rest } = props;

	return (
		<div>
			<Label htmlFor={label} className="mb-1 text-l">
				{label}
			</Label>

			<MultiSelect
				value={field.state.value}
				onValueChange={value => field.handleChange(value)}
				defaultValue={field.state.value}

				{...rest}
			/>

			{field.state.meta.isTouched && <ErrorMessages errors={errors} />}
		</div>
	);
};

export default FormMultiSelect;
