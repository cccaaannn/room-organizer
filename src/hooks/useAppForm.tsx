import { createFormHook, createFormHookContexts } from "@tanstack/react-form";

import FormButton from "@/components/form/form-button";
import FormColorPicker from "@/components/form/form-color-picker";
import FormMultiSelect from "@/components/form/form-multi-select";
import FormNumberTextField from "@/components/form/form-number-text-field";
import FormSelect from "@/components/form/form-select";
import FormSlider from "@/components/form/form-slider";
import FormSwitch from "@/components/form/form-switch";
import FormTextArea from "@/components/form/form-text-area";
import FormTextField from "@/components/form/form-text-field";


export const { fieldContext, useFieldContext, formContext, useFormContext } = createFormHookContexts();

export const { useAppForm } = createFormHook({
	fieldContext,
	formContext,
	fieldComponents: {
		TextField: FormTextField,
		NumberTextField: FormNumberTextField,
		ColorPicker: FormColorPicker,
		TextArea: FormTextArea,
		Select: FormSelect,
		MultiSelect: FormMultiSelect,
		Slider: FormSlider,
		Switch: FormSwitch
	},
	formComponents: {
		Button: FormButton
	}
});
