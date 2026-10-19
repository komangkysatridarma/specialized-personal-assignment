import * as productService from '../services/productService.js'

export async function listProducts(_request, response) {
  const products = await productService.getAllProducts()
  response.json(products)
}

export async function getProduct(request, response) {
  const product = await productService.getProductById(request.params.id)
  response.json(product)
}

export async function createProduct(request, response) {
  const product = await productService.createProduct(request.body)
  response.status(201).json(product)
}

export async function updateProduct(request, response) {
  const product = await productService.updateProduct(request.params.id, request.body)
  response.json(product)
}

export async function deleteProduct(request, response) {
  await productService.deleteProduct(request.params.id)
  response.status(204).send()
}
