import { Router } from 'express'
import * as productController from '../controllers/productController.js'
import { authenticate } from '../middleware/authMiddleware.js'

const router = Router()

router.get('/', productController.listProducts)
router.get('/:id', productController.getProduct)
router.post('/', authenticate, productController.createProduct)
router.put('/:id', authenticate, productController.updateProduct)
router.delete('/:id', authenticate, productController.deleteProduct)

export default router
