import React, { useRef, useState } from 'react';

export const fromatTypeCSS = (type: any) => {
	const tmp =
`.${type.name.replace(/[\W_]+/g,'').toLowerCase()} {
 line-height: ${type.lineHeight};
 font-size: ${type.fontSize}rem;
 letter-spacing: ${type.letterSpacing}rem;
}
`;

	return tmp;
};


const CSSGroup = ({
	type
}) => {
	const tmp = fromatTypeCSS(type);
	const [copy, setCopy] = useState(false);
	const copyAreaRef = useRef(null);

	const copyToClipboard = () => {
		copyAreaRef.current.select();
		document.execCommand('copy');
		setCopy(true);
		setTimeout(() => {
			setCopy(false);
		}, 2000);
	};

	return (
		<div>
			<h3>{type.name}</h3>
			<pre>
				<button className='copy-button' onClick={copyToClipboard}>{copy ? 
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