import assert from 'node:assert/strict'
import { test } from 'node:test'

import { hasAdminPermission, isAdminRole } from './user-role'
import { appSidebarData } from '@/data/app-sidebar'

test('review moderation is available to managers and super-admins with a protected sidebar entry', () => {
  assert.equal(hasAdminPermission('manager', 'reviews:manage'), true)
  assert.equal(hasAdminPermission('super-admin', 'reviews:manage'), true)
  assert.equal(isAdminRole('client'), false)
  assert.equal(isAdminRole('developer'), false)
  assert.equal(hasAdminPermission('manager', 'users:manage'), false)
  assert.equal(hasAdminPermission('manager', 'products:manage'), false)
  assert.equal(
    appSidebarData.find((item) => item.link === 'admin/reviews')?.permission,
    'reviews:manage',
  )
})
