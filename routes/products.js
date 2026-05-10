import express from 'express'
import * as productController from '../controllers/productController.js'
import auth from '../middlewares/auth.js'
import requireRole from '../middlewares/requireRole.js'
import validate from '../middlewares/validate.js'
import { createRules, updateRules } from '../validators/productValidators.js'

const router = express.Router()

/**
 * @openapi
 * /api/products:
 *   get:
 *     summary: Список товаров (поддерживает ?category=, ?search=)
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200: { description: OK }
 */
router.get('/', productController.list)

/**
 * @openapi
 * /api/products/{id}:
 *   get:
 *     summary: Товар по id
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: OK }
 *       404: { description: Не найден }
 */
router.get('/:id', productController.getOne)

/**
 * @openapi
 * /api/products:
 *   post:
 *     summary: Создать товар (admin)
 *     tags: [Products]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, price, stock, category]
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               price: { type: number }
 *               stock: { type: integer }
 *               image: { type: string }
 *               category: { type: string, description: 'ObjectId категории' }
 *     responses:
 *       201: { description: Создан }
 *       400: { description: Ошибка валидации }
 *       401: { description: Не авторизован }
 *       403: { description: Нет прав }
 */
router.post('/', auth, requireRole('admin'), createRules, validate, productController.create)

/**
 * @openapi
 * /api/products/{id}:
 *   patch:
 *     summary: Обновить товар (admin)
 *     tags: [Products]
 *     security: [{ bearerAuth: [] }]
 */
router.patch('/:id', auth, requireRole('admin'), updateRules, validate, productController.update)

/**
 * @openapi
 * /api/products/{id}:
 *   delete:
 *     summary: Удалить товар (admin)
 *     tags: [Products]
 *     security: [{ bearerAuth: [] }]
 */
router.delete('/:id', auth, requireRole('admin'), productController.remove)

export default router
