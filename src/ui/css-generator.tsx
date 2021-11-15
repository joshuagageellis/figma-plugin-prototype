import React, { useState } from 'react'
import { Input } from 'react-figma-ui';

const CSSGenerator = (props: any) => {
	


	return (
		<div>
			<div className="input-group">
				<Input label='Breakpoint' placeholder='768' type='number' />
			</div>
		</div>
	);
};

export default CSSGenerator;