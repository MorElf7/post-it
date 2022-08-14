import { Route } from "react-router-dom";

import ProfilePage from "../pages/user/profilePage";
import SettingPage from "../pages/user/settingPage/settingPage";
import SignInPage from "../pages/user/signInPage";
import SignUpPage from "../pages/user/signUpPage";

const userRoutes = (
	<>
		<Route path="users">
			<Route path="signup" element={<SignUpPage />} />
			<Route path="signin" element={<SignInPage />} />
		</Route>
		<Route path=":userId">
			<Route index element={<ProfilePage />} />
			<Route path="settings" element={<SettingPage />} />
		</Route>
	</>
);

export default userRoutes;
