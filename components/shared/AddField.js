import React, { useState, useEffect, useRef } from 'react';
import SaveIcon from '../icons/save';
import CancelIcon from '../icons/cancel';

function AddField( { candidate, onSave, buttonText = 'Add Field' } ) {
	const [ editing, setEditing ] = useState( false );
	const [ inputValue, setInputValue ] = useState( '' );
	const [ inputError, setInputError ] = useState( false );
	const inputRef = useRef( null );

	useEffect( () => {
		if ( editing ) {
			inputRef.current.focus();
		}
	}, [ editing ] );

	const handleInputChange = event => {
		const value = event.target.value;
		setInputValue( value );
		setInputError( ! /^([a-zA-Z-\s()\/])*$/.test( value ) );
	};

	const handleSaveClick = () => {
		if ( inputError ) return;
		onSave( candidate, inputValue );
		setInputValue( '' );
		setEditing( false );
	};

	const handleCancelClick = () => {
		setInputValue( '' );
		setEditing( false );
	};

	const handleAddClick = () => {
		setEditing( true );
	};
	const handleKeyDown = event => {
		if ( event.key === 'Enter' ) {
			event.preventDefault();
			handleSaveClick();
		}
	};

	if ( editing ) {
		return (
			<div style={ { width: '15em' } }>
				<input
					value={ inputValue }
					onChange={ handleInputChange }
					style={ { width: '15ch' } }
					ref={ inputRef }
					onKeyDown={ handleKeyDown }
				/>
				<button className="edit-field-btn" onClick={ handleCancelClick }>
					<CancelIcon className="cancel-icon" />
				</button>
				<button className="edit-field-btn" onClick={ handleSaveClick } disabled={ inputError }>
					<SaveIcon className="save-icon" />
				</button>
				{ inputError && (
					<div style={ { color: 'red' } }>Only letters A-Z, /, or parentheses allowed.</div>
				) }
			</div>
		);
	}
	return (
		<div style={ { width: '15em' } }>
			<button className="button" name="pronouns" onClick={ handleAddClick }>
				{ buttonText }
			</button>
		</div>
	);
}

export default AddField;
