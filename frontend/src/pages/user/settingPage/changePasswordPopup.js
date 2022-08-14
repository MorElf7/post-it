import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { changePasswordSchema } from "../../../schema";
import { updateFlashShow, updateFlashType } from "../../../store/page/pageSlice";
import { updatePassword } from "../../../store/user/userSlice";

const initialState = {
	oldPassword: "",
	newPassword: "",
	confirmPassword: "",
};

const ChangePasswordPopup = (props) => {
	const { updatePasswordModalShow, setUpdatePasswordModalShow, id } = props;
	const dispatch = useDispatch();
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(changePasswordSchema),
		mode: "onTouched",
		defaultValues: initialState,
	});

	const onSubmit = (data) => {
		dispatch(updatePassword({ id, body: data }));
		handleClose();
		dispatch(updateFlashType("user"));
		dispatch(updateFlashShow(true));
	};

	const handleClose = () => {
		setUpdatePasswordModalShow(false);
		reset();
	};

	return (
		<Modal
			show={updatePasswordModalShow}
			onHide={() => setUpdatePasswordModalShow(false)}
			backdrop="static"
			centered={true}>
			<Form onSubmit={handleSubmit(onSubmit)}>
				<Modal.Header>
					<h4>Change Password</h4>
				</Modal.Header>
				<Modal.Body>
					<Form.Control
						className="mt-2 mb-3"
						type="password"
						placeholder="Current password"
						{...register("oldPassword")}
					/>
					{errors.oldPassword && (
						<Form.Text className="text-danger">
							{errors.oldPassword.message}
						</Form.Text>
					)}
					<Form.Control
						className="mb-3"
						type="password"
						placeholder="New password"
						{...register("newPassword")}
					/>
					{errors.newPassword && (
						<Form.Text className="text-danger">
							{errors.newPassword.message}
						</Form.Text>
					)}
					<Form.Control
						className="mb-2"
						type="password"
						placeholder="Confirm password"
						{...register("confirmPassword")}
					/>
					{errors.confirmPassword && (
						<Form.Text className="text-danger">
							{errors.confirmPassword.message}
						</Form.Text>
					)}
				</Modal.Body>
				<Modal.Footer>
					<Button type="submit" variant="primary" className="mx-2">
						Update
					</Button>
					<Button variant="secondary" onClick={handleClose}>
						Cancel
					</Button>
				</Modal.Footer>
			</Form>
		</Modal>
	);
};

export default ChangePasswordPopup;
