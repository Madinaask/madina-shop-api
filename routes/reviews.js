import express from 'express'
import * as reviewController from '../controllers/reviewController.js'
import auth from '../middlewares/auth.js'
import validate from '../middlewares/validate.js'
import { createRules, updateRules } from '../validators/reviewValidators.js'

export const productReviewsRouter = express.Router({ mergeParams: true })

/**
 * @openapi
 * /api/products/{productId}/reviews:
 *   get:
 *     summary: Список отзывов на товар
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: OK }
 */
productReviewsRouter.get('/', reviewController.listByProduct)

/**
 * @openapi
 * /api/products/{productId}/reviews:
 *   post:
 *     summary: Создать отзыв на товар (auth)
 *     tags: [Reviews]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [rating, comment]
 *             properties:
 *               rating: { type: integer, minimum: 1, maximum: 5 }
 *               comment: { type: string, minLength: 3, maxLength: 1000 }
 *     responses:
 *       201: { description: Создан }
 *       400: { description: Ошибка валидации }
 *       401: { description: Не авторизован }
 *       409: { description: Уже оставлен отзыв }
 */
productReviewsRouter.post('/', auth, createRules, validate, reviewController.create)

export const reviewsRouter = express.Router()

/**
 * @openapi
 * /api/reviews/{id}:
 *   patch:
 *     summary: Обновить свой отзыв
 *     tags: [Reviews]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: OK }
 *       400: { description: Ошибка валидации }
 *       401: { description: Не авторизован }
 *       403: { description: Нет прав }
 *       404: { description: Не найден }
 */
reviewsRouter.patch('/:id', auth, updateRules, validate, reviewController.updateOwn)

/**
 * @openapi
 * /api/reviews/{id}:
 *   delete:
 *     summary: Удалить отзыв (свой или admin)
 *     tags: [Reviews]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: OK }
 *       401: { description: Не авторизован }
 *       403: { description: Нет прав }
 *       404: { description: Не найден }
 */
reviewsRouter.delete('/:id', auth, reviewController.removeOwnOrAdmin)
