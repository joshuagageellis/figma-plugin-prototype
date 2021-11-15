/**
 * Fetch selection's children and return them to the UI.
 */
import { traverseRecursive } from '../helpers/recursive';
const fetchSelection = {
    NAME: 'fetch-selection',
    CALLBACK: (msg) => {
        console.log(msg);
        const nodes = figma.currentPage.selection;
        traverseRecursive(nodes, (n, i) => {
            console.log(n.name);
            if (n.type === "FRAME") {
                console.log(n.children);
            }
        });
        figma.ui.postMessage({
            type: 'nodes',
            nodes: nodes,
        });
    }
};
export default fetchSelection;
