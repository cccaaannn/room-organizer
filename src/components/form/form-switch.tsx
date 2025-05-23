import { useStore } from "@tanstack/react-store";

import ErrorMessages from "@/components/form/error-messages";
import { Label } from "@/components/shadcn/ui/label";
import { Switch } from "@/components/shadcn/ui/switch";
import { useFieldContext } from "@/hooks/useAppForm";


interface Props {
	label: string;
}

const FormSwitch = (props: Props) => {
	const field = useFieldContext<boolean>();
	const errors = useStore(field.store, state => state.meta.errors);

	return (
		<div>
			<div className="flex items-center gap-2">
				<Switch
					id={props.label}
					onBlur={field.handleBlur}
					checked={field.state.value}
					onCheckedChange={checked => field.handleChange(checked)}
				/>

				<Label htmlFor={props.label}>
					{props.label}
				</Label>
			</div>

			{field.state.meta.isTouched && <ErrorMessages errors={errors} />}
		</div>
	);
};

export default FormSwitch;
