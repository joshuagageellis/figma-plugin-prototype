/**
 * REM font size.
 */
const pxToRem = (baseSize: number, size: number): number => size / baseSize;

/**
 * Unitless line height.
 */
const lineHeight = (obj: any): number|null => {
	if (obj.value) {
		return Math.round(obj.value) / 100;
	} else {
		return null;
	}
};

/**
 * Letter Spacing.
 */
const letterSpacing = (rem: number, obj: any): number|null => {
	if (obj.value) {
		return pxToRem(rem, obj.value);
	} else {
		return null;
	}
};

/**
 * Retrieve and process SVG from selected element.
 */
export const processCss = {
	NAME: 'process-css',
	CALLBACK: async (msg: any) => {
		const {
			baseFontSize
		} = msg;

		const styles = figma.getLocalTextStyles();

		if (styles) {
			const allStyles = styles.map(style => {
				return {
					id: style.id,
					name: style.name,
					fontName: style.fontName,
					fontSize: pxToRem(baseFontSize, style.fontSize),
					lineHeight: lineHeight(style.lineHeight),
					letterSpacing: letterSpacing(baseFontSize, style.letterSpacing),
					textCase: style.textCase,
				}
			});

			figma.ui.postMessage({
				type: 'nodes',
				textTypes: allStyles,
			});
		} else {
			return;
		}
	}
};

// async function loadFont (obj: any): Promise<void> {
// 	console.log(obj);
// 	try {
// 		// return await figma.loadFontAsync({ family: "Roboto", style: "Regular" });
// 		const baseFont = figma.loadFontAsync({ family: "Roboto", style: "Regular" });
// 		const setFont = figma.loadFontAsync(obj);
// 		return awaitPromise.all([ baseFont, setFont ]);
// 		//Promise.all([figma.loadFontAsync({ family: "Roboto", style: "Regular" }), figma.loadFontAsync(obj)]);
// 	} catch (err) {
// 		console.log(err);
// 	}
// };

export const fromatTypeCSS = (type: any) => {
	const tmp =
`.${type.name.replace(/[\W_]+/g,'').toLowerCase()} {
 line-height: ${pxToRem(16, type.fontSize)};
 font-size: ${type.fontSize}rem;
 letter-spacing: ${letterSpacing(16, type.letterSpacing)}rem;
}
`;

	return tmp;
};

export const renderType = {
	NAME: 'render-type',
	createText: async () => {
		let errors = [];

		// Load default font.
		await figma.loadFontAsync({ family: "Roboto", style: "Regular" })
			.catch(err => {
				// console.log(err);
				errors.push(err);
			});

		const styles = figma.getLocalTextStyles();

		const allFonts = [...new Set(styles.map(style => style.fontName))];

		const fontPromises = allFonts.map((font) => {
			return figma.loadFontAsync(font);
		});

		console.log(allFonts);

		await Promise.all(fontPromises)
			.catch(err => {
				console.log(err);
				errors.push(err);
			});

		console.log(errors.length);

		if (errors.length === 0) {
			// Create page.
			const page = figma.createPage();
			page.name = 'Formatted Text';

			// Create frame.
			const frame = figma.createFrame();
			frame.resize(1440, 2800);
			frame.layoutMode = 'VERTICAL';
			frame.name = 'Formatted Text';
			frame.paddingLeft = 24;
			frame.paddingRight = 24;
			frame.paddingTop = 24;
			frame.paddingBottom = 24;
			frame.itemSpacing = 16;

			// Append.
			page.appendChild(frame);
			
			const nodes = styles.map((style) => {
				// Create title.
				const text = figma.createText();
				text.fontName = style.fontName;
				text.characters = style.name;
				text.fontSize = style.fontSize;
				console.log(text.fontSize);
				console.log(text.fontName);
				frame.appendChild(text);

				// Create css.
				const css = fromatTypeCSS(style);
				const cssNode = figma.createText();
				cssNode.characters = css;
				cssNode.fontSize = 8;
				frame.appendChild(cssNode);

				// Create group.
				const group = figma.group([text, cssNode], frame);

				return group;
			});
		}

		return errors;
	},
	CALLBACK: async (msg: any) => {
		renderType.createText()
			.then((errors) => {
				figma.ui.postMessage({
					type: 'nodes',
					errors,
				});
			});
	},
};

// export const renderType = {
// 	NAME: 'render-type',
// 	CALLBACK: async (msg: any) => {
// 		// Create page.
// 		const page = figma.createPage();
// 		page.name = 'Formatted Text';

// 		// Create frame.
// 		const frame = figma.createFrame();
// 		frame.name = 'Formatted Text';

// 		// Append.
// 		page.appendChild(frame);

// 		// Store errors.
// 		const errors: string[] = [];

// 		const styles = figma.getLocalTextStyles();
// 		// let unique = [];
// 		// const allFonts = styles.map((style) => {
// 		// 	if (style.fontName && unique.indexOf(style.fontName) === -1) {
// 		// 		return style.fontName;
// 		// 	}
// 		// });
// 		const allFonts = [...new Set(styles.map(style => style.fontName))];
// 		allFonts.push({ family: "Roboto", style: "Regular" });

// 		console.log(allFonts);

// 		const fontPromises = allFonts.map(async (font) => {
// 			return figma.loadFontAsync(font);
// 		});

// 		// Default font.
// 		// fontPromises.push(figma.loadFontAsync({ family: "Roboto", style: "Regular" }));
		
// 		Promise.all(fontPromises)
// 			.catch(err => {
// 				console.log(err);
// 				errors.push(err);
// 			})
// 			.then(() => {
// 				styles.forEach((style) => {
// 					const text = figma.createText();
// 					// text.fontName = style.fontName;
// 					text.characters = style.name;
// 					// console.log(text);
// 					frame.appendChild(text);
// 				});
// 			})
// 			.finally(() => {
// 				figma.ui.postMessage({
// 					type: 'nodes',
// 					errors,
// 				});
// 			});

		// allFonts.forEach(async (font) => {
			
		// });
		// Promise.all([
		// 		figma.loadFontAsync({ family: "Roboto", style: "Regular" }),
		// 		figma.loadFontAsync(font),
		// 	])
		// 	.catch(err => {
		// 		console.log(err);
		// 		errors.push(err);
		// 	});

		// styles.forEach(async (style: any) => {
		// 	Promise.all([
		// 		figma.loadFontAsync({ family: "Roboto", style: "Regular" }),
		// 		figma.loadFontAsync(style.fontName),
		// 	])
		// 	.catch(err => {
		// 		console.log(err);
		// 		errors.push(err);
		// 	})
		// 	.then(() => {
		// 			const text = figma.createText();
		// 			// text.fontName = style.fontName;
		// 			text.characters = style.name;
		// 			// console.log(text);
		// 			frame.appendChild(text);
		// 		});			
		// });