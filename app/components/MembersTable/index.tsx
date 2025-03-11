import { Link } from '@tanstack/react-router';
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import type { listMembers } from '../../../services/MembersService';
import { Table } from '../ui/Table';

type ListUserData = Awaited<ReturnType<typeof listMembers>>[0];

const columnHelper = createColumnHelper<ListUserData>();

const columns = [
  columnHelper.accessor('user.name', {
    cell: (info) =>
      info.row.original.member.role === 'owner' ? (
        info.getValue()
      ) : (
        <Link
          to="/admin/members/$memberId"
          className="font-semibold text-white underline decoration-zinc-600 hover:decoration-white underline-offset-3"
          params={{ memberId: info.row.original.member.id }}
        >
          {info.getValue()}
        </Link>
      ),
    header: 'Name',
  }),
  columnHelper.accessor('user.email', {
    cell: (info) => info.getValue(),
    header: 'Email',
  }),
  columnHelper.accessor('member.role', {
    cell: (info) => <span className="capitalize">{info.getValue()}</span>,
    header: 'Role',
  }),
];

export function MembersTable({ data }: { data: Array<ListUserData> }) {
  const table = useReactTable<ListUserData>({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  });

  return <Table table={table} />;
}
