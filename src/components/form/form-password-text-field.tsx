import { useState } from "react";

import { useStore } from "@tanstack/react-store";
import { Eye, EyeOff } from "lucide-react";

import ErrorMessages from "@/components/form/error-messages";
import { Input } from "@/components/shadcn/ui/input";
import { Label } from "@/components/shadcn/ui/label";
import { useFieldContext } from "@/hooks/useAppForm";


interface Props {
	label: string;
	placeholder?: string;
}

const FormPasswordTextField = (props: Props) => {
	const field = useFieldContext<string>();
	const errors = useStore(field.store, state => state.meta.errors);

	const [showPassword, setShowPassword] = useState(false);

	return (
		<div>
			<Label htmlFor={props.label} className="mb-1 text-l">
				{props.label}
			</Label>

			<div className="relative">
				<Input
					value={field.state.value}
					placeholder={props.placeholder}
					onBlur={field.handleBlur}
					onChange={e => field.handleChange(e.target.value)}
					type={showPassword ? "text" : "password"}
				/>

				{
					showPassword ?
						<Eye
							className="absolute right-4 top-1.5 z-10 cursor-pointer"
							onClick={() => setShowPassword(false)}
						/>
						:
						<EyeOff
							className="absolute right-4 top-1.5 z-10 cursor-pointer"
							onClick={() => setShowPassword(true)}
						/>
				}
			</div>

			{field.state.meta.isTouched && <ErrorMessages errors={errors} />}
		</div>
	);
};

export default FormPasswordTextField;
