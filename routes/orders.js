import express from 'express'
import * as orderController from '../controllers/orderController.js'
import auth from '../middlewares/auth.js'
import requireRole from '../middlewares/requireRole.js'
import validate from '../middlewares/validate.js'
import { createRules, updateStatusRules } from '../validators/orderValidators.js'

const router = express.Router()

/**
 * @openapi
 * /api/orders:
 *   post:
 *     summary: Создать заказ (user)
 *     tags: [Orders]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [items]
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [product, quantity]
 *                   properties:
 *                     product: { type: string }
 *                     quantity: { type: integer, minimum: 1 }
 *               shippingAddress: { type: string }
 *     responses:
 *       201: { description: Заказ создан }
 *       400: { description: Ошибка валидации или нехватка товара }
 *       401: { description: Не авторизован }
 */
router.post('/', auth, createRules, validate, orderController.createOrder)

/**
 * @openapi
 * /api/orders/me:
 *   get:
 *     summary: Заказы текущего пользователя
 *     tags: [Orders]
 *     security: [{ bearerAuth: [] }]
 */
router.get('/me', auth, orderController.getMyOrders)

/**
 * @openapi
 * /api/orders:
 *   get:
 *     summary: Все заказы (admin)
 *     tags: [Orders]
 *     security: [{ bearerAuth: [] }]
 */
router.get('/', auth, requireRole('admin'), orderController.listAll)

/**
 * @openapi
 * /api/orders/{id}:
 *   get:
 *     summary: Заказ по id (свой или admin)
 *     tags: [Orders]
 *     security: [{ bearerAuth: [] }]
 */
router.get('/:id', auth, orderController.getOrder)

/**
 * @openapi
 * /api/orders/{id}/status:
 *   patch:
 *     summary: Изменить статус заказа (admin)
 *     tags: [Orders]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, paid, shipped, delivered, cancelled]
 */
router.patch(
  '/:id/status',
  auth,
  requireRole('admin'),
  updateStatusRules,
  validate,
  orderController.updateStatus
)

/**
 * @openapi
 * /api/orders/{id}:
 *   delete:
 *     summary: Удалить заказ (admin). Если статус не cancelled — остатки восстанавливаются
 *     tags: [Orders]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Удалён }
 *       404: { description: Не найден }
 */
router.delete('/:id', auth, requireRole('admin'), orderController.remove)

export default router
