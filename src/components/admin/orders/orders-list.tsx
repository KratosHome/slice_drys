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
  ChevronDown,
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

const statusLabels: Record<keyof typeof statusIcons, string> = {
  new: 'Нове',
  awaitingPayment: 'Очікує оплати',
  awaitingShipment: 'Очікує відправки',
  shipped: 'Відправлено',
  completed: 'Виконано',
  awaitingReturn: 'Очікує повернення',
  cancelled: 'Скасовано',
  failedDelivery: 'Не доставлено',
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
    React.useState<VisibilityState>({ email: false })
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
    <div className="border-border bg-card mt-6 w-full rounded-xl border p-3 shadow-sm sm:p-5">
      <div className="flex flex-col gap-3 pb-4 sm:flex-row sm:items-center">
        <Input
          placeholder="Фільтр по email..."
          value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('email')?.setFilterValue(event.target.value)
          }
          className="bg-background sm:max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full sm:ml-auto sm:w-auto">
              Стовпці
              <ChevronDown className="size-4" />
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

      <div className="border-border overflow-hidden rounded-lg border">
        <Table className="min-w-[900px] border-collapse">
          <TableHeader className="bg-muted/60">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-foreground px-4 py-3 text-left text-sm font-semibold"
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
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="text-card-foreground px-4 py-3 text-sm"
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
                  colSpan={table.getVisibleLeafColumns().length}
                  className="text-muted-foreground h-24 text-center"
                >
                  Немає замовлень
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center">
        <div className="text-muted-foreground flex-1 text-sm">
          Вибрано {table.getFilteredSelectedRowModel().rows.length} з{' '}
          {table.getFilteredRowModel().rows.length}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 sm:flex-none"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Попередня
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 sm:flex-none"
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
          aria-label="Вибрати всі замовлення"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          aria-label={`Вибрати замовлення ${row.original.id}`}
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
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
            <span className="sr-only">{statusLabels[status] || status}</span>
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
      id: 'email',
      header: 'Email',
      accessorFn: (row) => row.user.email,
      cell: ({ row }) => <div>{row.original.user.email}</div>,
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
