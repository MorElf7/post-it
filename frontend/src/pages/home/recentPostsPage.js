import { useEffect, useState } from "react";
import {
	Button,
	Card,
	Col,
	Container,
	ListGroup,
	Row,
	Spinner,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { getPagePosts, getRecentPosts } from "../../store/page/pageSlice";
import TimeZoneConverter from "../../utils/timeZoneConverter";

export default function RecentPostsPage(props) {
	const dispatch = useDispatch();
	const posts = useSelector(getPagePosts);
	const navigate = useNavigate();
	const [counter, setCounter] = useState(1);
	let displayPosts = posts?.slice(0, 25 * counter);

	useEffect(() => {
		dispatch(getRecentPosts());
	}, [dispatch]);

	function goBack(event) {
		event.preventDefault();
		navigate(-1);
	}
	const loadMore = (event) => {
		event.preventDefault();
		setCounter(counter + 1);
	};

	if (posts && posts.length <= 0) {
		return (
			<Container>
				<Col
					md={{ span: 6, offset: 3 }}
					className="justify-content-center">
					<div className="mb-3">
						<Button variant="white" size="lg" onClick={goBack}>
							<i className="fa-solid fa-arrow-left"></i>
						</Button>
					</div>
					<Spinner animation="border" variant="dark" />
				</Col>
			</Container>
		);
	}
	let postsList = <></>;
	if (displayPosts && displayPosts.length > 0) {
		postsList = displayPosts.map((post) => (
			<ListGroup.Item key={post._id}>
				<Card className="mx-3" border="white">
					<Card.Body>
						<Card.Title>
							<Link to={`/${post.user._id}/posts/${post._id}`}>
								<h4>{post.title}</h4>
							</Link>
						</Card.Title>
						<Card.Subtitle className="text-muted">
							<Row>
								<Col className="text-start">
									<Link to={`/${post.user._id}`}>
										Posted by {post.user.username}
									</Link>
								</Col>
								<Col className="text-end">
									{TimeZoneConverter(post.createdAt)}
								</Col>
							</Row>
						</Card.Subtitle>
					</Card.Body>
					{post.image && (
						<div className="mb-3">
							<Card.Image
								className="px-5"
								src={post.image.thumbnail}
								alt=""
							/>
						</div>
					)}
					<Card.Body>{post.description}</Card.Body>
				</Card>
			</ListGroup.Item>
		));
	}

	return (
		<Container>
			<Col md={{ span: 6, offset: 3 }}>
				<div className="mb-3 ms-4">
					<Button variant="white" size="lg" onClick={goBack}>
						<i className="fa-solid fa-arrow-left"></i>
					</Button>
				</div>
				<ListGroup variant="flush">{postsList}</ListGroup>
				<Row className="mt-3 mb-3 justify-content-center">
					<Col md={{ span: 4, offset: 3 }}>
						<Button
							onClick={loadMore}
							variant="outline-dark"
							width="60%">
							Load More
						</Button>
					</Col>
				</Row>
			</Col>
		</Container>
	);
}
