import { useEffect, useState } from "react";
import {
	Button,
	Card,
	Col,
	Container,
	Image,
	ListGroup,
	Row,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useGetResponseNavigate, useGetSignedInUser } from "../../hooks";
import { getPageUser, getUserData } from "../../store/page/pageSlice";
import { followUser } from "../../store/user/userSlice";
import TimeZoneConverter from "../../utils/timeZoneConverter";
import ErrorPage from "../errorPage";

export default function ProfilePage(props) {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { userId } = useParams();
	const [followBtn, setFollowBtn] = useState(<></>);
	const user = useSelector(getPageUser);
	const { isLoggedIn, currentUser, reset } = useGetSignedInUser();
	const { response } = useGetResponseNavigate("page");
	const [counter, setCounter] = useState(1);
	const posts = user.posts;
	let displayPosts = posts.slice(0, 10 * counter);

	const loadMore = (event) => {
		event.preventDefault();
		setCounter(counter + 1);
	};

	function follow(event) {
		event.preventDefault();
		dispatch(followUser({ id: currentUser._id, follow: userId }));
		setFollowBtn(
			<Button variant="outline-secondary" onClick={unfollow}>
				Unfollow
			</Button>
		);
		reset();
	}

	function unfollow(event) {
		event.preventDefault();
		dispatch(followUser({ id: currentUser._id, unfollow: userId }));
		setFollowBtn(
			<Button variant="outline-primary" onClick={follow}>
				Follow
			</Button>
		);
		reset();
	}

	useEffect(() => {
		dispatch(getUserData(userId));
	}, [dispatch]);

	useEffect(() => {
		if (isLoggedIn) {
			if (currentUser._id !== "" && currentUser._id !== userId) {
				if (!currentUser.follows.includes(userId)) {
					setFollowBtn(
						<Button variant="outline-primary" onClick={follow}>
							Follow
						</Button>
					);
				} else {
					setFollowBtn(
						<Button variant="outline-secondary" onClick={unfollow}>
							Unfollow
						</Button>
					);
				}
			} else {
				setFollowBtn(<></>);
			}
		} else {
			setFollowBtn(<></>);
		}
	}, [currentUser]);

	let postsList = <></>;
	if (posts.length > 0) {
		postsList = displayPosts.map((post) => (
			<ListGroup.Item key={post._id} bg="white">
				<Card className="w-100" border="white">
					<Card.Body>
						<Card.Title>
							<Link to={`/${userId}/posts/${post._id}`}>
								<h5>{post.title}</h5>
							</Link>
						</Card.Title>
						<Card.Subtitle className="text-muted">
							<Row>
								<Col className="text-start">
									{TimeZoneConverter(post.createdAt)}
								</Col>
							</Row>
						</Card.Subtitle>
					</Card.Body>
					{post.image?.thumbnail && (
						<div className="mb-3">
							<Image
								fluid={true}
								className="px-5"
								src={post.image.thumbnail}
							/>
						</div>
					)}
					<Card.Body>{post.description}</Card.Body>
				</Card>
			</ListGroup.Item>
		));
	}

	function goBack(event) {
		event.preventDefault();
		navigate(-1);
	}
	if (response.status === 0) {
		return <>{/* <Loading /> */}</>;
	} else if (response.status !== 200) {
		return (
			<ErrorPage status={response.status} message={response.message} />
		);
	} else {
		return (
			<Container>
				<Row className="mt-3">
					<Col md={{ span: 8, offset: 2 }}>
						<Card
							bg="white"
							border="white"
							className="text-dark mb-3">
							<Card.Body>
								<Card.Link className="mb-3 mx-5">
									<Button
										variant="white"
										size="lg"
										onClick={goBack}>
										<i className="fa-solid fa-arrow-left"></i>
									</Button>
								</Card.Link>
								<Card.Title className="mt-3 mb-3 mx-5">
									{user.avatar?.thumbnail && (
										<Row>
											<Col md={3}>
												<Image
													roundedCircle={true}
													className="mx-auto"
													src={user.avatar.thumbnail}
												/>
											</Col>
										</Row>
									)}
									<Row>
										<Col md={9}>
											<h2>{user.username}</h2>
										</Col>
										<Col
											md="auto"
											className="justify-content-end">
											{followBtn}
										</Col>
									</Row>
								</Card.Title>
								<Card.Subtitle className="mb-3 mx-5">
									<h5>Bio</h5>
									<div> {user.bio} </div>
								</Card.Subtitle>
							</Card.Body>
							<div className="mb-3 mx-5">
								<hr />
								<h5>Posts by {user.username}</h5>
								<ListGroup variant="flush">
									{posts.length > 0 && postsList}
								</ListGroup>
								<Row className="mb-3 justify-content-center">
									<Col md={{ span: 4, offset: 3 }}>
										<Button
											onClick={loadMore}
											variant="outline-dark"
											width="60%">
											Load More
										</Button>
									</Col>
								</Row>
							</div>
						</Card>
					</Col>
				</Row>
			</Container>
		);
	}
}
