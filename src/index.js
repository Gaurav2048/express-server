const express = require('express') // is similar to import from something 
const uuid = require('uuid')
const app = express();
app.use(express.json()); //-> body is of type json
const uuidv4 = uuid.v4;
// GET, POST, PUT, PATCH & DELETE
// products -> all products 
// products/{uuid} -> one particular product

let todoes = [];

app.get('/todos', (req, res) => {
    res.status(200).send({
        statusCode: 0, 
        message: "Successful",
        todoes
    })
})

app.post('/todo', (req, res) => {
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

app.put('/todo/:id', (req, res) => {
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

app.delete('/todo/:id', (req, res) => {
    const { id } = req.params
    const filteredTodo = todoes.filter(todo => todo.id !== id);
    todoes = filteredTodo;

    res.status(200).send({
        statusCode: 0,
        message: `Deleted todo with id ${id}`,
        data: {}
    })

})

const errorHandler = (error, req, res, _) => {
    res.status(500).send({
        statusCode: 1,
        message: "Something went wrong",
        data: error.message
    })
}

app.use(errorHandler);

const port = 3000
app.listen(port, () => {
    console.log('Running on port 3000');
})


// app.get('/products', (req, res) => {
//     console.log("url hit", req.url);
//     const query = req.query
//     res.send([
//         {
//             id: 1, 
//             title: "Pen"
//         }
//     ])
// })

// app.get('/products/:id/rating/:userId', (req, res) => {
//     console.log("url hit", req.url);
//     const query = req.query
//     const params = req.params;
//     `select blablabla where id=${params.id}`
//     res.send({
//         "message": "Get one product",
//         ...params
//     })
// })