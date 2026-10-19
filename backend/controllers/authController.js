import * as authService from '../services/authService.js'

export async function register(request, response, next) {
  try {
    const { name, email, password } = request.body
    const result = await authService.registerUser({ name, email, password })
    response.status(201).json(result)
  } catch (error) {
    next(error)
  }
}

export async function login(request, response, next) {
  try {
    const { email, password } = request.body
    const result = await authService.loginUser({ email, password })
    response.json(result)
  } catch (error) {
    next(error)
  }
}

export async function me(request, response, next) {
  try {
    const user = await authService.getProfile(request.user.id)
    response.json(user)
  } catch (error) {
    next(error)
  }
}
