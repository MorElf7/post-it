import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import {
	Button,
	Card,
	Col,
	Container,
	FloatingLabel,
	Form,
	Row,
} from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useGetResponseNavigate, useGetSignedInUser } from "../../hooks";
import { signUpSchema } from "../../schema";
import {
	updateFlashShow,
	updateFlashType,
	updatePageTitle,
} from "../../store/page/pageSlice";
import { getRedirectUser, signUp } from "../../store/user/userSlice";

const initialState = {
	username: "",
	email: "",
	password: "",
	confirmPassword: "",
};
export default function SignUpPage() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(signUpSchema),
		mode: "onTouched",
		defaultValues: initialState,
	});
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { canNavigate } = useGetResponseNavigate("user");
	const { isLoggedIn } = useGetSignedInUser();
	const redirectUrl = useSelector(getRedirectUser);

	useEffect(() => {
		if (isLoggedIn) {
			navigate("/");
		}
	}, [isLoggedIn]);

	useEffect(() => {
		dispatch(updatePageTitle("Sign Up"));
	}, [dispatch]);

	useEffect(() => {
		if (canNavigate) {
			navigate(redirectUrl);
		}
	}, [canNavigate]);

	function handleCancel(event) {
		event.preventDefault();
		navigate("/");
	}

	async function onSubmit(data) {
		dispatch(signUp(data));
		dispatch(updateFlashType("user"));
		dispatch(updateFlashShow(true));
	}

	return (
		<Container fluid="md">
			<Row className="mt-3">
				<Col md={{ span: 4, offset: 4 }}>
					<Card border="success" className="px-3 py-3">
						<Card.Title className="mb-3 text-center">
							<h2>Sign Up</h2>
						</Card.Title>

						<Card.Body className="">
							<Form onSubmit={handleSubmit(onSubmit)}>
								<FloatingLabel
									className="mb-3"
									label="Username">
									<Form.Control
										className=""
										type="text"
										{...register("username")}
										placeholder="Username"
									/>
									{errors.username && (
										<Form.Text className="text-danger">
											{errors.username.message}
										</Form.Text>
									)}
								</FloatingLabel>
								<FloatingLabel className="mb-3" label="Email">
									<Form.Control
										className=""
										type="email"
										{...register("email")}
										placeholder="Email"
									/>
									{errors.email && (
										<Form.Text className="text-danger">
											{errors.email.message}
										</Form.Text>
									)}
								</FloatingLabel>
								<FloatingLabel
									className="mb-3"
									label="Password">
									<Form.Control
										className=""
										{...register("password")}
										type="password"
										placeholder="Password"
									/>
									{errors.password && (
										<Form.Text className="text-danger">
											{errors.password.message}
										</Form.Text>
									)}
								</FloatingLabel>
								<FloatingLabel
									className="mb-4"
									label="Confirm Password">
									<Form.Control
										className=""
										{...register("confirmPassword")}
										type="password"
										placeholder="Confirm password"
									/>
									{errors.confirmPassword && (
										<Form.Text className="text-danger">
											{errors.confirmPassword.message}
										</Form.Text>
									)}
								</FloatingLabel>
								<div>
									<Button
										type="submit"
										className="me-2"
										variant="success">
										Join
									</Button>
									<Button
										onClick={handleCancel}
										type="button"
										variant="secondary">
										Cancel
									</Button>
								</div>
							</Form>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	);
}
