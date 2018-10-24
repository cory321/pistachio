/** @format */

const application_statuses = {
	active: 'active',
	hired: 'hired',
	rejected: 'rejected',
};
module.exports.application_statuses = application_statuses;

const job_statuses = {
	open: 'open',
	closed: 'closed',
};
module.exports.job_statuses = job_statuses;

const stages = {
	application_review: 'Application Review',
	pre_interview_form: 'Pre-Interview Form',
	interview: 'Interview',
	code_test: 'Code Test',
	trial: 'Trial',
	matt_chat: 'Matt Chat',
	offer: 'Offer',
	hired: 'Hired',
};
module.exports.stages = stages;

const departments = {
	web: {
		name: 'Web',
		id: 45284,
		external_id: null,
		parent_id: 44211,
		child_ids: [],
	},
	marketing: {
		name: 'Marketing',
		id: 45285,
		external_id: null,
		parent_id: null,
		child_ids: [],
	},
	human_resources: {
		name: 'Human Resources',
		id: 45286,
		external_id: null,
		parent_id: null,
		child_ids: [],
	},
};
module.exports.departments = departments;

const offices = {
	web: {
		name: 'Web',
		id: 44811,
		external_id: null,
		parent_id: 43792,
		child_ids: [],
		location: { name: null },
	},
	human_resources: {
		name: 'Human Resources',
		id: 44812,
		external_id: null,
		parent_id: null,
		child_ids: [],
		location: { name: null },
	},
	marketing: {
		name: 'Marketing',
		id: 44813,
		external_id: null,
		parent_id: null,
		child_ids: [],
		location: { name: null },
	},
};
module.exports.offices = offices;

const jobs = {
	code_wrangler: {
		name: 'Code Wrangler',
		id: 2,
		departments: [ departments.web ],
		offices: [ offices.web ],
		status: job_statuses.open,
	},
	javascript_engineer: {
		name: 'JavaScript Engineer',
		id: 3,
		departments: [ departments.web ],
		offices: [ offices.web ],
		status: job_statuses.open,
	},
	human_resources_wrangler: {
		name: 'Human (Resources) Wrangler',
		id: 4,
		departments: [ departments.human_resources ],
		offices: [ offices.human_resources ],
		status: job_statuses.open,
	},
	marketing_data_analyst: {
		name: 'Marketing Data Analyst',
		id: 5,
		departments: [ departments.marketing ],
		offices: [ offices.marketing ],
		status: job_statuses.open,
	},
	customer_marketing_wrangler: {
		name: 'Customer Marketing Wrangler',
		id: 6,
		departments: [ departments.marketing ],
		offices: [ offices.marketing ],
		status: job_statuses.open,
	},
};
module.exports.jobs = jobs;

const genders = { female: 'Female', male: 'Male', other: 'Other/Not Sure' };
module.exports.genders = genders;

const regions = {
	americas: 'Americas',
	europe_africa: 'Europe - Africa',
	asia_pacific: 'Asia - Pacific',
};
module.exports.regions = regions;
