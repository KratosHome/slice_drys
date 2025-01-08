'use client'
import * as React from 'react'
import { FC } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/admin/ui/table'
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
import { Checkbox } from '@/components/admin/ui/checkbox'
import Image from 'next/image'
import EditorPost from '../editor-post/editor-post'

interface IPostList {
  data: IGetPost
}

const examplePostLocal: IPostLocal = {
  _id: '677ce334bf6de04db106be49',

  title: {
    en: 'Example Title 1Example Title 1Example Title 1',
    uk: 'Приклад заголовкуПриклад заголовкуПриклад заголовку',
  },
  content: {
    en: '{"ops":[{"insert":"sdf\\n"}]}',
    uk: '{"ops":[{"insert":"sdfs\\n"}]}',
  },
  img: 'https://res.cloudinary.com/dohos5iu3/image/upload/v1736237875/post-slice/xbpxg7agjkiqpduat4uc.png',
  author: {
    en: 'fsdfsds',
    uk: 'dfsdfsdfs',
  },
  slug: 'example-title-1example-title-1example-title-1',
  metaDescription: {
    en: 'sdfsdfsdfsdfssdfsdfsdfsdfssdfsdfsdfsdfssdfsdfsdfsdfssdfsdfsdfsdfssdfsdfsdfsdfs',
    uk: 'sdfsdfsdfsdfssdfsdfsdfsdfssdfsdfsdfsdfssdfsdfsdfsdfssdfsdfsdfsdfssdfsdfsdfsdfs',
  },
  keywords: {
    en: ['sdfsdfsdfsdfs'],
    uk: ['sdfsdfsdfsdfs'],
  },
}

export const ProductList: FC<IPostList> = ({ data }) => {
  const columns: ColumnDef<IPost>[] = [
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
          onCheckedChange={(value) => {
            row.toggleSelected(!!value)
          }}
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
                alt={product.title}
                className="h-10 w-10 rounded object-cover"
              />
            )}
          </div>
        )
      },
    },
    {
      id: 'заголовок',
      header: 'заголовок',
      accessorKey: 'name',
      cell: ({ row }) => {
        const product = row.original
        return <div>{product.title}</div>
      },
    },
    {
      id: 'відвідувань',
      header: 'відвідувань',
      accessorKey: 'name',
      cell: ({ row }) => {
        const product = row.original
        return <div>{product.visited}</div>
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      header: '',
      cell: ({ row }) => {
        const product = row.original as IPost
        const id = product._id
        const fineProduct = data.productAll?.find((item) => item._id === id)
        return (
          <>
            <EditorPost buttonTitle="редагувати" post={examplePostLocal} />
          </>
        )
      },
    },
  ]
  const table = useReactTable({
    data: data.product,
    columns,
    // onSortingChange: setSorting,
    // onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    // onColumnVisibilityChange: setColumnVisibility,
    // onRowSelectionChange: setRowSelection,
    // state: {
    //   sorting,
    //   columnFilters,
    //   columnVisibility,
    //   rowSelection,
    // },
  })

  return (
    <div>
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
