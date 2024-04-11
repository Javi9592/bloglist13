const router = require('express').Router()
const ActiveSessions = require('../models/active_session')
const { tokenExtractor } = require('../util/middleware')

router.get('/', async (req, res) => {
  res.send('Hello')
})

router.post('/', tokenExtractor, async (req, res, next) => {
  const tokenId = await ActiveSessions.findByPk(req.decodedToken.jti)
  try {
    await tokenId.destroy()
    return res.status(200).json({ message: 'Logout successfully' })
  } catch {
    next(error)
  }
})

module.exports = router
