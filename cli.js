require('dotenv').config()
const { Sequelize, QueryTypes } = require('sequelize')

const sequelize = new Sequelize(process.env.DATABASE_URL)

const main = async () => {
  try {
    await sequelize.authenticate()
    const blogs = await sequelize.query("SELECT * FROM blogs", { type: QueryTypes.SELECT })
    console.log(blogs.map(item => `${item.author}: \x1b[32m'${item.title}'\x1b[0m, ${item.likes} likes`).join('\n'))
    sequelize.close()
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

main()