import FigmaProcess, { clone } from "../helpers/class-process";
import { css_beautify } from 'js-beautify';

const beautyConfig = {
  "indent_size": "4",
  "indent_char": " ",
  "max_preserve_newlines": "-1",
  "preserve_newlines": false,
  "keep_array_indentation": false,
  "break_chained_methods": false,
  "indent_scripts": "normal",
  "brace_style": "collapse",
  "space_before_conditional": true,
  "unescape_strings": false,
  "jslint_happy": false,
  "end_with_newline": false,
  "wrap_line_length": "0",
  "indent_inner_html": false,
  "comma_first": false,
  "e4x": false,
  "indent_empty_lines": false
};

/**
 * Default beauty standard.
 */
export const beautifier = (css: string): string => {
	return css_beautify(css, beautyConfig);
};

/**
 * Round off to two decimal places.
 */
export const roundToTwo = (num: number) => Math.round((num + Number.EPSILON) * 100) / 100;

/**
 * REM font size.
 */
export const pxToRem = (baseSize: number, size: number): number => roundToTwo(size / baseSize);

/**
 * Unitless line height.
 */
export const lineHeight = (obj: any, fontSize: number): number|string|null => {
	if (obj.value && obj.unit === 'PIXELS') {
		return roundToTwo(obj.value / fontSize);
	} else if (obj.value && obj.unit === 'PERCENT') {
		return roundToTwo(obj.value / 100);
	} else if (obj.unit === 'AUTO') {
		return 'normal';
	} else {
		return null;
	}
};

/**
 * Letter Spacing.
 */
export const letterSpacing = (baseFontSize: number, obj: any, fontSize: number): number|null => {
	if (obj.value && obj.unit === 'PERCENT') {
		return pxToRem(baseFontSize, (obj.value / 100) * fontSize);
	} else if (obj.value && obj.unit === 'PIXELS') {
		return pxToRem(baseFontSize, obj.value);
	} else {
		return null;
	}
};

/**
 * Process both font weight and style.
 */
export const fontWeightStyle = (obj: any): string => {
	let val = obj.style.toLowerCase();
	let tmp = '';
	if (val.includes('italic') || val == 'italic') {
		tmp += 'font-style: italic;';
		val = val.replace('italic', '');
	}
	if (val.length) {
		tmp += `/* font-weight: ${val}; */`;
	}
	return tmp;
};

/**
 * Sort by font size.
 */
const uglySort = (a: TextStyle, b: TextStyle) => {
	if (a.fontSize > b.fontSize) {
		return 1;
	} else if (a.fontSize < b.fontSize) {
		return -1;
	}
	return 0;
};

/**
 * Standard CSS formatting.
 * Run through beautifier.
 */
export const formatTypeCSS = (type: TextStyle, baseFontSize: number): string => {
	const useName = type.name.replace(/[\W_]+/g,'-').toLowerCase()
	const uselineHeight = lineHeight(type.lineHeight, type.fontSize);
	const useLetterSpacing = letterSpacing(baseFontSize, type.letterSpacing, type.fontSize);
	const useFontSize = pxToRem(baseFontSize, type.fontSize);
	const useFontFamily = `${type.fontName.family}`;
	const useFontWeightAndStyle = fontWeightStyle(type.fontName);

	const tmp = `.${useName} {
		font-size: ${useFontSize}rem;
		font-family: "${useFontFamily}";
		${uselineHeight ? `line-height: ${uselineHeight};` : ''}
		${useLetterSpacing ? `letter-spacing: ${useLetterSpacing}rem;` : ''}
		${useFontWeightAndStyle}
	}`;
	return beautifier(tmp);
};

class ProcessCss extends FigmaProcess {
	callback = async () => {
		const styles = figma.getLocalTextStyles();

		if (styles) {
			const allStyles = styles.map(style => {
				return {
					id: style.id,
					name: style.name,
					fontName: style.fontName,
					fontSize: style.fontSize,
					lineHeight: style.lineHeight,
					letterSpacing: style.letterSpacing,
					textCase: style.textCase,
				}
			});

			this.updateUI({
				type: 'nodes',
				textTypes: allStyles,
			});
		} else {
			return;
		}
	}
};

export const ProcessCssInstance = new ProcessCss('process-css');

type FontGroup = {
	[index: string]: string[]
};

class RenderNodes extends FigmaProcess {
	pageIdentifier: string = '[generated]';

	callback = async (msg: any) => {
		const {
			baseFontSize,
			sampleText,
		} = msg;

		this.setUpFonts(baseFontSize, sampleText)
			.then((errors) => {
				this.updateUI({
					type: 'nodes',
					errors,
				});
			});
	}

