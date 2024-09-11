import { BookmarkFilledIcon } from "@radix-ui/react-icons";
import { useBookmarksContext } from "../lib/hooks";

type TBookmarkIconProps = {
	id: number;
};

export default function BookmarkIcon({ id }: TBookmarkIconProps) {
	const { bookmarkedIds, handleToggleBookmark } =
		useBookmarksContext();

	return (
		<button
			onClick={(e) => {
				e.preventDefault();
				e.stopPropagation();
				handleToggleBookmark(id);
			}}
			className="bookmark-btn"
		>
			<BookmarkFilledIcon
				className={bookmarkedIds.includes(id) ? "filled" : ""}
			/>
		</button>
	);
}
