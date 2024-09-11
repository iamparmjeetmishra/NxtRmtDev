export type TJobItem = {
	id: number;
	badgeLetters: string;
	title: string;
	company: string;
	date: string;
	daysAgo: number;
	relevanceScore: number;
};

export type TJobItemData = TJobItem & {
	description: string;
	qualifications: string[];
	duration: string;
	salary: string;
	location: string;
	daysAgo: number;
	coverImgURL: string;
	companyURL: string;
	reviews: string[];
};

export type TPageDirection = 'next' | 'previous'

export type TSortBy = 'relevant' | 'recent';
