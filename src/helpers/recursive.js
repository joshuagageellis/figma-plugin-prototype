/**
 * Recursive helper functions.
 *
 * Remember figma helper funcs first:
 * findAll() and findChildren()
 */
/**
 * Simply traverses the tree of nodes and calls the callback on each node.
 * @param {readonly SceneNode[]} nodes The nodes to traverse.
 * @param {Function} callback The callback to call on each node.
 *
 */
export const traverseRecursive = (node, cb) => {
    let i = 0;
    const r = (n) => {
        i++;
        if (typeof cb === 'function') {
            cb(n, i);
        }
        if (!n.children) {
            return;
        }
        n.children.forEach(r);
    };
    r(node[0]);
};
