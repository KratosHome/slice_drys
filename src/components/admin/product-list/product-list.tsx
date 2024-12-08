'use client'

import * as React from 'react'
import { ChevronDownIcon } from '@radix-ui/react-icons'
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

import { Button } from '@/components/admin/ui/button'
import { Checkbox } from '@/components/admin/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/admin/ui/dropdown-menu'
import { Input } from '@/components/admin/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/admin/ui/table'
import Image from 'next/image'
import { FC } from 'react'
import EditorProduct from '@/components/admin/editor-product/editor-product'
import {
  IGetProduct,
  IProduct,
  IRecommendations,
  IVariableProduct,
} from '@/types/product'

interface IProductList {
  data: IGetProduct
  recommendations: IRecommendations
}

export const ProductList: FC<IProductList> = ({ data, recommendations }) => {
  const columns: ColumnDef<IProduct>[] = [
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
      id: 'зображення',
      header: 'зображення',
      accessorKey: 'img',
      cell: ({ row }) => {
        const product = row.original
        return (
          <div className="flex items-center justify-center">
            {product.img && (
              <Image
                width={50}
                height={50}
                src={product.img}
                alt={product.name}
                className="h-10 w-10 rounded object-cover"
              />
            )}
          </div>
        )
      },
    },
    {
      id: 'назва',
      header: 'назва',
      accessorKey: 'name',
      cell: ({ row }) => {
        const product = row.original
        return <div>{product.name}</div>
      },
    },
    {
      id: 'лейбла',
      header: 'лейбла',
      accessorKey: 'label',
      cell: ({ row }) => {
        const product = row.original
        return (
          <div className="flex flex-col">
            {product.statusLabel.map((label) => (
              <div key={label}>{label}</div>
            ))}
          </div>
        )
      },
    },
    {
      id: 'ціна',
      header: 'ціна',
      accessorKey: 'price',
      cell: ({ row }) => {
        const product = row.original as IProduct
        const variables = product.variables as IVariableProduct[]
        return (
          <div>
            {variables?.map((item: IVariableProduct) => (
              <div key={item._id}>
                {item.newPrice ? (
                  <div>
                    <span className="line-through">{item.price} грн</span>{' '}
                    <span>{item.newPrice} грн</span>
                  </div>
                ) : (
                  <span>{item.price} грн</span>
                )}
              </div>
            ))}
          </div>
        )
      },
    },
    {
      id: 'залишки',
      header: 'залишки',
      accessorKey: 'count',
      cell: ({ row }) => {
        const product = row.original as IProduct
        const variables = product.variables as IVariableProduct[]
        return (
          <div>
            {variables?.map((variable) => (
              <div key={variable._id}>
                {variable.count} шт. / {variable.weight} г
              </div>
            ))}
          </div>
        )
      },
    },
    {
      id: 'відвідувачі',
      header: 'відвідувачі',
      accessorKey: 'visited',
      cell: ({ row }) => {
        const product = row.original as IProduct
        return <div>{`${product.visited} користувачів`}</div>
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      header: '',
      cell: ({ row }) => {
        const product = row.original as IProduct
        const id = product._id
        const fineProduct = data.productAll.find((item) => item._id === id)
        return (
          <>
            <EditorProduct
              buttonTitle="редагувати"
              product={fineProduct}
              recommendations={recommendations}
            />
          </>
        )
      },
    },
  ]

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data: data.product,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by name..."
          value={(table.getColumn('назва')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('назва')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Колонки <ChevronDownIcon className="ml-2 h-4 w-4" />
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
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
