import { createContext } from "react";
import { useJobItems, useLocalStorage } from "../lib/hooks";
import { TJobItemData } from "../lib/type";

type TBookmarkContext = {
	handleToggleBookmark: (id: number) => void;
	bookmarkedIds: number[];
	isLoading: boolean;
	bookmarkedJobItems:TJobItemData[]
};

export const BookmarksContext = createContext<TBookmarkContext | null>(null);

export default function BookmarksContextProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [bookmarkedIds, setBookmarkedIds] = useLocalStorage<number[]>(
		"bookmarkedIds",
		[]
	);

	const { jobItems: bookmarkedJobItems, isLoading } = useJobItems(bookmarkedIds)

	console.log(bookmarkedIds);
	const handleToggleBookmark = (id: number) => {
		if (bookmarkedIds.includes(id)) {
			setBookmarkedIds((prev) => prev.filter((item) => item !== id));
		} else {
			setBookmarkedIds((prev) => [...prev, id]);
		}
	};

	return (
		<BookmarksContext.Provider
			value={{
				handleToggleBookmark,
				bookmarkedIds,
				bookmarkedJobItems,
				isLoading,
			}}
		>
			{children}
		</BookmarksContext.Provider>
	);
}

