class FigmaProcess {
	name: string;

	constructor(name: string) {
		this.name = name;
	}

	getName(): string {
		return this.name;
	}

	updateUI(msg: any) {
		figma.ui.postMessage(msg);
	}
}

export default FigmaProcess;

/**
 * https://www.figma.com/plugin-docs/editing-properties/
 */
export function clone(val: any) {
  const type = typeof val
  if (val === null) {
    return null
  } else if (type === 'undefined' || type === 'number' ||
             type === 'string' || type === 'boolean') {
    return val
  } else if (type === 'object') {
    if (val instanceof Array) {
      return val.map(x => clone(x))
    } else if (val instanceof Uint8Array) {
      return new Uint8Array(val)
    } else {
      let o = {}
      for (const key in val) {
        o[key] = clone(val[key])
      }
      return o
    }
  }
  throw 'unknown'
}

/**
 * Copy to clip.
 */
export const copyToClipboard = (stateFunc: Function, ref: any) => {
		ref.current.select();
		document.execCommand('copy');
		stateFunc(true);
		setTimeout(() => {
			stateFunc(false);
		}, 2000);
	};