	/**
	 * Remove the generated page if name is the same.
	 */
	removeOldPage = () => {
		const pages = figma.root.children;
		pages.forEach((page) => {
			if (page.name.includes(this.pageIdentifier)) {
				// Cannot remove current page, so move user.
				if (figma.currentPage.id === page.id) {
					figma.currentPage = pages[0];
				}
				page.remove();
			}
		});
	}

	renderNodes = (styles: TextStyle[], baseFontSize: number, sampleText: string, fontGroups: FontGroup, missingFonts: string[]) => {
		console.log(missingFonts);
		// Cleans up old page.
		this.removeOldPage();
		// Create page.
		const page = figma.createPage();
		page.name = this.pageIdentifier;
		figma.currentPage = page;

		// Create frame.
		const frame = figma.createFrame();
		frame.resize(800, 800);
		frame.layoutMode = 'VERTICAL';
		frame.name = this.pageIdentifier;
		frame.paddingLeft = 24;
		frame.paddingRight = 24;
		frame.paddingTop = 24;
		frame.paddingBottom = 24;
		frame.itemSpacing = 16;
		page.appendChild(frame);

		// Create font groups.
		const fontGroupFrame = figma.createFrame();
		fontGroupFrame.layoutMode = 'VERTICAL';
		fontGroupFrame.itemSpacing = 8;

		// Base Font Size Title.
		const baseFontTitle = figma.createText();
		baseFontTitle.characters = `Base Font Size: ${baseFontSize}px`;
		baseFontTitle.fontName = { family: 'Roboto', style: 'Bold' };
		baseFontTitle.fontSize = 12;
		fontGroupFrame.appendChild(baseFontTitle);
		frame.appendChild(fontGroupFrame);

		// Font Group Title.
		const fontGroupTitle = figma.createText();
		fontGroupTitle.characters = 'List of All Fonts';
		fontGroupTitle.fontName = { family: 'Roboto', style: 'Bold' };
		fontGroupTitle.fontSize = 12;
		fontGroupFrame.appendChild(fontGroupTitle);
		frame.appendChild(fontGroupFrame);

		Object.entries(fontGroups).forEach(([family, styles]) => {
			// Create each font group.
			const parent = figma.createText();
			parent.characters = family;
			parent.fontName = { family: 'Roboto', style: 'Regular' };
			parent.fontSize = 12;
			fontGroupFrame.appendChild(parent);

			if (Array.isArray(styles)) {
				styles.forEach((style) => {
					const s = figma.createText();
					s.characters = style;
					s.fontName = { family: 'Roboto', style: 'Bold' };
					s.fontSize = 8;
					let sFill = clone(s.fills);
					// #7e7e7e
					sFill[0].color = {
						b: 0.4941176474094391,
						g: 0.4941176474094391,
						r: 0.4941176474094391,
					};
					s.fills = sFill;
					fontGroupFrame.appendChild(s);
				});
			}
		});

		// Resize top frame.
		fontGroupFrame.resize(600, fontGroupFrame.height + 24);
		
		// Sort
		const buckets = {
			default: [],
		};

		styles.forEach((style) => {
			const name = style.name.replace(' ', '').toLowerCase();
			const ind = name.indexOf('/');
			const sub = name.substring(0, ind);
			if (ind === -1) {
				buckets.default.push(style);
				return;
			}
			if (!buckets[sub]) {
				buckets[sub] = [style];
			} else {
				buckets[sub].push(style);
			}
		});

		// Iterate buckets.
		Object.entries(buckets).forEach(([key, styles]) => {
			// Outer frame.
			const o = figma.createFrame();
			o.layoutMode = 'VERTICAL';
			o.primaryAxisSizingMode = 'AUTO';
			o.counterAxisSizingMode = 'AUTO';
			o.itemSpacing = 8;

			// Text + CSS frame.
			const c = figma.createFrame();
			c.layoutMode = 'HORIZONTAL';
			c.primaryAxisSizingMode = 'AUTO';
			c.counterAxisSizingMode = 'AUTO';
			c.itemSpacing = 16;

			// Create bucket title.
			const title = figma.createText();
			title.characters = key.toUpperCase();
			title.fontSize = 14;
			let tFill = clone(title.fills);
			// #7e7e7e
			tFill[0].color = {
				b: 0.4941176474094391,
				g: 0.4941176474094391,
				r: 0.4941176474094391,
			};
			title.fills = tFill;
			title.fontName = { family: "Roboto", style: "Bold" };
			o.appendChild(title);

			// Create border.
			const l = figma.createLine();
			l.resize(752, 0);
			l.strokeWeight = 1;
			l.strokeAlign = 'INSIDE';
			l.strokeCap = 'ROUND';
			let lStrokes = clone(l.strokes);
			// #7e7e7e
			lStrokes[0].color = {
				b: 0.4941176474094391,
				g: 0.4941176474094391,
				r: 0.4941176474094391,
			};
			l.strokes = lStrokes;
			o.appendChild(l);

			// Sort by fontsize.
			const sortedStyles = styles.sort(uglySort);

			// Text frame.
			const i = figma.createFrame();
			i.layoutMode = 'VERTICAL';
			i.itemSpacing = 8;

			// CSS Frame.
			const t = figma.createFrame();
			t.layoutMode = 'VERTICAL';
			t.itemSpacing = 8;

			// Raw Frame.
			const r = figma.createFrame();
			r.layoutMode = 'VERTICAL';
			r.itemSpacing = 8;

			sortedStyles.map(style => {
				// Text sample.
				const tSample = figma.createText();
				let missingFlag = false;
				missingFonts.forEach((err) => {
					if (err.includes(style.fontName.family) && err.includes(style.fontName.style)) {
						missingFlag = true;
					}
				});
				if (!missingFlag) {
					tSample.characters = sampleText;
					tSample.textStyleId = style.id;
				} else {
					tSample.characters = `Missing Font: ${style.fontName.family} ${style.fontName.style}`;
				}
				i.appendChild(tSample);

				// CSS sample.
				const css = formatTypeCSS(style, baseFontSize);
				const cssNode = figma.createText();
				cssNode.characters = css;
				cssNode.fontSize = 8;
				cssNode.fontName = { family: "Menlo", style: "Regular" };
				t.appendChild(cssNode);

				// Raw sample.
				const styleDescTitle = figma.createText();
				styleDescTitle.characters = style.name;
				styleDescTitle.fontSize = 12;
				styleDescTitle.fontName = { family: "Roboto", style: "Bold" };
				let styleDescTitleFill = clone(styleDescTitle.fills);
				// #7e7e7e
				styleDescTitleFill[0].color = {
					b: 0.4941176474094391,
					g: 0.4941176474094391,
					r: 0.4941176474094391,
				};
				styleDescTitle.fills = styleDescTitleFill;
				r.appendChild(styleDescTitle);
				const styleDesc = figma.createText();
				styleDesc.characters =
				`Font Size: ${style.fontSize}px
Line Height: ${style.lineHeight.unit !== 'AUTO' ? style.lineHeight.value : 'normal'}${style.lineHeight.unit === 'PERCENT'? '%' : ''}${style.lineHeight.unit === 'PIXELS'? 'px' : ''}
Letter Spacing: ${style.letterSpacing.unit === 'PIXELS' ? `${style.letterSpacing.value}px` : `${style.letterSpacing.value}%`}
Text Case: ${style.textCase}
Font Name: ${style.fontName.family} ${style.fontName.style}`;
				styleDesc.fontSize = 8;
				styleDesc.fontName = { family: "Roboto", style: "Regular" };
				r.appendChild(styleDesc);
			});

			// Text frame append.
			i.resize(240, i.height);
			c.appendChild(i);

			// CSS frame append.
			t.resize(240, t.height);
			c.appendChild(t);

			// Raw frame append.
			r.resize(240, r.height);
			c.appendChild(r);

			// Append all.
			o.appendChild(c);
			frame.appendChild(o);
		});
	}

