const data = require( 'random-fixture-data' );
const { jobs, application_statuses, genders, pronouns, regions } = require( './fixture-data' );

let user_id = 0;
function User() {
	const { first_name, last_name } = data;
	const full_name = `${ first_name } ${ last_name }`;
	return {
		id: ++user_id,
		first_name: first_name,
		last_name: last_name,
		name: full_name,
		emails: [ data.email ],
		employee_id: null,
		site_admin: true,
		disabled: false,
		updated_at: data.date( 'YYYY-MM-DDTHH:mm:ss.SSZ' ),
		created_at: data.date( 'YYYY-MM-DDTHH:mm:ss.SSZ' ),
	};
}

const coordinators = [ User(), User(), User(), User(), null ];

function RandomCandidate() {
	return Candidate( {
		id: data.integer,
		firstName: data.first_name,
		lastName: data.last_name,
		username: data.random_element( [ null, data.username ] ),
		email: data.email,
		jobs: [ data.random_element( Object.values( jobs ) ) ],
		status: data.random_element( Object.values( application_statuses ) ),
		stage: data.random_element( [
			'Application Review',
			'Pre-Interview Form',
			'Interview',
			'Code Test',
			'Trial',
			'Matt Chat',
			'Offer',
			'Hired',
		] ),
		coordinator: data.random_element( coordinators ),
		gender: data.random_element( Object.values( genders ).concat( [ null ] ) ),
		pronouns: data.random_element( Object.values( pronouns ).concat( [ null ] ) ),
		region: data.random_element( Object.values( regions ).concat( [ null ] ) ),
		addCoverLetter: Math.random() >= 0.5,
		addResume: Math.random() >= 0.5,
		addSlackChannel: data.random_element( [ true, false ] ),
	} );
}

/**
 * slackChannel: boolean
 *
 * @param props Object of parameters to create a new Candidate
 */
function Candidate( props ) {
	const first_name = props.firstName;
	const last_name = props.lastName;
	const full_name = `${ first_name } ${ last_name }`;
	const stage = props.stage;

	const attachments = [];

	if ( props.addCoverLetter ) {
		attachments.push( {
			filename: `${ full_name } - Cover Letter Intro.txt`,
			type: 'cover_letter',
			url: 'http://example.com/text.txt',
		} );
	}

	if ( props.addResume ) {
		attachments.push( {
			filename: 'resume',
			type: 'resume',
			url: 'http://example.com/resume.pdf',
		} );
	}

	const slackChannel = `hi-${ first_name }-${ last_name }`.toLowerCase();

	return {
		application_ids: [ 1 ],
		applications: [
			{
				applied_at: '2018-08-13T06:34:19.993Z',
				candidate_id: 1,
				credited_to: null,
				current_stage: {
					id: 1,
					name: stage,
				},
				id: 1,
				jobs: props.jobs,
				last_activity_at: '2018-08-15T06:32:00.565Z',
				location: null,
				prospect: false,
				source: null,
				status: props.status,
			},
		],
		attachments: attachments,
		coordinator: props.coordinator,
		created_at: '2018-08-15T06:02:57.176Z',
		email_addresses: [ { value: props.email, type: 'personal' } ],
		name: full_name,
		first_name: first_name,
		last_name: last_name,
		id: props.integer,
		is_private: false,
		keyed_custom_fields: {
			gender: generateCustomField( {
				name: 'Gender',
				value: props.gender,
			} ),
			pronouns: generateCustomField( {
				name: 'Pronouns',
				value: props.pronouns,
			} ),
			git_hub_username: generateCustomField( { name: 'GitHub Username', value: null } ),
			job_source: null,
			region: generateCustomField( {
				name: 'Region',
				value: data.region,
			} ),
			slack_channel: generateCustomField( {
				name: 'Slack Channel',
				value: props.addSlackChannel ? slackChannel : null,
			} ),
			word_press_com_username: props.username,
		},
		last_activity: '2018-08-15T06:02:58.054Z',
		updated_at: '2018-08-15T06:02:58.075Z',
	};
}

function generateCustomField( { name, value } ) {
	return {
		name,
		value,
		type: 'short_text',
	};
}

module.exports = {
	Candidate: Candidate,
	RandomCandidate: RandomCandidate,
};
