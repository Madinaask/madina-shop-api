# Plume API

Это backend часть финального проекта.  
Backend сделан на Node.js, Express и MongoDB.

API: https://madina-shop-api.onrender.com  
Документация: https://madina-shop-api.onrender.com/api/docs  
Frontend: https://madina-shop.vercel.app

## Что использовалось

- Node.js
- Express
- MongoDB + Mongoose
- JWT для авторизации
- bcrypt для паролей
- express-validator для проверки данных
- Swagger для документации

## Как запустить

```bash
bun install
cp .env.example .env
bun run dev
```

Если запускать локально, MongoDB можно поднять так:

```bash
docker compose up -d
```

## Переменные в .env

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/plume
JWT_SECRET=some_secret_key
JWT_EXPIRES_IN=7d
ADMIN_EMAIL=admin@example.com
FRONTEND_URL=http://localhost:5173
```

## Модели

- User
- Category
- Product
- Order
- Review

## Основные маршруты

- `/api/auth` - регистрация, вход, текущий пользователь
- `/api/users` - профиль, избранное, пользователи для админа
- `/api/categories` - категории
- `/api/products` - товары
- `/api/orders` - заказы
- `/api/reviews` - отзывы
- `/api/docs` - Swagger

## Структура

- `models` - модели MongoDB
- `controllers` - логика маршрутов
- `routes` - маршруты
- `middlewares` - auth, роли, ошибки
- `validators` - проверка данных
- `config` - база данных и swagger

## Деплой

Backend загружен на Render.  
Для базы данных используется MongoDB Atlas.