	/**
	 * Create the new page and all the nodes.
	 */
	setUpFonts = async (baseFontSize: number, sampleText: string) => {
		const styles = figma.getLocalTextStyles();

		// Get all fonts in styles.
		const allFonts = styles.map(style => style.fontName);
		let fontPromises = [];

		// Organize font groups.
		const fontGroups = {};
		allFonts.forEach((font) => {
			if (!fontGroups[font.family]) {
				fontGroups[font.family] = [];
			}
			if (fontGroups[font.family] && !fontGroups[font.family].includes(font.style)) {
				fontGroups[font.family].push(font.style);
				fontPromises.push(figma.loadFontAsync(font));
			}
		});

		const defFonts = [
			{ family: "Roboto", style: "Bold" },
			{ family: "Roboto", style: "Regular" },
			{ family: "Menlo", style: "Regular" }
		];
		fontPromises.push(...defFonts.map((font) => figma.loadFontAsync(font)));

		// Force Promise.all() to resolve all even if erroring.
		const errors = await Promise.all(fontPromises.map(p => p.catch((err: any) => err)))
			.then((resp) => {
				const missingFonts = resp.filter(r => typeof r === 'string' && r.length > 0);
				this.renderNodes(styles, baseFontSize, sampleText, fontGroups, missingFonts);
				return missingFonts;
			})
		// Return missing fonts to ui.
		return errors;
	}
};

export const RenderNodesInstance = new RenderNodes('render-type');
