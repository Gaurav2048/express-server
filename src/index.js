const express = require('express') // is similar to import from something 
const bcrypt = require('bcrypt')
const { JWT_SECRET } = require('./constant')
const jwt = require('jsonwebtoken')
const v1 = require('./v1')
const v2 = require('./v2')
const app = express();
app.use(express.json()); 

app.use('/v1', v1); 
app.use('/v2', v2)


const users = [];
const todos = []; 

app.post('/create_user', (req, res) => {
    const body = req.body;
    // if email and password is present 
    if (!body.email || !body.password) {
        return res.send({
            statusCode: 1,
            message: "Email or Password not present"
        })
    };

    // user present or not 
    const isPresent = users.some(user => user.email === body.email);
    if (isPresent) {
        return res.send({
            statusCode: 1,
            message: 'User already exists',
        })
    }
    // user not present and required data is there
    const password = body.password;
    const hashedPassword = bcrypt.hashSync(password, 10);
    console.log('Hashed password', hashedPassword);
    const user = {
        ...body,
        password: hashedPassword
    }
    users.push(user);
    res.send({
        statusCode: 0,
        message: "User Created Successfully",
        data: user
    })
})

app.post('/login', (req, res) => {
    const body = req.body;
    // if user present. 
    const isPresent = users.some(user => user.email === body.email);
    if (!isPresent) {
        return res.send({
            statusCode: 1,
            message: "Please sign up!"
        })
    }

    // password match 
    const user = users.filter(user => user.email === body.email)?.[0]; 
    const isMatch = bcrypt.compareSync(body.password, user.password);
    if (!isMatch) {
        return res.send({
            statusCode: 1,
            message: "Password not matching"
        })
    }

    // create a JWT and store it in server and send response back 
    const payload = {
        email: user.email
    }

   jwt.sign(payload, JWT_SECRET, (err, token) => {
        if (err) {
            return res.status(500).send({
                statusCode: 1,
                message: "Internal Server error",
                error: err
            })
        }

        // add the token to users array
        for (const user of users) {
            if(user.email === body.email) {
                user.token = token;
            } 
        }

        // send response with token
        res.send({
            statusCode: 0,
            message: "Login successful",
            data: {
                ...user,
                token
            }
        })

    }); 

})

app.post('/todo', (req, res) => {
    const todo = req.body;
    // token 
    const token = req.headers['x-http-token'];
    if (!token) {
        return res.send({
            statusCode: 1,
            message: "Authentication failed. Please give token"
        })
    }

    // token found 
    jwt.verify(token, JWT_SECRET, (err, decode) => {
        if (err) {
            return res.send({
                statusCode: 1,
                message: "Invalid token",
                error: err
            })
        }
        const data = {
            ...todo,
            creator: decode.email,
        }
        todos.push(data);
        res.send({
            statusCode: 0,
            message: "Todo created", 
            data
        })
    });
})

app.get('/todo', (req, res) => {
    const token = req.headers['x-http-token'];
    if (!token) {
        return res.send({
            statusCode: 1,
            message: "Authentication failed. Please give token"
        })
    }

    // token found 
    jwt.verify(token, JWT_SECRET, (err, decode) => {
        if (err) {
            return res.send({
                statusCode: 1,
                message: "Invalid token",
                error: err
            })
        }
        console.log(todos);
        const email = decode.email
        const filteredTodoes = todos.filter(todo => todo.creator === email); 

        res.send({
            statusCode: 0,
            message: "Fetched successfully", 
            data: filteredTodoes
        })

    });
})


// GET, POST, PUT, PATCH & DELETE
// products -> all products 
// products/{uuid} -> one particular product

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