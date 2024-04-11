const router = require('express').Router()
const { ReadingList } = require('../models')
const { tokenExtractor } = require('../util/middleware')

router.post('/', async (req, res) => {
  const { blogId, userId } = req.body
  const readingList = await ReadingList.create({ blogId, userId })
  res.json(readingList)
})

router.put('/:id', tokenExtractor, async (req, res, next) => {
  const readingList = await ReadingList.findByPk(req.params.id)
  const { read } = req.body
  if (read) {
    if (readingList.userId === req.decodedToken.id) {
      readingList.read = read
      await readingList.save()
      res.send(readingList)
    } else {
      const error = new Error('Only user can edit his own ReadingLists')
      next(error)
    }
  } else {
    const error = new Error('Missing read in the body')
      next(error)
  }
})

router.get('/', async (req, res) => {
  const readingList = await ReadingList.findAll()
  res.json(readingList)
})

module.exports = router
