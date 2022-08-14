import { Route } from "react-router-dom";

import HomePage from "../pages/home/homePage";
import RecentPostPage from "../pages/home/recentPostsPage";
import SearchResultPage from "../pages/home/searchResult";

const homeRoutes = (
	<>
		<Route path="/" element={<HomePage />} />
		<Route path="posts" element={<RecentPostPage />} />
		<Route path="search" element={<SearchResultPage />} />
	</>
);

export default homeRoutes;
