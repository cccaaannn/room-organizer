import React from "react";

import { ArrowLeft, ArrowRight } from "lucide-react";

import { cn } from "@/components/shadcn/lib/utils";
import { Button } from "@/components/shadcn/ui/button";
import * as ShadcnSelect from "@/components/shadcn/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from "@/components/shadcn/ui/table";
import type { Unpacked } from "@/utils/typescript";


type TableData = Record<string, React.ReactNode | unknown> & { id: string };

type TableColumn<TData extends TableData> =
	| {
		label: string;
		value: keyof TData;
		align?: "left" | "center" | "right";
		type?: "text" | "date" | "datetime" | "number" | undefined;
		renderCell?: (row: TData) => React.ReactNode;
		cellClassName?: string;
		colClassName?: string;
	}
	| {
		label: string;
		align?: "left" | "center" | "right";
		type: "action";
		renderCell: (row: TData) => React.ReactNode;
		cellClassName?: string;
		colClassName?: string;
	};

export type TableColumns<TData extends TableData[]> = TableColumn<Unpacked<TData>>;

interface Props<TData extends TableData> {
	data: TData[];
	columns: readonly TableColumn<TData>[];
	pageSize?: number;
	pageSizes?: number[];
}

const getCellValue = <TData extends TableData>(row: TData, column: TableColumn<TData>) => {
	if (column.type === "action") return null;

	const cell = row[column.value as keyof TData];

	if (column.renderCell) {
		return column.renderCell(row);
	}

	if (React.isValidElement(cell)) {
		return cell;
	}

	if (column.type === "number") {
		return Number(cell);
	}

	if (column.type === "date") {
		if (!cell) return "-";
		return new Date(cell as string).toLocaleDateString();
	}

	if (column.type === "datetime") {
		if (!cell) return "-";
		return new Date(cell as string).toLocaleString();
	}

	if (column.type === "text" || column.type === undefined) {
		return `${cell}`;
	}

	return null;
};

const getActionsCell = <TData extends TableData>(row: TData, columns: readonly TableColumn<TData>[]) => {
	const column = columns.find(column => column.type === "action");
	if (!column) return null;

	return column.renderCell(row);
};


const GenericTable = <TData extends TableData>(props: Props<TData>) => {

	const [pageSizes] = React.useState(props.pageSizes ?? [10, 20, 50]);
	const [pageSize, setPageSize] = React.useState(props.pageSize ?? 10);
	const [pageIndex, setPageIndex] = React.useState(0);
	const [pageCount, setPageCount] = React.useState(0);
	const [activeData, setActiveData] = React.useState<TData[]>([]);

	const nonActionColumns = props.columns.filter(column => column.type !== "action");
	const actionsColumn = props.columns.find(column => column.type === "action");
	const hasActions = !!actionsColumn;

	const canPreviousPage = pageIndex > 0;
	const canNextPage = pageIndex < pageCount - 1;

	React.useEffect(() => {
		if (props.data.length > 0) {
			setPageCount(Math.ceil(props.data.length / pageSize));
			setActiveData(props.data.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize));
		}
		else {
			setPageCount(0);
			setActiveData([]);
		}
	}, [props.data, pageSize, pageIndex]);

	return (
		<div className="flex flex-col gap-4">
			<Table>
				<TableHeader>
					<TableRow>
						{
							props.columns.map((column, index) =>
								<TableHead
									key={index}
									className={`text-${column.align ?? "left"} ${cn("max-w-60 overflow-hidden text-ellipsis", column.colClassName)}`}
								>
									{column.label}
								</TableHead>
							)
						}
					</TableRow>
				</TableHeader>

				<TableBody>
					{
						activeData.map(row =>
							<TableRow key={row.id}>
								{
									nonActionColumns.map((column, colIndex) =>
										<TableCell
											className={`text-${column.align ?? "left"} ${cn("max-w-60 overflow-hidden text-ellipsis", column.cellClassName)}`}
											key={colIndex}
										>
											{getCellValue(row, column)}
										</TableCell>
									)
								}

								{
									hasActions &&
									<TableCell
										className={`text-${actionsColumn.align ?? "left"} ${cn("max-w-60 overflow-hidden text-ellipsis", actionsColumn.cellClassName)}`}
									>
										{getActionsCell(row, props.columns)}
									</TableCell>
								}
							</TableRow>
						)
					}

					{
						props.data.length === 0 &&
						<TableRow>
							<TableCell colSpan={props.columns.length} className="text-center">
								No data available
							</TableCell>
						</TableRow>
					}
				</TableBody>
			</Table>

			<div className="w-full flex justify-between text-center gap-2">
				<div>
					<ShadcnSelect.Select
						value={String(pageSize)}
						onValueChange={value => setPageSize(Number(value))}
					>
						<ShadcnSelect.SelectTrigger className="w-full">
							<ShadcnSelect.SelectValue />
						</ShadcnSelect.SelectTrigger>

						<ShadcnSelect.SelectContent>
							<ShadcnSelect.SelectGroup>
								{
									pageSizes.map(value =>
										<ShadcnSelect.SelectItem key={value} value={String(value)}>
											{value}
										</ShadcnSelect.SelectItem>
									)
								}
							</ShadcnSelect.SelectGroup>
						</ShadcnSelect.SelectContent>
					</ShadcnSelect.Select>
				</div>

				<div className="flex justify-end items-center gap-2">
					<p className="text-sm">
						{`Page ${pageIndex + 1} of ${pageCount}`}
					</p>

					<Button
						variant="outline"
						size="sm"
						onClick={() => setPageIndex(prev => prev - 1)}
						disabled={!canPreviousPage}
					>
						<ArrowLeft />
					</Button>

					<Button
						variant="outline"
						size="sm"
						onClick={() => setPageIndex(prev => prev + 1)}
						disabled={!canNextPage}
					>
						<ArrowRight />
					</Button>
				</div>
			</div>
		</div>
	);
};

export default GenericTable;
