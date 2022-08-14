import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Flash from "./components/Flash";
import Footer from "./components/Footer";
import NavigationBar from "./components/Navbar";
import { getPageTitle } from "./store/page/pageSlice";

function App() {
	const pageTitle = useSelector(getPageTitle);

	useEffect(() => {
		document.title = pageTitle;
	}, [pageTitle]);

	return (
		<div className="d-sm-flex flex-column vh-100">
			<NavigationBar />
			<Flash />
			<Outlet />
			<Footer />
		</div>
	);
}

export default App;
