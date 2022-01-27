import React, { useRef, useState } from 'react';
import { formatTypeCSS } from '../actions/process-css';
import { copyToClipboard } from '../helpers/class-process';

const CSSGroup = ({
	type,
	baseFontSize,
}) => {
	const tmp = formatTypeCSS(type, baseFontSize);
	const [copy, setCopy] = useState(false);
	const copyAreaRef = useRef(null);

	return (
		<div>
			<h3>{type.name}</h3>
			<pre>
				<button className='copy-button' onClick={() => copyToClipboard(setCopy, copyAreaRef)}>{copy ? 
					(
						<span>Copied!</span>
					) : (
						<span>Copy</span>
					)}
				</button>
				<code className={'language-css'}>
					{tmp}
				</code>
			</pre>
			<input className='copy-target' type="text" readOnly value={tmp} ref={copyAreaRef} />
	</div>
	);
};

export default CSSGroup;