import { body } from 'express-validator'

const STATUSES = ['pending', 'paid', 'shipped', 'delivered', 'cancelled']

export const createRules = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('Заказ должен содержать хотя бы один товар'),
  body('items.*.product')
    .isMongoId()
    .withMessage('Некорректный идентификатор товара'),
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Количество должно быть целым числом ≥ 1'),
  body('shippingAddress').optional().isString().trim(),
]

export const updateStatusRules = [
  body('status')
    .isIn(STATUSES)
    .withMessage(`status должен быть одним из: ${STATUSES.join(', ')}`),
]
