import React, { useRef, useState } from 'react';
import { formatTypeCSS } from '../actions/process-css';
import { copyToClipboard } from '../helpers/class-process';

const CSSExportAll = ({
	types,
	baseFontSize,
}) => {
	const [copy, setCopy] = useState(false);
	const copyAreaRef = useRef(null);

	const css = types.map(type => {
		return formatTypeCSS(type, baseFontSize);
	});

	return (
		<>
			<button className='copy-all button button--secondary' onClick={() => copyToClipboard(setCopy, copyAreaRef)}>{copy ? 
				(
					<span>Copied!</span>
				) : (
					<span>Copy All Styles</span>
				)}
			</button>
			<input className='copy-target' type="text" readOnly value={css.join(' ')} ref={copyAreaRef} />
		</>
	);
};

export default CSSExportAll;