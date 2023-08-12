const jwt = require('jsonwebtoken');
require('dotenv').config('../../../Backend/.env')

const generatingAuthToken = (_id, name, lastname, email, password, isAdmin) => {
    const token = jwt.sign({ _id, name, lastname, email, password, isAdmin },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "7h" }
    )
    return token
}

module.exports = {
    generatingAuthToken
}

