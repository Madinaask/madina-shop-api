import { validationResult } from 'express-validator'

export default function validate(req, res, next) {
  const errors = validationResult(req)
  if (errors.isEmpty()) return next()

  const fieldErrors = {}
  for (const err of errors.array()) {
    const field = err.path || err.param
    if (!fieldErrors[field]) fieldErrors[field] = err.msg
  }

  return res.status(400).json({
    error: 'Ошибка валидации',
    fields: fieldErrors,
  })
}
