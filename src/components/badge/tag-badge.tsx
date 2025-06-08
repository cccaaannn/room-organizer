import tinycolor from "tinycolor2";

import { Badge } from "@/components/shadcn/ui/badge";
import type { FromTrpcArrayValue } from "@/trpc/type-utils";
import type { Unpacked } from "@/utils/typescript";


interface Props {
	tag: Unpacked<FromTrpcArrayValue<"item", "getBySectionId">["itemsTags"]>["tag"];
}

const TagBadge = (props: Props) => {
	return (
		<Badge
			className="border-1 border-solid border-gray-700"
			style={{
				backgroundColor: props.tag.color,
				color: tinycolor(props.tag.color).isLight() ? "black" : "white"
			}}
		>
			{props.tag.name}
		</Badge>
	);
};

export default TagBadge;
