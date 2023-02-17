import React, { useState, useEffect, useRef } from 'react';
import EditIcon from '../icons/edit';
import SaveIcon from '../icons/save';
import CancelIcon from '../icons/cancel';

function EditField( { candidate, editValue, onSave } ) {
	const [ editing, setEditing ] = useState( false );
	const [ inputValue, setInputValue ] = useState( editValue );
	const [ inputError, setInputError ] = useState( false );
	const inputRef = useRef( null );

	useEffect( () => {
		if ( editing ) {
			inputRef.current.focus();
		}
	}, [ editing ] );

	const handleEditClick = () => {
		setEditing( true );
	};

	const handleSaveClick = () => {
		if ( /^([a-zA-Z-\s()\/])*$/.test( inputValue ) ) {
			onSave( candidate, inputValue );
			setEditing( false );
		} else {
			setInputError( true );
		}
	};

	const handleCancelClick = () => {
		setInputValue( editValue );
		setInputError( false );
		setEditing( false );
	};

	const handleInputChange = event => {
		setInputValue( event.target.value );
		setInputError( false );
	};

	const handleKeyDown = event => {
		if ( event.key === 'Enter' ) {
			event.preventDefault();
			handleSaveClick();
		}
	};

	const renderEditButton = () => {
		return (
			<button className="edit-field-btn" onClick={ handleEditClick }>
				<EditIcon className="edit-icon" />
			</button>
		);
	};

	const renderSaveButton = () => {
		return (
			<>
				<button className="edit-field-btn" onClick={ handleCancelClick }>
					<CancelIcon className="cancel-icon" />
				</button>
				<button className="edit-field-btn" onClick={ handleSaveClick }>
					<SaveIcon className="save-icon" />
				</button>
			</>
		);
	};

	const renderInputField = () => {
		return (
			<>
				<input
					type="text"
					value={ inputValue }
					onChange={ handleInputChange }
					style={ { width: '15ch' } }
					ref={ inputRef }
					onKeyDown={ handleKeyDown }
				/>
				{ inputError && (
					<div style={ { color: 'red' } }>Only letters A-Z, /, or parentheses allowed.</div>
				) }
			</>
		);
	};

	return (
		<div style={ { width: '15em' } }>
			{ editing ? renderInputField() : editValue }
			{ editing ? renderSaveButton() : renderEditButton() }
		</div>
	);
}

export default EditField;
