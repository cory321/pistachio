const { jobs, stages, application_statuses, genders, regions } = require( './fixture-data' );

let id = 0;

const coordinator = {
	id: 1,
	first_name: 'Bettye',
	last_name: 'Greenfelder',
	name: 'Bettye Greenfelder',
	emails: [ 'Bettye.Greenfelder@email.com' ],
	employee_id: null,
	site_admin: true,
	disabled: false,
	updated_at: '1989-01-09T17:24:34.00-06:00',
	created_at: '1993-01-03T03:36:48.00-06:00',
};

const _allCandidates = [];

function candidateConfig( props ) {
	return {
		id: ++id,
		firstName: props.firstName,
		lastName: props.lastName,
		username: props.username,
		email: props.email,
		jobs: Array.isArray( props.jobs ) ? props.jobs : [ props.jobs ],
		status: props.status,
		stage: props.stage,
		coordinator: coordinator,
		gender: genders.other,
		region: regions.americas,
		addCoverLetter: false,
		addResume: false,
		addSlackChannel: false,
	};
}

const active_appReview_codeWrangler = candidateConfig( {
	firstName: 'Active_AppReview',
	lastName: 'CodeWrangler',
	username: 'acodew',
	email: 'AppReview.CodeWrangler@email.com',
	jobs: jobs.code_wrangler,
	status: application_statuses.active,
	stage: stages.application_review,
} );
module.exports.active_appReview_codeWrangler = active_appReview_codeWrangler;
_allCandidates.push( active_appReview_codeWrangler );

const active_appReview_javaScriptEngineer = candidateConfig( {
	firstName: 'Active_AppReview',
	lastName: 'JavaScriptEngineer',
	username: 'jcodew',
	email: 'AppReview.JavaScriptEngineer@email.com',
	jobs: jobs.javascript_engineer,
	status: application_statuses.active,
	stage: stages.application_review,
} );
module.exports.active_appReview_javaScriptEngineer = active_appReview_javaScriptEngineer;
_allCandidates.push( active_appReview_javaScriptEngineer );

const active_preInterviewForm_codeWrangler = candidateConfig( {
	firstName: 'Active_PreInterviewForm',
	lastName: 'CodeWrangler',
	username: 'pcodew',
	email: 'PreInterviewForm.CodeWrangler@email.com',
	jobs: jobs.code_wrangler,
	status: application_statuses.active,
	stage: stages.pre_interview_form,
} );
module.exports.active_preInterviewForm_codeWrangler = active_preInterviewForm_codeWrangler;
_allCandidates.push( active_preInterviewForm_codeWrangler );

const active_interview_codeWrangler = candidateConfig( {
	firstName: 'Active_Interview',
	lastName: 'CodeWrangler',
	username: 'icodew',
	email: 'Interview.CodeWrangler@email.com',
	jobs: jobs.code_wrangler,
	status: application_statuses.active,
	stage: stages.interview,
} );
module.exports.active_interview_codeWrangler = active_interview_codeWrangler;
_allCandidates.push( active_interview_codeWrangler );

const _hiredCandidates = [];

const hired_hired_codeWrangler = candidateConfig( {
	firstName: 'Hired_Hired',
	lastName: 'CodeWrangler',
	username: 'hcodew',
	email: 'Hired.CodeWrangler@email.com',
	jobs: jobs.code_wrangler,
	status: application_statuses.hired,
	stage: stages.hired,
} );
module.exports.hired_hired_codeWrangler = hired_hired_codeWrangler;
_allCandidates.push( hired_hired_codeWrangler );
_hiredCandidates.push( hired_hired_codeWrangler );

const hired_mattChat_codeWrangler = candidateConfig( {
	firstName: 'Hired_MattChat',
	lastName: 'CodeWrangler',
	username: 'hcodew',
	email: 'HiredMattChat.CodeWrangler@email.com',
	jobs: jobs.code_wrangler,
	status: application_statuses.hired,
	stage: stages.matt_chat,
} );
module.exports.hired_mattChat_codeWrangler = hired_mattChat_codeWrangler;
_allCandidates.push( hired_mattChat_codeWrangler );
_hiredCandidates.push( hired_mattChat_codeWrangler );

const _rejectedCandidates = [];

const rejected_interview_codeWrangler = candidateConfig( {
	firstName: 'Rejected_Interview',
	lastName: 'CodeWrangler',
	username: 'rcodew',
	email: 'RejectedInterview.CodeWrangler@email.com',
	jobs: jobs.code_wrangler,
	status: application_statuses.rejected,
	stage: stages.interview,
} );
module.exports.rejected_interview_codeWrangler = rejected_interview_codeWrangler;
_allCandidates.push( rejected_interview_codeWrangler );
_rejectedCandidates.push( rejected_interview_codeWrangler );

const rejected_codeTest_codeWrangler = candidateConfig( {
	firstName: 'Rejected_CodeTest',
	lastName: 'CodeWrangler',
	username: 'rcodew',
	email: 'RejectedCodeTest.CodeWrangler@email.com',
	jobs: jobs.code_wrangler,
	status: application_statuses.rejected,
	stage: stages.code_test,
} );
module.exports.rejected_codeTest_codeWrangler = rejected_codeTest_codeWrangler;
_allCandidates.push( rejected_codeTest_codeWrangler );
_rejectedCandidates.push( rejected_codeTest_codeWrangler );

module.exports.allCandidates = _allCandidates;
module.exports.hiredCandidates = _hiredCandidates;
module.exports.rejectedCandidates = _rejectedCandidates;
