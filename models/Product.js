import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Название товара обязательно'],
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Цена обязательна'],
      min: 0,
    },
    stock: {
      type: Number,
      required: [true, 'Остаток обязателен'],
      min: 0,
      default: 0,
    },
    image: {
      type: String,
      default: '',
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Категория обязательна'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
)

productSchema.index({ title: 'text', description: 'text' })

export default mongoose.model('Product', productSchema)
