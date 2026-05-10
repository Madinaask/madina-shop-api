import mongoose from 'mongoose'

export async function connectDB(uri) {
  if (!uri) {
    console.error('MONGO_URI не задан в .env')
    process.exit(1)
  }
  try {
    await mongoose.connect(uri)
    console.log('MongoDB подключена')
  } catch (error) {
    console.error('Ошибка подключения к MongoDB:', error.message)
    process.exit(1)
  }
}
