const Note = require('../models/User')

module.exports = {
    async createNote(req, res) {
        await Note.create(req.body)

        res.redirect('/')
    }
}