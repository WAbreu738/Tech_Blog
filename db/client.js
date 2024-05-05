const { Sequelize } = require('sequelize')

const client = new Sequelize(
    'tech_blog_db',
    'postgres',
    'pass', {
    host: 'localhost',
    dialect: 'postgres'
}
)

module.exports = client