const router = require('express').Router()

const { Post, User } = require('../models')

//Register user
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body


        //Create a user in the databse
        const newUser = await User.create(({
            username,
            password,

        }))

        req.session.user_id = newUser.user_id
        res.redirect('/')
    } catch (err) {
        console.log(err)

        res.redirect('/register')
    }
})

//Login a User
router.post('/login', async (req, res) => {
  const { username, password } = req.body
  

  try {
    // Find user by username
    const user = await User.findOne({ where: { username } })

    // If user not found or password doesn't match, return error
    if (!user || !user.validatePass(password)) {
      return res.status(401).json({ error: 'Invalid username or password' })
    }
    req.session.user_id = user.user_id
  
    res.redirect('/')

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' })
  }
})


// Create a POST route to create an event
router.post('/dashboard', async (req, res) => {
    try {
      const { title, text } = req.body;
      console.log(req.body);
      // Create a new event in the database
      const newPost = await Post.create({
        title,
        text,
        user_id: req.session.user_id
      });
  
      
      req.session.user_id = newPost.user_id
    res.redirect('/')
    } catch (err) {
      console.log(err)
  
      const errors = err.errors.map(eObj => {
        return {
          message: eObj.message
        }
      })
  
      res.status(403).json({
        message: 'Validation Error',
        errors: errors
      })
    }
  })

  router.post('/update/:postId', async (req, res) => {
    try {
        const { postId } = req.params;
        const { title, text } = req.body;

        // Update the post in the database
        const updatedPost = await Post.findByPk(postId);
        if (!updatedPost) {
            return res.status(404).json({ error: 'Post not found' });
        }

        updatedPost.title = title;
        updatedPost.text = text;
        await updatedPost.save();

        res.redirect('/dashboard'); // Redirect to dashboard after successful update
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/delete/:postId', async (req, res) => {
  try {
    const { postId } = req.params;

    // Find the post by ID
    const post = await Post.findByPk(postId);

    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }

    // Delete the post from the database
    await post.destroy();
      res.redirect('/dashboard')
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router