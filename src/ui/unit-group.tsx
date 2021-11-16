import React, { useState } from 'react'


const UnitGroup = (props: any) => {
	
	const supportedUnits = [
		{ label: 'px', value: 'px' },
		{ label: 'rem', value: 'rem' },
	];
	
	return (
		<div>
			<label htmlFor='unit-select'>{'Select Unit:'}</label>
			<div id='unit-select' className='input-group' onChange={props.onChange}>
				{supportedUnits.map((unit: any) => (
					<div key={unit.value} className='input-group-item'>
						<input type='radio' name='unit' value={unit.value} />
						<label>{unit.label}</label>
					</div>
				))}
			</div>
			{props.unit === 'rem' ? (
				<div className='input-group'>
					<label htmlFor='base-font'>{'Base Font Size'}</label>
					<input type='number' name='value' placeholder='16' value={props.baseFont} onChange={props.onBaseFontChange} />
				</div>
			) : null}
		</div>
	);
};

export default UnitGroup;