import { useState } from "react";
import {
	Button,
	Card,
	Col,
	Container,
	Image,
	ListGroup,
	Row,
	Spinner,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { useGetResponseNavigate } from "../../hooks";
import { getResult } from "../../store/page/pageSlice";
import TimeZoneConverter from "../../utils/timeZoneConverter";

export default function SearchResultPage(props) {
	const navigate = useNavigate();
	const results = useSelector(getResult);
	const [counter, setCounter] = useState(1);
	let displayResults = results?.slice(0, 15 * counter);
	const { response } = useGetResponseNavigate("page");

	function goBack(event) {
		event.preventDefault();
		navigate(-1);
	}
	const loadMore = (event) => {
		event.preventDefault();
		setCounter(counter + 1);
	};

	if (response.status === 0) {
		navigate("/");
	}

	if (!results || results.length <= 0) {
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

	let resultList = <></>;
	if (displayResults && displayResults.length > 0) {
		resultList = displayResults.map((element) => {
			if (element.title) {
				return <PostCard key={element._id} post={element} />;
			} else {
				return <UserCard key={element._id} user={element} />;
			}
		});
	}

	return (
		<Container>
			<Col md={{ span: 6, offset: 3 }}>
				<div className="mb-3 ms-4">
					<Button variant="white" size="lg" onClick={goBack}>
						<i className="fa-solid fa-arrow-left"></i>
					</Button>
					<h2>Search Results</h2>
				</div>
				<ListGroup variant="flush">{resultList}</ListGroup>

				<Row className="mt-3 mb-3 justify-content-center">
					<Col md={{ span: 3 }}>
						<Button
							onClick={loadMore}
							variant="outline-dark"
							width="100%">
							Load More
						</Button>
					</Col>
				</Row>
			</Col>
		</Container>
	);
}

const UserCard = (props) => {
	const { user } = props;
	return (
		<Card className="mx-3" border="white">
			<Card.Body>
				<Card.Title>
					{user.avatar?.smallAvatar && (
						<div className="mb-3">
							<Image
								roundedCircle={true}
								className="ps-2"
								src={user.avatar.smallAvatar}
								alt=""
							/>
						</div>
					)}
					<Link to={`/${user._id}`}>
						<h4>{user.username}</h4>
					</Link>
				</Card.Title>
			</Card.Body>
			<Card.Body>{user.bio}</Card.Body>
		</Card>
	);
};

const PostCard = (props) => {
	const { post } = props;
	return (
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
			{post.image?.listThumbnail && (
				<div className="mb-3">
					<Image
						className="ps-2"
						src={post.image.listThumbnail}
						alt=""
					/>
				</div>
			)}
			<Card.Body>{post.description}</Card.Body>
		</Card>
	);
};
