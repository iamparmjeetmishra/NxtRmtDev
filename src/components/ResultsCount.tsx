import { useJobItemsContext } from "../lib/hooks";

export default function ResultsCount() {
  const { totalNumberOfResults: count } = useJobItemsContext();
  

	return (
		<p className="count">
			<span className="u-bold">{count > 0 ? count : 0}</span> results
		</p>
	);
}
