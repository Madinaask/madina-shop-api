import Order from '../models/Order.js'
import Product from '../models/Product.js'

export async function createOrder(req, res) {
  try {
    const { items, shippingAddress } = req.body

    const productIds = items.map((i) => i.product)
    const products = await Product.find({ _id: { $in: productIds } })
    const byId = new Map(products.map((p) => [p._id.toString(), p]))

    const stockErrors = {}
    const missing = []
    for (const item of items) {
      const product = byId.get(item.product)
      if (!product) {
        missing.push(item.product)
        continue
      }
      if (item.quantity > product.stock) {
        stockErrors[product._id.toString()] = `Доступно только ${product.stock} шт. товара "${product.title}"`
      }
    }

    if (missing.length > 0) {
      return res.status(404).json({ error: 'Некоторые товары не найдены', missing })
    }
    if (Object.keys(stockErrors).length > 0) {
      return res.status(400).json({ error: 'Недостаточно товара на складе', fields: stockErrors })
    }

    const orderItems = items.map((item) => {
      const product = byId.get(item.product)
      return {
        product: product._id,
        quantity: item.quantity,
        priceAtPurchase: product.price,
      }
    })
    const total = orderItems.reduce(
      (sum, it) => sum + it.priceAtPurchase * it.quantity,
      0
    )

    for (const item of items) {
      await Product.updateOne(
        { _id: item.product },
        { $inc: { stock: -item.quantity } }
      )
    }

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      total,
      shippingAddress: shippingAddress || '',
    })
    const populated = await order.populate('items.product', 'title price image')

    res.status(201).json(populated)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

export async function getMyOrders(req, res) {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.product', 'title price image')
      .sort({ createdAt: -1 })
    res.json(orders)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function getOrder(req, res) {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'title price image')
      .populate('user', 'name email')
    if (!order) return res.status(404).json({ error: 'Заказ не найден' })

    const isOwner = order.user._id.toString() === req.user.id
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Доступ запрещён' })
    }
    res.json(order)
  } catch (error) {
    res.status(400).json({ error: 'Некорректный идентификатор' })
  }
}

export async function listAll(req, res) {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.product', 'title price')
      .sort({ createdAt: -1 })
    res.json(orders)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function updateStatus(req, res) {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    )
    if (!order) return res.status(404).json({ error: 'Заказ не найден' })
    res.json(order)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

export async function remove(req, res) {
  try {
    const order = await Order.findById(req.params.id)
    if (!order) return res.status(404).json({ error: 'Заказ не найден' })

    if (order.status !== 'cancelled') {
      for (const item of order.items) {
        await Product.updateOne(
          { _id: item.product },
          { $inc: { stock: item.quantity } }
        )
      }
    }

    await order.deleteOne()
    res.json({ message: 'Заказ удалён, остатки восстановлены', order })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}
