export default function errorHandler(err, req, res, next) {
  console.error(err)

  if (err.name === 'ValidationError') {
    const fields = {}
    for (const [path, e] of Object.entries(err.errors || {})) {
      fields[path] = e.message
    }
    return res.status(400).json({ error: 'Ошибка валидации', fields })
  }

  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(400).json({ error: 'Некорректный идентификатор' })
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'поле'
    return res.status(409).json({ error: `Значение поля "${field}" уже занято` })
  }

  const status = err.status || 500
  res.status(status).json({ error: err.message || 'Внутренняя ошибка сервера' })
}
