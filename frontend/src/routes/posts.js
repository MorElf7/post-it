import { Route } from "react-router-dom";

import EditPostPage from "../pages/posts/editPostPage";
import NewPostPage from "../pages/posts/newPostPage";
import PostDetailsPage from "../pages/posts/postDetailsPage";

const postRoutes = (
	<>
		<Route path="/:userId/posts">
			<Route path="new" element={<NewPostPage />} />
			<Route path=":postId" element={<PostDetailsPage />} />
			<Route path=":postId/edit" element={<EditPostPage />} />
		</Route>
	</>
);

export default postRoutes;
