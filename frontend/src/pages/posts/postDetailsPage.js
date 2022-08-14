import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import {
	Button,
	Card,
	Col,
	Container,
	Form,
	Image,
	ListGroup,
	Row,
	Spinner,
} from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useGetResponseNavigate, useGetSignedInUser } from "../../hooks";
import { commentSchema } from "../../schema";
import { updateFlashShow, updateFlashType } from "../../store/page/pageSlice";
import {
	createComment,
	deletePost,
	getPost,
	getPostData,
} from "../../store/post/postSlice";
import Comment from "./comment";
const initialState = { content: "" };

export default function PostDetailsPage(props) {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const post = useSelector(getPost);
	const { userId, postId } = useParams();
	const { isLoggedIn, currentUser } = useGetSignedInUser();
	const { response, canNavigate } = useGetResponseNavigate("post");
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(commentSchema),
		mode: "onSubmit",
		defaultValues: initialState,
	});
	const [canEditComment, setCanEditComment] = useState(false);
	const comments = post.comments;
	const [counter, setCounter] = useState(1);
	let displayComments = comments.slice(0, 10 * counter);

	const loadMore = (event) => {
		event.preventDefault();
		setCounter(counter + 1);
	};

	useEffect(() => {
		dispatch(getPostData({ userId, postId }));
	}, [dispatch]);

	useEffect(() => {
		if (response.status === 404) {
			dispatch(updateFlashShow(true));
			dispatch(updateFlashType("post"));
		}
		if (canNavigate && response.message === "Post deleted successfully") {
			navigate(`/${userId}`);
		}
	}, [canNavigate, response]);

	const goBack = (event) => {
		event.preventDefault();
		navigate(-1);
	};

	const handleDeletePost = async (event) => {
		event.preventDefault();
		dispatch(deletePost({ userId, postId }));
		dispatch(updateFlashShow(true));
		dispatch(updateFlashType("post"));
	};

	const handleSubmitComment = async (data) => {
		await dispatch(createComment({ userId, postId, comment: data }));
		dispatch(getPostData({ userId, postId }));
		reset();
	};

	let commentList = <></>;
	if (displayComments && displayComments.length > 0) {
		commentList = displayComments.map((comment) => (
			<Comment
				key={comment._id}
				comment={comment}
			/>
		));
	}

	return (
		<Container>
			<Row className="mt-3">
				<Col md={{ span: 8, offset: 2 }}>
					<Card bg="white" border="white" className="text-dark">
						<Card.Link className="mb-3 mx-5">
							<Button variant="white" size="lg" onClick={goBack}>
								<i className="fa-solid fa-arrow-left"></i>
							</Button>
						</Card.Link>
						<Card.Body className="mb-3 mx-5">
							<Card.Title>
								<h2>{post.title}</h2>
							</Card.Title>
						</Card.Body>
						{post.image?.mainThumbnail && (
							<div className="mb-3">
								<Image
									className="px-5"
									fluid={true}
									src={post.image.mainThumbnail}
								/>
							</div>
						)}
						<Card.Body className="mb-3 mx-5">
							<Card.Text>{post.description}</Card.Text>
						</Card.Body>
						<Card.Body className="mb-3 mx-5">
							{isLoggedIn && userId === currentUser._id && (
								<>
									<Button
										href={`/${userId}/posts/${postId}/edit`}
										className="me-2">
										Edit
									</Button>
									<Button
										type="submit"
										variant="danger"
										onClick={handleDeletePost}>
										Delete
									</Button>
								</>
							)}
						</Card.Body>
						<Card.Body>
							<Form
								className="mb-3"
								onSubmit={handleSubmit(handleSubmitComment)}>
								<Row className="justify-content-center">
									<Col md={9}>
										<Form.Control
											id="commentTextArea"
											as="textarea"
											{...register("content")}
											placeholder="Leave your comment here"
										/>
										{errors.content && (
											<Form.Text className="text-danger">
												{errors.content.message}
											</Form.Text>
										)}
									</Col>
									<Col md={3} className="align-self-center">
										<Button
											variant="outline-success"
											type="submit">
											Comment
										</Button>
									</Col>
								</Row>
							</Form>
							<ListGroup variant="flush">{commentList}</ListGroup>
							<Row className="mt-3 mb-3 justify-content-center">
								{comments.length > displayComments.length && (
									<Col md={{ span: 4 }}>
										<Button
											onClick={loadMore}
											variant="outline-dark"
											width="60%">
											Load More
										</Button>
									</Col>
								)}
							</Row>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	);
}
