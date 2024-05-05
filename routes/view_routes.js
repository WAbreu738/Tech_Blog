const router = require('express').Router()
const { Post, User } = require('../models')

const view_controller = require('../controllers/view_controller')

//Homepage
// router.get('/', view_controller.showHomePage)

//Show the note form page
router.get('/create', view_controller.showFormPage)

// function isAuthenticated(req, res, next) {
  
//     if (!req.session.user_id) {
//         return res.redirect('/login')
//     }

//     next()
// }




// Show register page
router.get('/register', (req, res) => {
    res.render('register');
});


//Show login page
router.get('/login', (req, res) => {
    res.render('login');
});

// Show dashboard
router.get('/dashboard', async (req, res) => {
    try {
        const posts = await Post.findAll({
            where: {
                user_id: req.session.user_id
            },
            include: User
        })
        
        const currentUser = req.session.user_id ? true : false

        res.render('dashboard', { 
            posts: posts.map(eobj => eobj.get({ plain: true })),
            // createdAt: posts.createdAt.toLocalDateString('en-US', {
            //     month: '2-digit',
            //     day: '2-digit',
            //     year: 'numeric'
            // }),
            user: currentUser 
         })

    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).send('Internal Server Error');
    }
});

    //Show home page
router.get('/', async (req, res) => {
    try {
        const posts = await Post.findAll({
            include: User
        })
        console.log(posts)
        const currentUser = req.session.user_id ? true : false

        res.render('home', { 
            posts: posts.map(eobj => eobj.get({ plain: true })),
            // createdAt: posts.createdAt.toLocalDateString('en-US', {
            //     month: '2-digit',
            //     day: '2-digit',
            //     year: 'numeric'
            // }),
            user: currentUser 
         })

    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Render update page with post data
router.get('/update/:postId', async (req, res) => {
    try {
        const { postId } = req.params;

        // Find the post by ID
        const post = await Post.findByPk(postId);

        if (!post) {
            return res.status(404).send('Post not found');
        }

        res.render('update', { postId: postId, title: post.title, text: post.text });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});


// Logout route to destroy session
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
      if (err) {
        console.error('Error destroying session:', err);
        res.sendStatus(500)
      } else {
        res.redirect('/login')
      }
    })
  })


module.exports = router