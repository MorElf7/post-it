import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getResponseStatusPage } from "../store/page/pageSlice";
import { getResponseStatusPost } from "../store/post/postSlice";
import { getResponseStatusUser } from "../store/user/userSlice";

export default function useGetResponseNavigate(type) {
	const initialState = { status: 0, message: "" };
	const [response, setResponse] = useState(initialState);
	const responseUser = useSelector(getResponseStatusUser);
	const responsePage = useSelector(getResponseStatusPage);
	const responsePost = useSelector(getResponseStatusPost);

	useEffect(() => {
		switch (type) {
			case "user":
				setResponse(responseUser);
				break;
			case "page":
				setResponse(responsePage);
				break;
			case "post":
				setResponse(responsePost);
				break;
			default:
				break;
		}

		return () => {
			setResponse(initialState);
		};
	}, [responseUser, responsePage, responsePost]);

	let canNavigate = false;
	if (200 <= response.status && response.status < 300) {
		canNavigate = true;
	} else {
		canNavigate = false;
	}
	return { response, canNavigate };
}
