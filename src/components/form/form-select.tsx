import { useStore } from "@tanstack/react-store";

import ErrorMessages from "@/components/form/error-messages";
import { Label } from "@/components/shadcn/ui/label";
import * as ShadcnSelect from "@/components/shadcn/ui/select";
import { useFieldContext } from "@/hooks/useAppForm";


interface Props {
	label: string;
	values: Array<{ label: string; value: string }>;
	placeholder?: string;
}

const FormSelect = (props: Props) => {
	const field = useFieldContext<string>();
	const errors = useStore(field.store, state => state.meta.errors);

	return (
		<div>
			<Label htmlFor={props.label} className="mb-1 text-l">
				{props.label}
			</Label>

			<ShadcnSelect.Select
				name={field.name}
				value={field.state.value}
				onValueChange={value => field.handleChange(value)}
			>
				<ShadcnSelect.SelectTrigger className="w-full">
					<ShadcnSelect.SelectValue placeholder={props.placeholder} />
				</ShadcnSelect.SelectTrigger>

				<ShadcnSelect.SelectContent>
					<ShadcnSelect.SelectGroup>
						<ShadcnSelect.SelectLabel>
							{props.label}
						</ShadcnSelect.SelectLabel>

						{
							props.values.map(value =>
								<ShadcnSelect.SelectItem key={value.value} value={value.value}>
									{value.label}
								</ShadcnSelect.SelectItem>
							)
						}
					</ShadcnSelect.SelectGroup>
				</ShadcnSelect.SelectContent>
			</ShadcnSelect.Select>

			{field.state.meta.isTouched && <ErrorMessages errors={errors} />}
		</div>
	);
};

export default FormSelect;