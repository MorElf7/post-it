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
import { Link } from "react-router-dom";

import { useGetSignedInUser } from "../../hooks";
import { getHomePage, getPagePosts } from "../../store/page/pageSlice";
import TimeZoneConverter from "../../utils/timeZoneConverter";

export default function HomePage() {
	const dispatch = useDispatch();
	const posts = useSelector(getPagePosts);
	const { isLoggedIn } = useGetSignedInUser();
	const [counter, setCounter] = useState(1);
	let displayPosts = posts?.slice(0, 25 * counter);

	const loadMore = (event) => {
		event.preventDefault();
		setCounter(counter + 1);
	};

	useEffect(() => {
		if (isLoggedIn) {
			dispatch(getHomePage());
		}
	}, [dispatch, isLoggedIn]);

	return (
		<>
			{isLoggedIn && (
				<SignedInHome posts={displayPosts} loadMore={loadMore} />
			)}
			{!isLoggedIn && <NotSignedInHome />}
		</>
	);
}

function SignedInHome(props) {
	const { posts, loadMore } = props;

	if (!posts || posts?.length <= 0) {
		return (
			<Container>
				<Col
					md={{ span: 6, offset: 3 }}
					className="justify-content-center">
					<Spinner animation="border" variant="dark" />
				</Col>
			</Container>
		);
	}

	const listItems = posts?.map((post) => (
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
				<Card.Body>{post.description}</Card.Body>
			</Card>
		</ListGroup.Item>
	));
	return (
		<Container fluid="md">
			<Col md={{ span: 6, offset: 3 }}>
				<ListGroup variant="flush">{listItems}</ListGroup>

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

function NotSignedInHome(props) {
	return (
		<Container className="my-auto">
			<Row className="align-items-center mb-5">
				<Col md={{ span: 6, offset: 4 }}>
					<h1>Join PostIt today</h1>
				</Col>
			</Row>
			<Row className="align-items-center mb-5">
				<Col md={{ span: 4, offset: 3 }}>
					<Card bg="white" border="white" text="dark">
						<Card.Body>
							<h2>Are you a user?</h2>
						</Card.Body>
					</Card>
				</Col>
				<Col md={5}>
					<Button
						size="lg"
						variant="primary"
						className="me-2"
						href="/users/signin">
						Sign In
					</Button>
				</Col>
			</Row>
			<Row className="align-items-center mb-5">
				<Col md={{ span: 4, offset: 3 }}>
					<Card bg="white" border="white" text="dark">
						<Card.Body>
							<h2>If not</h2>
						</Card.Body>
					</Card>
				</Col>
				<Col md={5}>
					<Button
						size="lg"
						variant="primary"
						className="me-2"
						href="/users/signup">
						Sign Up
					</Button>
				</Col>
			</Row>
		</Container>
	);
}
