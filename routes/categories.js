import express from 'express'
import * as categoryController from '../controllers/categoryController.js'
import auth from '../middlewares/auth.js'
import requireRole from '../middlewares/requireRole.js'
import validate from '../middlewares/validate.js'
import { createRules, updateRules } from '../validators/categoryValidators.js'

const router = express.Router()

/**
 * @openapi
 * /api/categories:
 *   get:
 *     summary: Список категорий
 *     tags: [Categories]
 *     responses:
 *       200: { description: OK }
 */
router.get('/', categoryController.list)

/**
 * @openapi
 * /api/categories/{id}:
 *   get:
 *     summary: Категория по id
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: OK }
 *       404: { description: Не найдена }
 */
router.get('/:id', categoryController.getOne)

/**
 * @openapi
 * /api/categories:
 *   post:
 *     summary: Создать категорию (admin)
 *     tags: [Categories]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *     responses:
 *       201: { description: Создана }
 *       400: { description: Ошибка валидации }
 *       401: { description: Не авторизован }
 *       403: { description: Нет прав }
 */
router.post('/', auth, requireRole('admin'), createRules, validate, categoryController.create)

/**
 * @openapi
 * /api/categories/{id}:
 *   patch:
 *     summary: Обновить категорию (admin)
 *     tags: [Categories]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Обновлена }
 */
router.patch('/:id', auth, requireRole('admin'), updateRules, validate, categoryController.update)

/**
 * @openapi
 * /api/categories/{id}:
 *   delete:
 *     summary: Удалить категорию (admin)
 *     tags: [Categories]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Удалена }
 */
router.delete('/:id', auth, requireRole('admin'), categoryController.remove)

export default router
