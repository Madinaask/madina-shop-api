import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },
    rating: {
      type: Number,
      required: [true, 'Оценка обязательна'],
      min: [1, 'Оценка минимум 1'],
      max: [5, 'Оценка максимум 5'],
    },
    comment: {
      type: String,
      required: [true, 'Комментарий обязателен'],
      trim: true,
      minlength: [3, 'Комментарий минимум 3 символа'],
      maxlength: [1000, 'Комментарий максимум 1000 символов'],
    },
  },
  { timestamps: true }
)

reviewSchema.index({ user: 1, product: 1 }, { unique: true })

export default mongoose.model('Review', reviewSchema)
