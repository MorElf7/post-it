import { Alert, Col } from "react-bootstrap";
export default function ErrorPage(props) {
	const { status, message } = props;

	return (
		<Col md={{ span: 6, offset: 3 }}>
			<Alert variant="danger" className="mb-3 mt-3">
				<Alert.Heading>{status + " " + message}</Alert.Heading>
			</Alert>
		</Col>
	);
}
