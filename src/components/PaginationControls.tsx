import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import { TPageDirection } from "../lib/type";
import { useJobItemsContext } from "../lib/hooks";


export default function Pagination() {
	const {currentPage, totalNumberOfPages, handleChangePage } = useJobItemsContext()
	return (
		<section className="pagination">
			{currentPage > 1 && (
				<PaginationButton
					direction="previous"
					currentPage={currentPage}
					onClick={() => handleChangePage("previous")}
				/>
			)}
			{currentPage < totalNumberOfPages && (
				<PaginationButton
					direction="next"
					currentPage={currentPage}
					onClick={() => handleChangePage("next")}
				/>
			)}
		</section>
	);
}

type TPaginationButtonProps = {
	direction: TPageDirection;
	onClick: () => void;
	currentPage: number;
};

function PaginationButton({
	direction,
	onClick,
	currentPage,
}: TPaginationButtonProps) {
	return (
		<button
      onClick={(e) => {
        onClick();
        e.currentTarget.blur();
      }}
			className={`pagination__button pagination__button--${direction}`}
		>
			{direction === "previous" && (
				<>
					<ArrowLeftIcon /> Page {currentPage - 1}
				</>
			)}
			{direction === "next" && (
				<>
					Page {currentPage + 1} <ArrowRightIcon />
				</>
			)}
		</button>
	);
}
