const express = require('express')
const router = express.Router()
let todoes = [];
const uuid = require('uuid')
const uuidv4 = uuid.v4;
const VersionMiddleWare = require('../middleware/VersionMiddleware')

router.get('/', [ VersionMiddleWare ] ,(req, res) => {
    res.status(200).send({
        type: req.type,
        statusCode: 0, 
        message: "Successful",
        todoes
    })
})

router.post('/', [ VersionMiddleWare ],  (req, res) => {
  const todo = req.body;
  const title = todo.title;
  
  if (!title) {
      res.status(200).send({
          statusCode: 1,
          message: 'Title is required',
          data: todo
      })
  }

  const todoData = {
      title: todo.title,
      completed: !!todo.completed,
      id: uuidv4()
  }

  todoes.push(todoData);
  res.status(200).send({
      statusCode: 0,
      message: "Created successfully",
      data: todoData
  })
})

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const newTodoes = todoes.map(todo => {
        if (todo.id === id) {
            todo.completed = !todo.completed
        }
        return todo;
    })

    res.status(200).send({
        statusCode: 0,
        message: "updated todo",
        data: {}
    })
})

router.delete('/:id', (req, res) => {
    const { id } = req.params
    const filteredTodo = todoes.filter(todo => todo.id !== id);
    todoes = filteredTodo;

    res.status(200).send({
        statusCode: 0,
        message: `Deleted todo with id ${id}`,
        data: {}
    })

})

module.exports = router;
