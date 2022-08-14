import { Button, Container, Form, Nav, Navbar } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import { useGetSignedInUser } from "../hooks";
import { updateFlashShow, updateFlashType } from "../store/page/pageSlice";
import { logOut } from "../store/user/userSlice";

export default function NavigationBar() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();
	const { isLoggedIn, currentUser } = useGetSignedInUser();

	let rightSideNotLoggedIn = (
		<Nav className="ms-auto">
			<Button
				href="/users/signup"
				className="me-2"
				variant="outline-primary">
				Sign Up
			</Button>
			<Button
				href="/users/signin"
				className="me-2"
				variant="outline-primary">
				Sign In
			</Button>
			<Form className="d-flex ">
				<Form.Control
					className="me-2"
					type="search"
					placeholder="Search"
					aria-label="Search"
					name="name"
				/>
				<Button variant="outline-success" type="submit">
					Search
				</Button>
			</Form>
		</Nav>
	);
	const handleLogOut = (event) => {
		dispatch(logOut());
		dispatch(updateFlashShow(true));
		dispatch(updateFlashType("user"));
		if (location.pathname === "/") {
			navigate(0);
		} else {
			navigate("/");
		}
	};
	let rightSideLoggedIn = (
		<Nav className="ms-auto">
			<Nav.Link className="" href={`/${currentUser?._id}`}>
				{currentUser?.username}
			</Nav.Link>
			<Nav.Link className="" href={`/${currentUser?._id}/settings`}>
				Account settings
			</Nav.Link>
			<Nav.Link href="/#" onClick={handleLogOut}>
				Sign Out
			</Nav.Link>
			<Form className="d-flex">
				<Form.Control
					className="me-2"
					type="text"
					placeholder="Search"
					aria-label="Search"
					name="name"
				/>
				<Button variant="outline-success" type="submit">
					Search
				</Button>
			</Form>
		</Nav>
	);

	return (
		<Navbar
			className="mb-3"
			sticky="top"
			expand="md"
			variant="dark"
			bg="dark">
			<Container fluid="md">
				<Navbar.Brand className="" href="/">
					PostIt
				</Navbar.Brand>
				<Navbar.Toggle
					as="button"
					className=""
					type="Button"
					data-bs-toggle="collapse"
					data-bs-target="#navbarNavAltMarkup"
					aria-controls="navbarNavAltMarkup"
					aria-expanded="false"
					aria-label="Toggle navigation">
					<span className="navbar-toggler-icon"></span>
				</Navbar.Toggle>
				<Navbar.Collapse id="navbarNavAltMarkup">
					<Nav className="">
						<Nav.Link className="" aria-current="page" href="/">
							Home
						</Nav.Link>
						<Nav.Link className="" href="/posts">
							Recent Posts
						</Nav.Link>
						{isLoggedIn && (
							<Nav.Link
								className=""
								href={`/${currentUser?._id}/posts/new`}>
								New Post
							</Nav.Link>
						)}
					</Nav>

					{isLoggedIn && rightSideLoggedIn}
					{!isLoggedIn && rightSideNotLoggedIn}
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}
