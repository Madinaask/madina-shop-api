import express from 'express'
import * as authController from '../controllers/authController.js'
import auth from '../middlewares/auth.js'
import validate from '../middlewares/validate.js'
import { registerRules, loginRules } from '../validators/authValidators.js'

const router = express.Router()

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Регистрация нового пользователя
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string, minLength: 2, maxLength: 50 }
 *               email: { type: string, format: email }
 *               password: { type: string, minLength: 6 }
 *     responses:
 *       201: { description: Создан, возвращается JWT }
 *       400: { description: Ошибка валидации }
 *       409: { description: Email уже занят }
 */
router.post('/register', registerRules, validate, authController.register)

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Вход
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string }
 *     responses:
 *       200: { description: Успешный вход, возвращается JWT }
 *       401: { description: Неверные данные }
 */
router.post('/login', loginRules, validate, authController.login)

/**
 * @openapi
 * /api/auth/me:
 *   get:
 *     summary: Текущий пользователь
 *     tags: [Auth]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Профиль текущего пользователя }
 *       401: { description: Не авторизован }
 */
router.get('/me', auth, authController.me)

export default router
