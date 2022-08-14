import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "../App";

import HomeRouter from "./home";
import PostRouter from "./posts";
import UserRouter from "./user";

const Router = (
	<BrowserRouter>
		<Routes>
			<Route path="/" element={<App />}>
				{HomeRouter}
				{UserRouter}
				{PostRouter}
			</Route>
		</Routes>
	</BrowserRouter>
);

export default Router;
