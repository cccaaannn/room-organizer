import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import AppForm from "@/components/form/app-form";
import GenericModal from "@/components/modal/generic-modal";
import { Button } from "@/components/shadcn/ui/button";
import { useAppForm } from "@/hooks/useAppForm";
import useModal from "@/hooks/useModal/useModal";
import { createItem, CreateItemScheme } from "@/routes/rooms/$roomId/furniture/$furnitureId/sections/$sectionId/items/-server-functions/create";
import { useTRPC } from "@/trpc/react";


interface Props {
	sectionId: string;
}

const CreateItemModal = (props: Props) => {
	const { closeModal } = useModal();

	const queryClient = useQueryClient();
	const trpc = useTRPC();
	const { data: items = [], isLoading: itemsLoading } = useQuery(trpc.item.getAll.queryOptions());
	const { data: tags = [], isLoading: tagsLoading } = useQuery(trpc.tag.getAll.queryOptions());

	const itemSelectValues = items.map(r => ({ value: r.id, label: r.name })) ?? [];
	const tagSelectValues = tags.map(r => ({ value: r.id, label: r.name })) ?? [];

	const form = useAppForm({
		defaultValues: {
			name: "",
			description: "",
			sectionId: props.sectionId,
			tags: [] as string[],
			relatedItems: [] as string[]
		},
		validators: {
			onChange: CreateItemScheme
		},
		onSubmit: async ctx => {
			try {
				const response = await createItem({ data: ctx.value });
				queryClient.invalidateQueries({ queryKey: trpc.item.getBySectionId.queryKey() });
				closeModal();
				toast(`${response.result.name} created`);
			}
			catch (error) {
				console.error(error);
				toast(`${error}`);
			}
		}
	});

	return (
		<GenericModal
			header="Add item"
		>
			<AppForm handleSubmit={form.handleSubmit}>
				<form.AppField name="name">
					{field => <field.TextField label="Name" />}
				</form.AppField>

				<form.AppField name="description">
					{field => <field.TextArea label="Description" />}
				</form.AppField>

				<form.AppField name="tags">
					{field => <field.MultiSelect label="Tags" options={tagSelectValues} />}
				</form.AppField>

				<form.AppField name="relatedItems">
					{field => <field.MultiSelect label="Related items" options={itemSelectValues} />}
				</form.AppField>

				<div className="flex justify-end gap-2">
					<Button
						variant="secondary"
						onClick={closeModal}
					>
						Cancel
					</Button>

					<form.AppForm>
						<form.Button
							disabled={itemsLoading || tagsLoading}
							label="Save"
						/>
					</form.AppForm>
				</div>
			</AppForm>
		</GenericModal>
	);
};

export default CreateItemModal;
