const Note = require('../models/User')

module.exports = {
    async showHomePage(req, res) {
        const notes = await Note.findAll()

        res.render('home', {
            notes: notes.map(n => n.get({ plain: true }))
        })
    },

    showFormPage(req, res) {
        res.render('form')
    }
}