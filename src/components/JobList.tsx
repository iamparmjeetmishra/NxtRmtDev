import { useActiveIdContext } from "../lib/hooks";
import { TJobItem } from "../lib/type";
import JobListItem from "./JobListItem";
import Spinner from "./Spinner";

type JobListProps = {
	jobItems: TJobItem[];
	isLoading: boolean;
};

export function JobList({ jobItems, isLoading }: JobListProps) {
	const { activeId: id } = useActiveIdContext();

	return (
		<ul className="job-list">
			{isLoading && <Spinner />}
			{!isLoading &&
				jobItems?.map((jobItem) => (
					<JobListItem
						key={jobItem.id}
						jobItem={jobItem}
						isActive={id === jobItem.id}
					/>
				))}
		</ul>
	);
}

export default JobList;
