import { useJobItemsContext } from "../lib/hooks";
import { TSortBy } from "../lib/type";



export default function Sorting() {

	const { sortBy, handleChangeSortBy } = useJobItemsContext()

	return (
		<section className="sorting">
			<i className="fa-solid fa-arrow-down-short-wide"></i>

			<SortingButton
				onClick={() => handleChangeSortBy("relevant")}
				sortBy={"relevant"}
				isActive={sortBy === "relevant"}
			/>
			<SortingButton
				onClick={() => handleChangeSortBy("recent")}
				sortBy={"recent"}
				isActive={sortBy === "recent"}
			/>
		</section>
	);
}

type TSortingButtonProps = {
	onClick: () => void;
	sortBy: TSortBy;
	isActive: boolean;
};

function SortingButton({
	onClick,
	sortBy,
	isActive,
}: TSortingButtonProps) {
	return (
		<button
			onClick={onClick}
			className={`sorting__button sorting__button--recent 
				${isActive && " sorting__button--active"}
				`}
		>
			{sortBy === "relevant" ? "relevant" : "recent"}
		</button>
	);
}
