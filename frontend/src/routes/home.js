import { Route, Routes } from "react-router-dom";

import HomePage from "../pages/home/homePage";
import RecentPostPage from "../pages/home/recentPostsPage";

const homeRoutes = (
	<>
		<Route path="/" element={<HomePage />} />
		<Route path="posts" element={<RecentPostPage />} />
	</>
);

export default homeRoutes;
