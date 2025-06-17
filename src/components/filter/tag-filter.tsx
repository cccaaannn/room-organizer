import { useState } from "react";

import { useQuery } from "@tanstack/react-query";

import { MultiSelect } from "@/components/multi-select/multi-select";
import { useTRPC } from "@/trpc/react";


interface Props {
	route: {
		useSearch: () => { tags: string[] };
		useNavigate: () => (args: { search: { tags: string[] } }) => void;
	};
}

const TagFilter = (props: Props) => {

	const trpc = useTRPC();
	const { data: tagList = [] } = useQuery(trpc.tag.getAll.queryOptions());
	const tagSelectValues = tagList.map(r => ({ value: r.id, label: r.name })) ?? [];

	const [selectedTags, setSelectedTags] = useState<string[]>([]);

	const { tags } = props.route.useSearch();
	const navigate = props.route.useNavigate();

	const handleTagChange = (value: string[]) => {
		setSelectedTags(value);
		navigate({ search: { tags: value } });
	};

	return (
		<div className="w-[300px]">
			<MultiSelect
				placeholder="Filter by tags"
				options={tagSelectValues}
				defaultValue={tags}
				value={selectedTags}
				onValueChange={handleTagChange}
			/>
		</div>
	);
};

export default TagFilter;
