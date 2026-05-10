import express from 'express'
import * as userController from '../controllers/userController.js'
import auth from '../middlewares/auth.js'
import requireRole from '../middlewares/requireRole.js'
import validate from '../middlewares/validate.js'
import {
  updateMeRules,
  adminUpdateRules,
  wishlistProductIdRule,
} from '../validators/userValidators.js'

const router = express.Router()

/**
 * @openapi
 * /api/users/me:
 *   patch:
 *     summary: Обновить свой профиль (user)
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 */
router.patch('/me', auth, updateMeRules, validate, userController.updateMe)

/**
 * @openapi
 * /api/users/me/wishlist:
 *   get:
 *     summary: Список желаемого
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 */
router.get('/me/wishlist', auth, userController.getWishlist)

/**
 * @openapi
 * /api/users/me/wishlist/{productId}:
 *   post:
 *     summary: Добавить товар в избранное
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: string }
 */
router.post(
  '/me/wishlist/:productId',
  auth,
  wishlistProductIdRule,
  validate,
  userController.addToWishlist
)

/**
 * @openapi
 * /api/users/me/wishlist/{productId}:
 *   delete:
 *     summary: Убрать товар из избранного
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 */
router.delete(
  '/me/wishlist/:productId',
  auth,
  wishlistProductIdRule,
  validate,
  userController.removeFromWishlist
)

/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: Список пользователей (admin)
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 */
router.get('/', auth, requireRole('admin'), userController.list)

/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     summary: Пользователь по id (admin)
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 */
router.get('/:id', auth, requireRole('admin'), userController.getOne)

/**
 * @openapi
 * /api/users/{id}:
 *   patch:
 *     summary: Обновить пользователя (admin)
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 */
router.patch(
  '/:id',
  auth,
  requireRole('admin'),
  adminUpdateRules,
  validate,
  userController.adminUpdate
)

/**
 * @openapi
 * /api/users/{id}:
 *   delete:
 *     summary: Удалить пользователя (admin)
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 */
router.delete('/:id', auth, requireRole('admin'), userController.remove)

export default router
