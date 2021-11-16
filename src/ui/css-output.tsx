import React from 'react';

const CSSOutput = (props: any) => {
	const pxToRem = (px: number) => `${px / props.baseFont}rem`;

	return (
		<div>
			{pxToRem(20)}
		</div>
	);
}

export default CSSOutput;