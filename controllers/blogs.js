const router = require('express').Router()
const { Op, Sequelize } = require('sequelize')
const { tokenExtractor } = require('../util/middleware')

const { Blog } = require('../models')
const { User } = require('../models')

const blogFinder = async (req, _res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}

router.get('/', async (req, res) => {
  const where = {}

  if (req.query.search) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${req.query.search}%` } },
      { author: { [Op.iLike]: `%${req.query.search}%` } },
    ]
  }
  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name'],
    },
    where,
    order: [[Sequelize.literal('likes'), 'DESC']],
  })
  res.json(blogs)
})

router.post('/', tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.create({
      ...req.body,
      userId: user.id,
      date: new Date(),
    })
    return res.json(blog)
  } catch (error) {
    next(error)
  }
})

router.get('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    return res.json(req.blog)
  } else {
    return res.status(404).end()
  }
})

router.delete('/:id', tokenExtractor, blogFinder, async (req, res, next) => {
  if (req.blog && req.decodedToken) {
    if (req.decodedToken.id == req.blog.userId) {
      try {
        await req.blog.destroy()
        return res.status(200).json({ message: 'Blog deleted successfully' })
      } catch (error) {
        next(error)
      }
    } else {
      const error = new Error('Only the owner of the blog can delete the blog')
      return next(error)
    }
  } else {
    const message =
      req.blog && !req.decodedToken
        ? 'only users can delete a blog'
        : !req.blog && req.decodedToken
        ? 'this id does not exist'
        : 'existing id is required and only users can delete a blog'
    const error = new Error(message)
    return next(error)
  }
})

router.put('/:id', blogFinder, async (req, res, next) => {
  // Verificar si se proporcionó tanto el blog como el número de likes en el cuerpo de la solicitud
  if (req.blog && req.body.likes) {
    // Extraer el número de likes del cuerpo de la solicitud
    const likes = req.body.likes

    // Actualizar el número de likes del blog
    req.blog.likes = likes

    try {
      // Guardar los cambios en la base de datos
      const blogUpdated = await req.blog.save()

      // Responder con el blog actualizado
      return res.json(blogUpdated)
    } catch (error) {
      // Manejar cualquier error que ocurra durante el proceso de guardado
      return next(error)
    }
  } else {
    // Si no se proporcionaron tanto el blog como el número de likes, pasar al siguiente middleware para manejar el error
    const message =
      req.blog && !req.body.likes
        ? 'likes are not in the body'
        : !req.blog && req.body.likes
        ? 'id does not exist'
        : 'exist id required and likes are not in the body'
    const error = new Error(message)
    return next(error)
  }
})

module.exports = router
