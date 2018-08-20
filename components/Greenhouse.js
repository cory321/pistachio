/** @format */

import React from 'react';

import Filters from '../containers/Filters';
import Candidates from '../containers/Candidates';

export default function Tools() {
	return [ <Filters key="filters" />, <Candidates key="candidates" /> ];
}
