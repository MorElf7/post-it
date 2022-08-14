import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useGetResponseNavigate, useGetSignedInUser } from "../../hooks";
import { postSchema } from "../../schema";
import { updateFlashShow, updateFlashType } from "../../store/page/pageSlice";
import { createPost } from "../../store/post/postSlice";

const initialState = {
	title: "",
	description: "",
};

export default function NewPostPage(props) {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(postSchema),
		mode: "onTouched",
		defaultValues: initialState,
	});
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [counter, setCounter] = useState(0);
	const { userId } = useParams();
	const { isLoggedIn, currentUser } = useGetSignedInUser();
	const { response, canNavigate } = useGetResponseNavigate("post");

	useEffect(() => {
		if (!isLoggedIn && counter > 0) {
			navigate("/users/signin");
		}
		if (isLoggedIn && userId !== currentUser._id) {
		}
		setCounter(counter + 1);
	}, [isLoggedIn]);

	useEffect(() => {
		if (canNavigate && response.message === "New post created") {
			navigate(`/${userId}`);
		}
	}, [response]);

	const onSubmit = (data) => {
		const formData = new FormData();
		formData.set("image", data.image[0]);
		formData.set("post", JSON.stringify(data.post));
		dispatch(createPost({ userId, formData }));
		dispatch(updateFlashShow(true));
		dispatch(updateFlashType("post"));
	};

	const handleCancel = (event) => {
		event.preventDefault();
		navigate(-1);
	};

	return (
		<Container>
			<Row className="mt-3">
				<Col md={{ span: 6, offset: 3 }}>
					<h3>New Post</h3>
					<Form onSubmit={handleSubmit(onSubmit)}>
						<Form.Group controlId="title" className="mb-3">
							<Form.Label>Title</Form.Label>
							<Form.Control
								type="text"
								{...register("post.title")}
							/>
							{errors.post?.title && (
								<Form.Text className="text-danger">
									{errors.post.title.message}
								</Form.Text>
							)}
						</Form.Group>
						<Form.Group controlId="image" className="mb-3">
							<Form.Label>Image</Form.Label>
							<Form.Control
								type="file"
								size="sm"
								{...register("image")}
							/>
							{errors.image && (
								<Form.Text className="text-danger">
									{errors.image.message}
								</Form.Text>
							)}
						</Form.Group>
						<Form.Group
							controlId="postDescription"
							className="mb-4">
							<Form.Label>Description</Form.Label>
							<Form.Control
								type="text"
								as="textarea"
								{...register("post.description")}
							/>
							{errors.post?.description && (
								<Form.Text className="text-danger">
									{errors.post.description.message}
								</Form.Text>
							)}
						</Form.Group>
						<div>
							<Button
								type="submit"
								className="me-2"
								variant="success">
								Post
							</Button>
							<Button
								onClick={handleCancel}
								type="button"
								variant="secondary">
								Cancel
							</Button>
						</div>
					</Form>
				</Col>
			</Row>
		</Container>
	);
}
