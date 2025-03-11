import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid';
import {
  type Header,
  type TableState,
  type Table as TableType,
  flexRender,
} from '@tanstack/react-table';

type TableProps<RowData = unknown> = {
  table: TableType<RowData>;
};

export function Table<RowData = unknown>({ table }: TableProps<RowData>) {
  return (
    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
        <table className="min-w-full divide-y divide-zinc-600">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-zinc-200"
                  >
                    {header.isPlaceholder ? null : typeof header.column
                        .columnDef.header === 'string' ? (
                      <ColumnHeaderRenderer<RowData>
                        header={header}
                        label={header.column.columnDef.header}
                      />
                    ) : (
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-zinc-500">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-3 py-4 text-sm whitespace-nowrap text-zinc-300"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

type ColumnHeaderRendererProps<RowData = unknown> = {
  label: string;
  header: Header<RowData, unknown>;
};

function ColumnHeaderRenderer<RowData = unknown>({
  label,
  header,
}: ColumnHeaderRendererProps<RowData>) {
  const isSorted = header.column.getIsSorted();
  const canSort = header.column.getCanSort();
  const sortingFn = header.column.getToggleSortingHandler();

  return (
    <button
      type="button"
      onClick={sortingFn}
      disabled={!canSort}
      className="group inline-flex cursor-pointer disabled:cursor-auto"
    >
      {label}
      {isSorted ? (
        <span className="ml-2 flex-none rounded-sm bg-zinc-700 text-zinc-200 group-hover:bg-zinc-600">
          {isSorted === 'desc' ? (
            <ChevronDownIcon aria-hidden="true" className="size-5" />
          ) : (
            <ChevronUpIcon aria-hidden="true" className="size-5" />
          )}
        </span>
      ) : (
        <span className="invisible ml-2 flex-none rounded-sm bg-zinc-700 text-zinc-200 group-hover:bg-zinc-600 group-disabled:invisible group-hover:visible group-focus:visible">
          <ChevronDownIcon aria-hidden="true" className="size-5" />
        </span>
      )}
    </button>
  );
}
