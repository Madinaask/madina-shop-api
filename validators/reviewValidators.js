import { body } from 'express-validator'

export const createRules = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Оценка должна быть целым числом от 1 до 5'),
  body('comment')
    .isString()
    .trim()
    .isLength({ min: 3, max: 1000 })
    .withMessage('Комментарий должен содержать от 3 до 1000 символов'),
]

export const updateRules = [
  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Оценка должна быть целым числом от 1 до 5'),
  body('comment')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 3, max: 1000 })
    .withMessage('Комментарий должен содержать от 3 до 1000 символов'),
]
