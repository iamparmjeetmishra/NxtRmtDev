import { createContext, useCallback, useMemo, useState } from "react";
import { useSearchQuery, useSearchTextContext } from "../lib/hooks";
import { TJobItem, TPageDirection, TSortBy } from "../lib/type";
import { RESULTS_PER_PAGE } from "../lib/constants";

type TJobItemsContext = {
	jobItems: TJobItem[] | undefined;
	jobItemsSortedAndSliced: TJobItem[];
	isLoading: boolean;
	totalNumberOfPages: number;
	totalNumberOfResults: number;
	currentPage: number;
	sortBy: TSortBy;
	handleChangePage: (direction: TPageDirection) => void;
	handleChangeSortBy: (newSortBy: TSortBy) => void;
};

export const JobItemsContext = createContext<TJobItemsContext | null>(
	null
);

export default function JobItemsContextProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const { debouncedSearchText } = useSearchTextContext();
	const [currentPage, setCurrentPage] = useState(1);
	const { jobItems, isLoading } = useSearchQuery(debouncedSearchText);
	const [sortBy, setSortBy] = useState<TSortBy>("relevant");

	// derived
	const totalNumberOfResults = jobItems?.length || 0;
	const totalNumberOfPages = totalNumberOfResults / RESULTS_PER_PAGE;
	const jobItemsSorted = useMemo(
		() =>
			[...(jobItems || [])].sort((a, b) => {
				if (sortBy === "relevant") {
					return b.relevanceScore - a.relevanceScore;
				} else {
					return a.daysAgo - b.daysAgo;
				}
			}) || [],
		[jobItems, sortBy]
	);
	const jobItemsSortedAndSliced = useMemo(
		() =>
			jobItemsSorted?.slice(
				currentPage * RESULTS_PER_PAGE - RESULTS_PER_PAGE,
				currentPage * RESULTS_PER_PAGE
			),
		[currentPage, jobItemsSorted]
	);

	// event

	// here we use useCallback same as useMemo but for function
	const handleChangePage = useCallback(
		(direction: TPageDirection) => {
			if (direction === "next") {
				setCurrentPage((prev) => prev + 1);
			} else if (direction === "previous") {
				setCurrentPage((prev) => prev - 1);
			}
		},
		[]
	);

	const handleChangeSortBy = useCallback((newSortBy: TSortBy) => {
		setCurrentPage(1);
		setSortBy(newSortBy);
	}, []);

	const contextValue = useMemo(
		() => ({
			jobItems,
			jobItemsSortedAndSliced,
			isLoading,
			totalNumberOfPages,
			totalNumberOfResults,
			currentPage,
			sortBy,
			handleChangePage,
			handleChangeSortBy,
		}),
		[
			jobItems,
			jobItemsSortedAndSliced,
			isLoading,
			totalNumberOfPages,
			totalNumberOfResults,
			currentPage,
			sortBy,
			handleChangePage,
			handleChangeSortBy,
		]
	);

	return (
		<JobItemsContext.Provider value={contextValue}>
			{children}
		</JobItemsContext.Provider>
	);
}
