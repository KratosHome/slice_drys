'use client'
import * as React from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Package,
  Truck,
  XCircle,
  RefreshCw,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

const statusIcons = {
  new: <Clock className="text-blue-500" />,
  awaitingPayment: <AlertCircle className="text-yellow-500" />,
  awaitingShipment: <Package className="text-orange-500" />,
  shipped: <Truck className="text-indigo-500" />,
  completed: <CheckCircle className="text-green-500" />,
  awaitingReturn: <RefreshCw className="text-gray-500" />,
  cancelled: <XCircle className="text-red-500" />,
  failedDelivery: <AlertCircle className="text-red-500" />,
}

function DataTable<TData>({
  columns,
  data,
}: {
  columns: ColumnDef<TData>[]
  data: TData[]
}) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className="mt-6 w-full">
      <div className="flex items-center gap-2 py-4">
        <Input
          placeholder="Фільтр по email..."
          value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('email')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="overflow-x-auto rounded-md border border-gray-200">
        <Table className="w-full border-collapse">
          <TableHeader className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="px-4 py-2 text-left text-sm font-medium text-gray-700"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="divide-y divide-gray-100">
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-gray-50"
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="px-4 py-2 text-sm text-gray-900"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Немає замовлень
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} з{' '}
          {table.getFilteredRowModel().rows.length} сторінки
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Попередня
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Наступна
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function OrdersList({ data }: { data: IOrder[] }) {
  const router = useRouter()

  const columns: ColumnDef<IOrder>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: 'id',
      header: 'ID',
      accessorFn: (row) => row.id,
      cell: ({ row }) => <div>{row.original.id}</div>,
    },
    {
      accessorKey: 'status',
      header: 'Статус',
      cell: ({ row }) => {
        const status = row.getValue('status') as keyof typeof statusIcons
        return (
          <div className="flex items-center gap-2 capitalize">
            {statusIcons[status] || <AlertCircle className="text-gray-500" />}
          </div>
        )
      },
    },
    {
      id: 'name',
      header: "Ім'я користувача",
      accessorFn: (row) => `${row.user.name} ${row.user.surname}`,
      cell: ({ row }) => (
        <div>
          {row.original.user.name} {row.original.user.surname}
        </div>
      ),
    },
    {
      id: 'phone',
      header: 'Телефон',
      accessorFn: (row) => row.user.phone,
      cell: ({ row }) => <div>{row.original.user.phone}</div>,
    },
    {
      id: 'total',
      header: 'Сума',
      accessorFn: (row) => row.total,
      cell: ({ row }) => <div>{row.original.total} грн</div>,
    },
    {
      id: 'city',
      header: 'Місто',
      accessorFn: (row) => row.delivery.city,
      cell: ({ row }) => <div>{row.original.delivery.city}</div>,
    },
    {
      id: 'comment',
      header: 'Коментар',
      accessorFn: (row) => row.comment,
      cell: ({ row }) => <div>{row.original.comment}</div>,
    },
    {
      id: 'actions',
      header: 'Дії',
      accessorKey: 'actions',
      cell: ({ row }) => {
        const order = row.original

        return (
          <div className="flex flex-col gap-2">
            <Button onClick={() => router.push(`/admin/orders/${order.id}`)}>
              Деталі
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Дії</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Дії</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Насупний статус</DropdownMenuItem>
                <DropdownMenuItem>Попередній статус</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]

  return (
    <div>
      <DataTable columns={columns} data={data} />
    </div>
  )
}
