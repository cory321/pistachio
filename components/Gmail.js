/** @format */

import React from 'react';

import Labels from '../containers/Labels';
import Messages from '../containers/Messages';

export default function Gmail() {
	return [ <Labels key="labels" />, <Messages key="messages" /> ];
}
