const routes = require('express').Router();
const controller = require('../controller/controller');

// Get all accounts
routes.get('/accounts', controller.getAllAccounts);
// Get an account by nickname
routes.get('/accounts/:nickname', controller.getAccountByNickname);
// Create an account
routes.post('/accounts', controller.createAccount);
// Update an account
routes.put('/accounts/:nickname', controller.updateAccount);
// Delete an account
routes.delete('/accounts/:nickname', controller.deleteAccount);

module.exports = routes;