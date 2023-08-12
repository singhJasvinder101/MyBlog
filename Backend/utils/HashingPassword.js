const bcrypt = require('bcryptjs')
const salt = bcrypt.genSaltSync(10)

const hashingPassword = (password) => {
    const hashedPassword = bcrypt.hashSync(password, salt)
    return hashedPassword
}

const comparePassword = (password, hashedPassword) => {
    const comparedPassword = bcrypt.compareSync(password, hashedPassword)
    return comparedPassword
}

module.exports = {
    hashingPassword,
    comparePassword
}
