/**
 * Retrieve and process SVG from selected element.
 */
import Utf8ArrayToStr from './decodeUnit8';

const convertUnit8ToString = (value: Uint8Array): string => {
	return new TextDecoder("utf-8").decode(value);
};

const processSvg = {
	NAME: 'process-svg',
	CALLBACK: async (msg: any) => {
		console.log(msg);

		// Get selected element.
		const selectedElement = figma.currentPage.selection[0];

		if (selectedElement && 'exportAsync' in selectedElement) {
			// Set export settings.
			selectedElement.exportSettings = [{
				format: 'SVG',
				svgOutlineText: true,
				svgIdAttribute: true,
				svgSimplifyStroke: true,
			}];

			// Export SVG.
			const processed = await selectedElement.exportAsync();
			const svg = Utf8ArrayToStr(processed);

			figma.ui.postMessage({
				type: 'nodes',
				old: processed,
				svgString: svg,
			});
		} else {
			return;
		}
	}
};

export default processSvg;