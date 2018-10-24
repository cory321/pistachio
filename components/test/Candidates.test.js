/** @format */

import React from 'react';
import { shallow } from 'enzyme';

import Candidates from '../Candidates';

import { allCandidates, hiredCandidates, rejectedCandidates } from '../../bin/snapshot-candidates';

describe( 'Candidates', () => {
	it( 'should display a "no candidates found" message when candidates = []', () => {
		const candidates = shallow( <Candidates candidates={ [] } filters={ [] } /> );
		expect( candidates ).toMatchSnapshot();
	} );

	it( 'should display all candidates grouped by stage when no filter is given', () => {
		const candidates = shallow( <Candidates candidates={ allCandidates } filters={ [] } /> );
		expect( candidates ).toMatchSnapshot();
	} );

	it( 'should group candidates into hired regardless of status when no filter is given', () => {
		const candidates = shallow(
			<div>
				<Candidates candidates={ hiredCandidates } filters={ [] } />
			</div>
		);
		for ( const candidate of hiredCandidates ) {
			expect( candidates.html().includes( candidate.json.name ) ).toBe( true );
		}
		expect( candidates ).toMatchSnapshot();
	} );

	it( 'should group candidates into rejected regardless of status when no filter is given', () => {
		const candidates = shallow(
			<div>
				<Candidates candidates={ rejectedCandidates } filters={ [] } />
			</div>
		);
		for ( const candidate of rejectedCandidates ) {
			expect( candidates.html().includes( candidate.json.name ) ).toBe( true );
		}
		expect( candidates ).toMatchSnapshot();
	} );

	it.skip( 'should filter when a filter is given', () => {} );
} );
