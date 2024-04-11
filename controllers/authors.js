const router = require('express').Router()
const { Blog } = require('../models')
const { Sequelize } = require('sequelize')

router.get('/', async (_req, res) => {
  const blogs = await Blog.findAll({
    attributes: [
      'author',
      [Sequelize.fn('COUNT', Sequelize.col('title')), 'articles'],
      [Sequelize.fn('SUM', Sequelize.col('likes')), 'likes']
    ],
    group: ['author'],
    order: [[Sequelize.literal('likes'), 'DESC']],
  })
  res.json(blogs)
})

module.exports = router
