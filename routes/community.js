import express from 'express';
const router = express.Router({mergeParams: true});
import multer from 'multer';
import {storage} from '../cloudinary';
const upload = multer({storage});

import * as Community from '../controllers/community';
import {wrapAsync} from '../utils';
import * as middlewares from '../middlewares';

//List all
router.get('/',
    wrapAsync(Community.index)
)

//Create
router.get('/new',
    // middlewares.isSignIn,
    Community.newCommunity)

router.post('/',
    middlewares.isSignIn,
    upload.single('logo'),
    wrapAsync(Community.create))

//Edit
router.get('/:communityId/settings',
    middlewares.isSignIn,
    middlewares.isAdmin,
    upload.single('logo'),
    wrapAsync(Community.settings))

router.put('/:communityId',
    middlewares.isSignIn,
    middlewares.isAdmin,
    wrapAsync(Community.update))

//Delete
router.delete('/:communityId',
    wrapAsync(Community.remove))

//Show
router.get('/:communityId',
    wrapAsync(Community.show))


//New Post
router.get('/:communityId/posts/new',
    middlewares.isSignIn,
    middlewares.isMember,
    wrapAsync(Community.newPost));

router.post('/:communityId/posts',
    middlewares.isSignIn,
    middlewares.isMember,
    wrapAsync(Community.createPost));



export default router;