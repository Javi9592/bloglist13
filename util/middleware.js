const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')
const { ActiveSession } = require('../models')
const { User } = require('../models')

const errorHandler = (error, _request, response, _next) => {
  if (error.name === 'SequelizeValidationError') {
    console.log('error.name', error.name)
    console.log('error.message', error.message)
    return response.status(400).json(error.message)
  } else {
    console.log('error.name', error.name)
    console.log('error.message', error.message)
    return response.status(400).json({ error })
  }
}

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      const decodedToken = jwt.verify(authorization.substring(7), SECRET)
      const activeSession = await ActiveSession.findByPk(decodedToken.jti)
      if (activeSession) {
        const user = await User.findByPk(decodedToken.id)
        if (user.disabled == true) {
          return res.status(401).json({ error: 'user disabled' })
        } else {
          req.decodedToken = decodedToken
        }
      } else {
        return res.status(401).json({ error: 'token expired' })
      }
    } catch {
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

module.exports = { tokenExtractor, errorHandler }
