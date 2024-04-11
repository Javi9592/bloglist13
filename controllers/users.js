const router = require('express').Router()
const { tokenExtractor } = require('../util/middleware')

const { User } = require('../models')
const { Blog } = require('../models')

router.get('/', async (_req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] },
    },
  })
  res.json(users)
})

router.post('/', async (req, res, next) => {
  try {
    const user = await User.create(req.body)
    res.json(user)
  } catch (error) {
    return res.status(400).json({ error })
    //return next(error)
  }
})

router.get('/:id', async (req, res) => {
  const where = {}

  if (req.query.read) {
    where['$readings.readingList.read$'] = req.query.read === "true"
  }

  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: ['id'] },
    include: [
      {
        model: Blog,
        as: 'readings',
        attributes: { exclude: ['userId', 'createdAt', 'updatedAt']},
        through: {
          attributes: ['read', 'id']
        },
        where
      },
    ],
  })
  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})

router.put('/:username', tokenExtractor, async (req, res, next) => {
  const newUsername = req.body.username
  if (!newUsername) {
    const error = new Error("username isn't in the body")
    return next(error)
  }
  try {
    const userOnToken = await User.findByPk(req.decodedToken.id)
    const userOnParams = await User.findOne({
      where: { username: req.params.username },
    })
    if (!userOnToken) {
      const error = new Error('Only users can access this')
      return next(error)
    }
    if (!userOnParams) {
      const error = new Error('The username on params does not exist')
      return next(error)
    }
    if (userOnToken.id != userOnParams.id) {
      const error = new Error("You can't change the username of this user")
      return next(error)
    }
    userOnParams.username = req.body.username

    const updatedUser = await userOnParams.save()

    console.log('updatedUser', updatedUser)

    return res.json(updatedUser)
  } catch (error) {
    next(error)
  }
})

module.exports = router
