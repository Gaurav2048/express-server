const bcrypt = require('bcrypt')

const password = 'abcd1234'

const hash = bcrypt.hashSync(password, 10);
console.log(hash);

const matched = bcrypt.compareSync('abecd1234', hash)
console.log('match', matched);