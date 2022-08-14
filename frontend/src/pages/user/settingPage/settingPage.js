import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useMemo, useState } from "react";
import { Button, Col, Container, Form, Modal, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useGetResponseNavigate, useGetSignedInUser } from "../../../hooks";
import { userSchema } from "../../../schema";
import {
	updateFlashShow,
	updateFlashType,
	updatePageTitle,
} from "../../../store/page/pageSlice";
import { deleteUser, updateUser } from "../../../store/user/userSlice";
import ErrorPage from "../../errorPage";
import ChangePasswordPopup from "./changePasswordPopup";

export default function SettingPage(props) {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { userId } = useParams();
	const { isLoggedIn, currentUser } = useGetSignedInUser();
	const [deleteModalShow, setDeleteModalShow] = useState(false);
	const [updatePasswordModalShow, setUpdatePasswordModalShow] =
		useState(false);
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(userSchema),
		mode: "onTouched",
		defaultValues: useMemo(() => currentUser, [currentUser]),
	});
	const { executeNavigate, canNavigate } = useGetResponseNavigate("user");
	const [counter, setCounter] = useState(0);

	useEffect(() => {
		if (!isLoggedIn && counter > 0) {
			navigate("/users/signin");
		}
		setCounter(counter + 1);
	}, [isLoggedIn]);

	useEffect(() => {
		dispatch(updatePageTitle("Settings"));
	}, [dispatch]);

	useEffect(() => {
		if (canNavigate) {
			executeNavigate("/");
		}
	}, [canNavigate, executeNavigate]);

	useEffect(() => {
		setValue("user", {
			username: currentUser.username,
			email: currentUser.email,
			bio: currentUser.bio,
		});
	}, [currentUser, setValue]);

	function handleCancel(event) {
		event.preventDefault();
		navigate(`/${currentUser._id}`);
	}

	function handleDelete(event) {
		event.preventDefault();
		setDeleteModalShow(false);
		dispatch(deleteUser(userId));
		dispatch(updateFlashType("user"));
		dispatch(updateFlashShow(true));
	}

	function changePassword(event) {
		event.preventDefault();
		setUpdatePasswordModalShow(true);
	}

	function onSubmit(data) {
		var formData = new FormData();
		formData.append("user", JSON.stringify(data.user));
		formData.append("avatar", data.avatar[0]);
		dispatch(
			updateUser({
				id: currentUser._id,
				formData,
			})
		);
		dispatch(updateFlashType("user"));
		dispatch(updateFlashShow(true));
	}

	if (isLoggedIn && currentUser._id !== userId) {
		return <ErrorPage status={403} message={"Forbidden Action"} />;
	} else {
		return (
			<Container>
				<Row className="mb-3">
					<Col md={{ span: 6, offset: 3 }} className="text-center">
						<h3>Account Settings</h3>
					</Col>
				</Row>
				<Row className="mb-3">
					<Col md={{ span: 6, offset: 3 }}>
						<Form onSubmit={handleSubmit(onSubmit)}>
							<Form.Group className="mb-3" controlId="username">
								<Form.Label>Username</Form.Label>
								<Form.Control
									type="text"
									{...register("user.username")}
								/>
								{errors.user?.username && (
									<Form.Text className="text-danger">
										{errors.user.username.message}
									</Form.Text>
								)}
							</Form.Group>
							<Form.Group
								className="mb-3"
								controlId="changePassword">
								<Form.Label className="pe-3">
									Password
								</Form.Label>
								<Button
									variant="outline-primary"
									size="sm"
									onClick={changePassword}>
									Change Password
								</Button>
							</Form.Group>

							<Form.Group className="mb-3" controlId="email">
								<Form.Label>Email</Form.Label>
								<Form.Control
									type="email"
									{...register("user.email")}
								/>
								{errors.user?.email && (
									<Form.Text className="text-danger">
										{errors.user.email.message}
									</Form.Text>
								)}
							</Form.Group>
							<Form.Group className="mb-3" controlId="avatar">
								<Form.Label>Avatar</Form.Label>
								<Form.Control
									size="sm"
									type="file"
									{...register("avatar")}
								/>
								{errors.avatar && (
									<Form.Text className="text-danger">
										{errors.avatar.message}
									</Form.Text>
								)}
							</Form.Group>
							<Form.Group className="mb-3" controlId="userBio">
								<Form.Label>Bio</Form.Label>
								<Form.Control
									as="textarea"
									{...register("user.bio")}
								/>
								{errors.user?.bio && (
									<Form.Text className="text-danger">
										{errors.user.bio.message}
									</Form.Text>
								)}
							</Form.Group>
							<div>
								<Button
									type="submit"
									className="me-2"
									variant="success">
									Save
								</Button>
								<Button
									onClick={handleCancel}
									type="button"
									variant="secondary">
									Cancel
								</Button>
							</div>
						</Form>
						<ChangePasswordPopup
							updatePasswordModalShow={updatePasswordModalShow}
							setUpdatePasswordModalShow={
								setUpdatePasswordModalShow
							}
							id={userId}
						/>
						<Button
							variant="danger"
							className="mb-3 mt-3"
							onClick={() => {
								setDeleteModalShow(true);
							}}>
							Delete
						</Button>
						<Modal
							show={deleteModalShow}
							onHide={() => setDeleteModalShow(false)}
							centered={true}>
							<Modal.Header closeButton />
							<Modal.Body>
								Do you want to delete your account?
							</Modal.Body>
							<Modal.Footer>
								<Button
									variant="danger"
									className="mx-2"
									onClick={handleDelete}>
									Yes
								</Button>
								<Button
									variant="secondary"
									onClick={() => setDeleteModalShow(false)}>
									No
								</Button>
							</Modal.Footer>
						</Modal>
					</Col>
				</Row>
			</Container>
		);
	}
}
