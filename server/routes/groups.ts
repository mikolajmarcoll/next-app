import express from 'express'

import { upload } from '../controllers/aws'
import {
  addGroupMember,
  createGroup,
  deleteGroup,
  getGroup,
  getGroupMembers,
  getJoinedGroups,
  getPublicGroups,
  inviteMembers,
  removeGroupMember,
  updateGroup,
} from '../controllers/groups'

export const router = express.Router()

router.get('/', getPublicGroups)
router.get('/:userId/joined', getJoinedGroups)
router.get('/:id', getGroup)
router.get('/:id/members', getGroupMembers)
router.post('/', upload.single('photo'), createGroup)
router.put('/:id', upload.single('photo'), updateGroup)
router.post('/:id/inviteMembers', inviteMembers)
router.put('/:id/addMember', addGroupMember)
router.put('/:id/removeMember', removeGroupMember)
router.delete('/:id', deleteGroup)
