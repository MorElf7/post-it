import { yupResolver } from "@hookform/resolvers/yup";
import {
	Button,
	Col,
	Dropdown,
	DropdownButton,
	Form,
	ListGroup,
	Row,
} from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { useGetSignedInUser } from "../../hooks";
import { commentSchema } from "../../schema";
import {
	deleteComment,
	getPostData,
	updateComment,
} from "../../store/post/postSlice";
import TimeZoneConverter from "../../utils/timeZoneConverter";

export default function Comment(props) {
	const { comment, canEditComment, setCanEditComment } = props;
	const dispatch = useDispatch();
	const { userId, postId } = useParams();
	const {
		register,
		handleSubmit,
		formState: { error },
		setValue,
	} = useForm({
		resolver: yupResolver(commentSchema),
		mode: "onTouched",
		defaultValues: { content: comment.content },
	});
	const { isLoggedIn, currentUser } = useGetSignedInUser();
	if (!isLoggedIn) {
		return (
			<ListGroup.Item bg="white">
				<Row className="">
					<Col md={7}>
						<Link to={`/${comment.user._id}`}>
							<h5>{comment.user.username}</h5>
						</Link>
						<div className="text-start">{comment.content}</div>
					</Col>
					<Col className="text-muted mx-auto text-end">
						{TimeZoneConverter(comment.createdAt)}
					</Col>
				</Row>
			</ListGroup.Item>
		);
	}
	const handleDelete = async (event) => {
		event.preventDefault();
		await dispatch(
			deleteComment({ userId, postId, commentId: comment._id })
		);
		dispatch(getPostData({ userId, postId }));
	};
	const onSubmit = async (data) => {
		await dispatch(
			updateComment({
				userId,
				postId,
				commentId: comment._id,
				comment: data,
			})
		);
		setCanEditComment(false);
		dispatch(getPostData({ userId, postId }));
	};
	let content = <></>;
	if (canEditComment) {
		setValue("content", comment.content);
		content = (
			<Form onSubmit={handleSubmit(onSubmit)}>
				<Row>
					<Col md={10} className="text-start">
						<Form.Control
							as="textarea"
							id="editCommentTextArea"
							{...register("content")}
						/>
					</Col>
					<Col className="align-self-center">
						<Button type="submit" variant="outline-success">
							Edit
						</Button>
					</Col>
				</Row>
			</Form>
		);
	} else {
		content = <div className="text-start">{comment.content}</div>;
	}

	return (
		<ListGroup.Item bg="white">
			<Row className="">
				<Col md={10} className="text-start">
					<Link to={`/${comment.user._id}`}>
						<h5>{comment.user.username}</h5>
					</Link>
					{content}
				</Col>
				<Col className="text-muted text-end">
					{isLoggedIn && currentUser._id === comment.user._id && (
						<DropdownButton
							className="mb-2"
							variant="outline-primary"
							size="sm"
							drop="down"
							title={<i className="fa-solid fa-bars"></i>}>
							<Dropdown.Item
								onClick={() => setCanEditComment(true)}>
								Edit
							</Dropdown.Item>
							<Dropdown.Item onClick={handleDelete}>
								Delete
							</Dropdown.Item>
						</DropdownButton>
					)}
					{TimeZoneConverter(comment.createdAt)}
				</Col>
			</Row>
		</ListGroup.Item>
	);
}
