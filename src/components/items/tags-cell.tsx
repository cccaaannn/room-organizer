import TagBadge from "@/components/badge/tag-badge";
import { Badge } from "@/components/shadcn/ui/badge";
import Tooltip from "@/components/tooltip";
import type { FromTrpcArrayValue } from "@/trpc/type-utils";


const TagCount = 2;

interface Props {
	itemsTags: FromTrpcArrayValue<"item", "getBySectionId">["itemsTags"];
}

const TagsCell = (props: Props) => {

	const firstNTags = props.itemsTags.slice(0, TagCount);
	const hasMoreTags = props.itemsTags.length > TagCount;
	const remainingTags = props.itemsTags.slice(TagCount);

	if (props.itemsTags.length === 0) return (
		<div>
			<Badge variant="secondary">
				No tags
			</Badge>
		</div>
	);

	if (!hasMoreTags) return (
		<div className="flex gap-2 flex-wrap">
			{
				firstNTags.map(tag =>
					<TagBadge
						key={tag.tag.id}
						tag={tag.tag}
					/>
				)
			}
		</div>
	);

	return (
		<div className="flex gap-2 flex-wrap justify-start">
			{
				firstNTags.map(tag =>
					<TagBadge
						key={tag.tag.id}
						tag={tag.tag}
					/>
				)
			}

			<Tooltip
				childrenClassName="w-fit"
				title={
					<div className="flex gap-2 flex-wrap">
						{
							remainingTags.map(tag =>
								<TagBadge
									key={tag.tag.id}
									tag={tag.tag}
								/>
							)
						}
					</div>
				}
			>
				<Badge variant="outline">
					...
				</Badge>
			</Tooltip>
		</div>
	);
};

export default TagsCell;
