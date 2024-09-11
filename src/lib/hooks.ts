import { useContext, useEffect, useState } from "react";
import { TJobItem, TJobItemData } from "./type";
import { BASE_API_URL } from "./constants";
import { useQueries, useQuery } from "@tanstack/react-query";
import { handleError } from "./utils";
import { BookmarksContext } from "../contexts/BookmarksContextProvider";
import { ActiveIdContext } from "../contexts/ActiveIdContextProvider";
import { SearchTextContext } from "../contexts/SearchTextContextProvider";
import { JobItemsContext } from "../contexts/JobItemsContextProvider";

/* -----------------------------*/
// export function useJobItems(searchText: string) {
// 	const [jobItems, setJobItems] = useState<TJobItem[]>([]);
// 	const [isLoading, setIsLoading] = useState(false);

// 	useEffect(() => {
// 		if (!searchText) return;

// 		const fetchJobs = async () => {
// 			setIsLoading(true);
// 			try {
// 				const res = await fetch(
// 					`${BASE_API_URL}?search=${searchText}`
// 				);
// 				const data = await res.json();
// 				setIsLoading(false);
// 				setJobItems(data.jobItems);
// 			} catch (error) {
// 				console.log("ErrWhileFetching", error);
// 			}
// 		};
// 		fetchJobs();
// 	}, [searchText]);

// 	return { jobItems, isLoading } as const;
// }

type TJobItemsApiResponse = {
	public: boolean;
	sorted: boolean;
	jobItems: TJobItem[];
};

const fetchJobItems = async (
	searchText: string
): Promise<TJobItemsApiResponse> => {
	const res = await fetch(`${BASE_API_URL}?search=${searchText}`);

	if (!res.ok) {
		const errData = await res.json();
		throw new Error(errData.description);
	}

	const data = await res.json();
	return data;
};

export function useSearchQuery(searchText: string) {
	const { data, isInitialLoading } = useQuery(
		["job-items", searchText],
		() => fetchJobItems(searchText),
		{
			staleTime: 1000 * 60 * 60,
			refetchOnWindowFocus: false,
			retry: false,
			enabled: Boolean(searchText),
			onError: handleError,
		}
	);

	return {
		jobItems: data?.jobItems,
		isLoading: isInitialLoading,
	} as const;
}

/*-------------------------------*/

// ----------------- For fetching data in bookmark

export function useJobItems(ids: number[]) {
	const results = useQueries({
		queries: ids.map((id) => ({
			queryKey: ["job-item", id],
			queryFn: () => fetchJobItem(id),
			staleTime: 1000 * 60 * 60,
			refetchOnWindowFocus: false,
			retry: false,
			enabled: Boolean(id),
			onError: handleError,
		})),
	});
	console.log(results);
	const jobItems = results
		.map((result) => result.data?.jobItem)
		// .filter((jobItem) => jobItem !== undefined);
		// .filter((jobItem) => !!jobItem);
		.filter((jobItem) => Boolean(jobItem)) as TJobItemData[];
	const isLoading = results.some((result) => result.isLoading);
	return { jobItems, isLoading };
}

// -------------------

export function useActiveId() {
	const [activeId, setActiveId] = useState<number | null>(null);

	useEffect(() => {
		const handleHashChange = () => {
			const id = +window.location.hash.slice(1);
			setActiveId(id);
		};
		handleHashChange();

		window.addEventListener("hashchange", handleHashChange);

		return () => {
			window.removeEventListener("hashchange", handleHashChange);
		};
	}, []);

	return activeId;
}

// export function useJobItem(id: number | null) {
// 	const [jobItem, setJobItem] = useState<TJobItemData | null>(null);
// 	const [isLoading, setIsLoading] = useState(false);

// 	useEffect(() => {
// 		if (!id) return;

// 		const fetchData = async () => {
// 			try {
// 				setIsLoading(true);
// 				const res = await fetch(`${BASE_API_URL}/${id}`);
// 				const data = await res.json();
// 				setIsLoading(false);
// 				setJobItem(data.jobItem);
// 			} catch (error) {
// 				console.log("ListingErr:", error);
// 			}
// 		};
// 		fetchData();
// 	}, [id]);
// 	return { jobItem, isLoading } as const;
// }

type TJobItemApiResponse = {
	public: boolean;
	jobItem: TJobItemData;
};

const fetchJobItem = async (
	id: number | null
): Promise<TJobItemApiResponse> => {
	const res = await fetch(`${BASE_API_URL}/${id}`);
	//4xx or 5xx
	if (!res.ok) {
		const errorData = await res.json();
		console.log("fetchJob:", errorData.description);
		throw new Error(errorData.description);
	}
	const data = await res.json();
	return data;
};

export function useJobItem(id: number | null) {
	const { data, isInitialLoading } = useQuery(
		["job-item", id],
		() => fetchJobItem(id),
		{
			staleTime: 1000 * 60 * 60,
			refetchOnWindowFocus: false,
			retry: false,
			enabled: Boolean(id),
			onError: handleError,
		}
	);
	return {
		jobItem: data?.jobItem,
		isLoading: isInitialLoading,
	} as const;
}

export function useDebounce<T>(value: T, delay = 500): T {
	const [debouncedValue, setDebouncedValue] = useState(value);
	useEffect(() => {
		const timerId = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => clearTimeout(timerId);
	}, [value, delay]);

	return debouncedValue;
}

export function useLocalStorage<T>(
	key: string,
	initialValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
	const [value, setValue] = useState(() =>
		JSON.parse(
			localStorage.getItem(key) || JSON.stringify(initialValue)
		)
	);

	useEffect(() => {
		localStorage.setItem(key, JSON.stringify(value));
	}, [value, key]);

	return [value, setValue];
}

export function useOnClickOutside(
	refs: React.RefObject<HTMLElement>[],
	handler: () => void
) {
	useEffect(() => {
		const handleClick = (e: MouseEvent) => {
			if (
				refs.every((ref) => !ref.current?.contains(e.target as Node))
			) {
				handler();
			}
		};

		document.addEventListener("click", handleClick);

		return () => {
			document.removeEventListener("click", handleClick);
		};
	}, [refs, handler]);
}

/* */

export function useBookmarksContext() {
	const context = useContext(BookmarksContext);
	if (!context) {
		throw new Error(
			"useBookmarkIcon must be used within a BookmarksContextProvider"
		);
	}
	return context;
}

export function useActiveIdContext() {
	const context = useContext(ActiveIdContext);
	if (!context) {
		throw new Error(
			"ActiveIdContext must be used within a ActiveIdContextProvider"
		);
	}
	return context;
}

export function useSearchTextContext() {
	const context = useContext(SearchTextContext);
	if (!context) {
		throw new Error(
			"SearchTextContext must be used within a SearchTextContextPRovider"
		);
	}
	return context;
}


export function useJobItemsContext() {
	const context = useContext(JobItemsContext);
	if (!context) {
		throw new Error(
			"JobItemsContext must be used within a JobItemsContextPRovider"
		);
	}
	return context;
}