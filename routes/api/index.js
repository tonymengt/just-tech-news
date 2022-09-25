const router = require('express').Router();

const userRouter = require('./user-routes');
const postRouter = require('./post-routes');

router.use('/users', userRouter);
router.use('/post', postRouter);

module.exports=router;