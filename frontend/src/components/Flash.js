import React, { useEffect, useState } from "react";

import { Alert, Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
	getFlashPage,
	getFlashShow,
	getFlashType,
	updateFlashShow,
	updateFlashType,
} from "../store/page/pageSlice";
import { getFlashUser } from "../store/user/userSlice";
import { getFlashPost } from "../store/post/postSlice";

export default function Flash() {
	const dispatch = useDispatch();
	const show = useSelector(getFlashShow);
	const type = useSelector(getFlashType);
	const flashUser = useSelector(getFlashUser);
	const flashPage = useSelector(getFlashPage);
	const flashPost = useSelector(getFlashPost);
	const [flash, setFlash] = useState({ flash: "", flashMessage: "" });
	const [alert, setAlert] = useState(<></>);

	useEffect(() => {
		if (type === "user") {
			if (flashUser.flash !== "" && flashUser.flashMessage !== "") {
				setFlash(flashUser);
			}
		}
		if (type === "page") {
			if (flashPage.flash !== "" && flashPage.flashMessage !== "") {
				setFlash(flashPage);
			}
		}
		if (type === "post") {
			if (flashPost.flash !== "" && flashPost.flashMessage !== "") {
				setFlash(flashPost);
			}
		}
	}, [flashUser, flashPage, flashPost, type]);

	useEffect(() => {
		if (show && flash.flash === "success") {
			setAlert(
				<Alert
					variant="success"
					dismissible
					className="mb-3"
					onClose={() => {
						dispatch(updateFlashShow(false));
						dispatch(updateFlashType(""));
					}}>
					{flash.flashMessage}
				</Alert>
			);
		} else if (show && flash.flash === "error") {
			setAlert(
				<Alert
					variant="danger"
					dismissible
					className="mb-3"
					onClose={() => {
						dispatch(updateFlashShow(false));
						dispatch(updateFlashType(""));
					}}>
					{flash.flashMessage}
				</Alert>
			);
		} else {
			setAlert(<></>);
		}
	}, [show, flash]);

	return (
		<Container className="">
			<Row className="mt-3">
				<Col md={{ span: 4, offset: 4 }}>{alert}</Col>
			</Row>
		</Container>
	);
}
