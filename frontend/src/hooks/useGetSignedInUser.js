import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser, getUser } from "../store/user/userSlice";

export default function useGetSignedInUser() {
	const [rerender, setRerender] = useState(false);
	const checkSession = Cookies.get("checkSession");
	const dispatch = useDispatch();
	const user = useSelector(getUser);
	const [loggedIn, setLoggedIn] = useState(false);
	useEffect(() => {
		if (checkSession == "true") {
			dispatch(getCurrentUser());
			setLoggedIn(true);
		} else {
			setLoggedIn(false);
		}
		return () => {
			setLoggedIn(false);
		};
	}, [dispatch, checkSession]);

	const reset = () => {
		setRerender(!rerender);
	};

	return { isLoggedIn: loggedIn, currentUser: user, reset };
}
