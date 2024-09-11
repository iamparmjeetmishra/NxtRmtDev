import Background from "./Background";
import Container from "./Container";
import Footer from "./Footer";
import Header, { HeaderTop } from "./Header";
import Logo from "./Logo";
import BookmarksButton from "./BookmarksButton";
import SearchForm from "./SearchForm";
import Sidebar, { SidebarTop } from "./Sidebar";
import JobItemContent from "./JobItemContent";
import Pagination from "./PaginationControls";
import Sorting from "./SortingControls";
import ResultsCount from "./ResultsCount";
import { Toaster } from "react-hot-toast";
import JobListSearch from "./JobListSearch";

function App() {
	return (
		<>
			<Background />
			<Header>
				<HeaderTop>
					<Logo />
					<BookmarksButton />
				</HeaderTop>
				<SearchForm />
			</Header>

			<Container>
				<Sidebar>
					<SidebarTop>
						<ResultsCount />
						<Sorting />
					</SidebarTop>
					<JobListSearch />
					<Pagination	/>
				</Sidebar>
				<JobItemContent />
			</Container>
			<Footer />
			<Toaster position="top-right" />
		</>
	);
}

export default App;
