import { useStore } from "@tanstack/react-store";

import CopyButton from "@/components/button/copy-button";
import ErrorMessages from "@/components/form/error-messages";
import { Input } from "@/components/shadcn/ui/input";
import { Label } from "@/components/shadcn/ui/label";
import { useFieldContext } from "@/hooks/useAppForm";


interface Props {
	label: string;
}

const FormColorPicker = (props: Props) => {
	const field = useFieldContext<string>();
	const errors = useStore(field.store, state => state.meta.errors);

	return (
		<div>
			<Label htmlFor={props.label} className="mb-1 text-l">
				{props.label}
			</Label>

			<div className="flex items-center gap-2">
				<Input
					type="color"
					value={field.state.value}
					onBlur={field.handleBlur}
					onChange={e => field.handleChange(e.target.value)}
				/>

				<Input
					className="w-[120px]"
					value={field.state.value}
					onBlur={field.handleBlur}
					onChange={e => field.handleChange(e.target.value)}
				/>

				<CopyButton text={field.state.value} />
			</div>

			{field.state.meta.isTouched && <ErrorMessages errors={errors} />}
		</div>
	);
};

export default FormColorPicker;
