### Routes:
- GET / Home *
- GET /posts  All Posts *
- POST /search Search Result Page *
- GET /user Current user *
- /:userId/posts Post CRUD 
- /:userId/posts/:postId/comments Comment CRUD 
- /users & /:userId User CRUD

#### Post CRUD
- GET /new New post form
- POST / Create post *
- GET /:postId/edit Update post form
- PUT /:postId Update post *
- DELETE /:postId Delete post *
- GET /:postId Show post *

#### Comment CRUD
- POST / Create Comment *
- PUT /:commentId Update Comment * 
- DELETE /:commentId Delete Comment *

#### User CRUD
- GET /users All user
- GET /users/signup Sign up form
- POST /users Register the user *
- GET /users/signin Sign in form
- POST /users/signin Sign the user in *
- GET /users/signout Sign out the user *
- GET /:userId Get user *
- GET /:userId/settings Edit user form
- PUT /:userId Update user *
- PATCH /:userId Follow/Unfollow a user *
- DELETE /:userId Delete a user *