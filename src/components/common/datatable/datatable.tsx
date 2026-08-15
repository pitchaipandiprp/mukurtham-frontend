"use client";

import {
    flexRender,
    Table,
} from "@tanstack/react-table";
import Loading from "@/components/common/loading/loading";
import EmptyState from "./emptystate";

interface DataTableProps<TData> {
    table: Table<TData>;
    loading?: boolean;
    emptyMessage?: string;
    loadingMessage?: string;
}

export default function DataTable<TData>({
    table,
    loading = false,
    emptyMessage = "No records found.",
    loadingMessage = "Loading...",
}: DataTableProps<TData>) {
    const columnCount = table.getAllColumns().length;

    return (
        <div className="overflow-hidden rounded-b rounded-xl border border-slate-200 bg-white shadow-sm mb-0">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-primary-light text-white">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="px-4 py-3 text-left font-semibold text-white"
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={columnCount}>
                                    <Loading message={loadingMessage} />
                                </td>
                            </tr>
                        ) : table.getRowModel().rows.length === 0 ? (
                            <tr>
                                <td colSpan={columnCount}>
                                    <EmptyState
                                        title={emptyMessage}
                                        description="Try changing your search or filter."
                                    />
                                </td>
                            </tr>
                        ) : (
                            table.getRowModel().rows.map((row) => (
                                <tr
                                    key={row.id}
                                    className="border-t border-slate-200 hover:bg-primary/10"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <td
                                            key={cell.id}
                                            className="px-4 py-3"
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}