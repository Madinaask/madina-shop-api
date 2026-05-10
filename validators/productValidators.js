import { body } from 'express-validator'

export const createRules = [
  body('title')
    .trim()
    .isLength({ min: 2, max: 120 })
    .withMessage('Название должно содержать от 2 до 120 символов'),
  body('description').optional().isString().trim(),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Цена должна быть числом ≥ 0'),
  body('stock')
    .isInt({ min: 0 })
    .withMessage('Остаток должен быть целым числом ≥ 0'),
  body('category')
    .isMongoId()
    .withMessage('Некорректный идентификатор категории'),
  body('image').optional().isString().trim(),
]

export const updateRules = [
  body('title').optional().trim().isLength({ min: 2, max: 120 }),
  body('description').optional().isString().trim(),
  body('price').optional().isFloat({ min: 0 }),
  body('stock').optional().isInt({ min: 0 }),
  body('category').optional().isMongoId(),
  body('image').optional().isString().trim(),
]
