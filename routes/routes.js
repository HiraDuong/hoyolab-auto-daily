const routes = require('express').Router()
const controller = require('../controller/controller')
const apiController = require('../controller/apiController')
// Get all accounts
routes.get('/accounts', controller.getAllAccounts)
// Get an account by nickname
routes.get('/accounts/:nickname', controller.getAccountByNickname)
// Create an account
routes.post('/accounts', controller.createAccount)
// Update an account
routes.put('/accounts/:id', controller.updateAccount)
// Delete an account
routes.delete('/accounts/:id', controller.deleteAccount)

// Export the routes for the API
routes.post('/game/create', apiController.createApiUrl)
routes.get('/game/all', apiController.getApiUrl)
routes.delete('/game/delete/:id', apiController.deleteApiUrl)
routes.put('/game/update/:id', apiController.updateApiUrl)
module.exports = routes
