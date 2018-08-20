import React, { Component } from 'react'
import fileSize from 'file-size'

class Attachment extends Component {
	constructor( props ) {
		super( props )

		this.state = {
			fetching: false,
			url: '#',
		}

		this.click = this.click.bind( this )
		this.rightClick = this.rightClick.bind( this )
		this.change = this.change.bind( this )
	}

	componentWillUnmount() {
		URL.revokeObjectURL( this.state.url )
	}

	click( event ) {
		/*
		 * Prevent opening `blob:` URLs in a new tab.
		 *
		 * Doing anything but downloading these `blob:` URLs is a security risk since
		 * they have the same origin as Pistachio.
		 *
		 * See also link's onContextMenu and this.rightClick()
		 *
		 * This is a bit hacky :)
		 */
		if ( event.ctrlKey || event.shiftKey || event.metaKey || event.altKey ) {
			event.preventDefault()
			return
		}

		const link = event.target

		if ( 0 === link.href.indexOf( 'blob:' ) ) {
			return
		}

		this.setState( { fetching: true } )

		event.preventDefault()

		this.props.getAttachment( this.props.attachment )
			.then( file => {
				const url = URL.createObjectURL( file )
				this.setState( { fetching: false, url }, () => link.click() )
			} )
	}

	rightClick( event ) {
		event.preventDefault()
	}

	change( event ) {
		const { isExcluded } = this.props

		if ( isExcluded ) {
			this.props.includeAttachment( event.target.name )
		} else {
			this.props.excludeAttachment( event.target.name )
		}
	}

	render() {
		const { attachmentId, filename, size, mimeType } = this.props.attachment
		const { isExcluded } = this.props
		const { fetching, url } = this.state

		const title = `Content-Type: ${mimeType}\nSize: ${fileSize( size, { fixed: 0 } ).human()}`

		return <span>
			<input type="checkbox" name={attachmentId} checked={ ! isExcluded } onChange={this.change} />
			<a href={url} className={fetching ? 'fetching' : '' } onClick={this.click} onContextMenu={this.rightClick} title={title} download={filename}>{filename}</a>
		</span>
	}
}

export default function Attachments( { attachments, getAttachment, showAttachments, excludedAttachments, excludeAttachment, includeAttachment } ) {
	if ( ! attachments.length ) {
		return null
	}

	return <ul className={showAttachments ? '' : 'hidden'}>{ attachments.map( attachment => (
		<li key={attachment.attachmentId}>
			<Attachment
				attachment={attachment}
				getAttachment={getAttachment}
				isExcluded={excludedAttachments.includes( attachment.attachmentId )}
				excludeAttachment={excludeAttachment}
				includeAttachment={includeAttachment}
			/>
		</li>
	) ) }</ul>
}
