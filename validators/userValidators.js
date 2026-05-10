import { body, param } from 'express-validator'

export const updateMeRules = [
  body('name').optional().trim().isLength({ min: 2, max: 50 }),
  body('email').optional().isEmail().normalizeEmail(),
  body('password').optional().isLength({ min: 6 }),
]

export const adminUpdateRules = [
  body('name').optional().trim().isLength({ min: 2, max: 50 }),
  body('email').optional().isEmail().normalizeEmail(),
  body('password').optional().isLength({ min: 6 }),
  body('role').optional().isIn(['user', 'admin']),
]

export const wishlistProductIdRule = [
  param('productId')
    .isMongoId()
    .withMessage('Некорректный идентификатор товара'),
]
