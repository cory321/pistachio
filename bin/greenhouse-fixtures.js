/** @format */

const data = require( 'random-fixture-data' );
const _ = require( 'lodash' );

// change to objects with IDs
const jobName = data.random_element( [ 'Code Wrangler', 'JavaScript Engineer' ] );

function User() {
	const { first_name, last_name } = data;
	const full_name = `${ first_name } ${ last_name }`;
	return {
		id: data.integer,
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

//console.log( JSON.stringify( User(), null, 2 ) );
//console.log( JSON.stringify( Job(), null, 2 ) );
console.log( JSON.stringify( _.times( 1000, Candidate ), null, 2 ) );

function Job() {
	return {
		name: jobName,
		departments: [
			{
				child_ids: [],
				external_id: null,
				id: 2,
				name: 'Web',
				parent_id: 2,
			},
		],
		id: 3,
		offices: [
			{
				child_ids: [],
				external_id: null,
				id: 2,
				location: { name: null },
				name: 'Web',
				parent_id: 2,
			},
		],
		status: 'open',
	};
}

function generateCustomField( { name, value } ) {
	return {
		name,
		value,
		type: 'short_text',
	};
}

function Candidate() {
	const { first_name, last_name } = data;
	const full_name = `${ first_name } ${ last_name }`;
	const stage = data.random_element( [
		'Application Review',
		'Pre-Interview Form',
		'Interview',
		'Code Test',
		'Trial',
		'Matt Chat',
		'Offer',
		'Hired',
	] );
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
				jobs: [
					{
						id: 2,
						name: jobName,
					},
				],
				last_activity_at: '2018-08-15T06:32:00.565Z',
				location: null,
				prospect: false,
				source: null,
				status: 'active',
			},
		],
		attachments: [
			{
				filename: `${ full_name } - Cover Letter Intro.txt`,
				type: 'cover_letter',
				url: 'http://example.com/text.txt',
			},
			{
				filename: 'resume',
				type: 'resume',
				url: 'http://example.com/resume.pdf',
			},
		],
		coordinator: null,
		created_at: '2018-08-15T06:02:57.176Z',
		email_addresses: [ { value: data.email, type: 'personal' } ],
		name: full_name,
		first_name: first_name,
		last_name: last_name,
		id: data.integer,
		is_private: false,
		keyed_custom_fields: {
			gender: generateCustomField( {
				name: 'Gender',
				value: data.random_element( [ null, 'Female', 'Male', 'Other/Not Sure' ] ),
			} ),
			git_hub_username: generateCustomField( { name: 'GitHub Username', value: null } ),
			job_source: null,
			region: generateCustomField( {
				name: 'Region',
				value: data.random_element( [ null, 'Americas', 'Europe - Africa', 'Asia - Pacific' ] ),
			} ),
			slack_channel: generateCustomField( {
				name: 'Slack Channel',
				value: data.random_element( [ null, `hi-${ first_name }-${ last_name }`.toLowerCase() ] ),
			} ),
			word_press_com_username: data.random_element( [ null, data.username ] ),
		},
		last_activity: '2018-08-15T06:02:58.054Z',
		updated_at: '2018-08-15T06:02:58.075Z',
	};
}
