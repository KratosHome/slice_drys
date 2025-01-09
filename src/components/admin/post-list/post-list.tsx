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

export const PostList: FC<IPostList> = ({ data }) => {
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
        const post = row.original
        return (
          <div className="flex items-center justify-center">
            {post.img && (
              <Image
                width={50}
                height={50}
                src={post.img}
                alt={post.title}
                className="h-10 w-10 rounded object-cover"
              />
            )}
          </div>
        )
      },
    },
    {
      id: 'автор',
      header: 'автор',
      accessorKey: 'author',
      cell: ({ row }) => {
        const post = row.original
        return <div>{post.author}</div>
      },
    },
    {
      id: 'заголовок',
      header: 'заголовок',
      accessorKey: 'title',
      cell: ({ row }) => {
        const post = row.original
        return <div>{post.title}</div>
      },
    },
    {
      id: 'відвідувань',
      header: 'відвідувань',
      accessorKey: 'name',
      cell: ({ row }) => {
        const post = row.original
        return <div>{post.visited}</div>
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      header: '',
      cell: ({ row }) => {
        const post = row.original as IPost
        const id = post._id
        const findPost = data.postAll?.find((item) => item._id === id)
        return (
          <>
            <EditorPost buttonTitle="редагувати" post={findPost} />
          </>
        )
      },
    },
  ]
  const table = useReactTable({
    data: data.post,
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
