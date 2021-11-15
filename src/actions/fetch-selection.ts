/**
 * Fetch selection's children and return them to the UI.
 */
import { traverseRecursive } from '../helpers/recursive';

const fetchSelection = {
	NAME: 'fetch-selection',
	CALLBACK: (msg: any) => {
		console.log(msg);
		const nodes = figma.currentPage.selection;

		traverseRecursive(nodes, (n, i) => {
			console.log(n);
		});
		
		figma.ui.postMessage({
				type: 'nodes',
				nodes: nodes,
		});
	}
};

export default fetchSelection;