import express from 'express';
const router = express.Router({mergeParams: true});

import * as Comment from '../controllers/comment';
import {wrapAsync} from '../utils';
import * as middlewares from '../middlewares';

router.post('/', 
    middlewares.isSignIn, 
    middlewares.validateComment,
    wrapAsync(Comment.create))

router.put('/:commentId', 
    middlewares.isSignIn,
    middlewares.isCommentAuthor,
    middlewares.validateComment,
    wrapAsync(Comment.update))

//Delete    
router.delete('/:commentId', 
    middlewares.isSignIn, 
    middlewares.isCommentAuthor,
    wrapAsync(Comment.remove))

export default router;