const express = require('express')
const router = express.Router()
const userService = require('./UserService')
const todoService = require('./TodoService')

router.use('/users', userService)
router.use('/todos', todoService)

module.exports = router;
