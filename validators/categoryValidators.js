import { body } from 'express-validator'

export const createRules = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Название должно содержать от 2 до 50 символов'),
  body('description').optional().isString().trim(),
]

export const updateRules = [
  body('name').optional().trim().isLength({ min: 2, max: 50 }),
  body('description').optional().isString().trim(),
]
