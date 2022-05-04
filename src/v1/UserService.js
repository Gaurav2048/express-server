const express = require('express')
const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).send({
        statusCode: 0,
        message: 'Fetched users successfully',
        data: [
            {
                email: "xyz@gmail.com"
            },
            {
                email: "example@gmail.com"
            }
        ]
    })
})

module.exports = router;
