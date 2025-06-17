import { useEffect, useState } from "react";

import { Input } from "@/components/shadcn/ui/input";
import useDebounceValue from "@/hooks/useDebounceValue";


interface Props {
	route: {
		useSearch: () => { name: string | undefined };
		useNavigate: () => (args: { search: { name: string | undefined } }) => void;
	};
}

const NameFilter = (props: Props) => {

	const { name } = props.route.useSearch();
	const navigate = props.route.useNavigate();

	const [searchKey, setSearchKey] = useState<string>(name ?? "");
	const debouncedKey = useDebounceValue(searchKey, 300);

	useEffect(() => {
		navigate({ search: { name: debouncedKey ? debouncedKey : undefined } });
	}, [debouncedKey, navigate]);

	return (
		<div className="w-[300px] h-full">
			<Input
				placeholder="Filter by name"
				value={searchKey}
				onChange={e => setSearchKey(e.target.value)}
			/>
		</div>
	);
};

export default NameFilter;
