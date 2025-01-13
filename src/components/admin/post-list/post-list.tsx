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
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table'
import Image from 'next/image'
import EditorPost from '../editor-post/editor-post'
import { Button } from '@/components/admin/ui/button'

interface IPostList {
  data: IGetPost
}

export const PostList: FC<IPostList> = ({ data }) => {
  const columns: ColumnDef<IPost>[] = [
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
      accessorKey: 'visited',
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
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: { pagination: { pageSize: 10 } },
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
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Попередня
          </Button>
          <span>
            Сторінка
            <strong>
              {table.getState().pagination.pageIndex + 1} з{' '}
              {table.getPageCount()}
            </strong>
          </span>
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
