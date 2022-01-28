/**
 * Handle action routing based on message type.
 */
import { ProcessCssInstance, RenderNodesInstance } from './process-css';

/**
 * Add Actions Here.
 */
export const ACTIONS = [
	RenderNodesInstance,
	ProcessCssInstance,
];

/**
 * Expected msg to recieve from ui.
 */
export interface Message {
	type: string;
	baseFontSize?: number;
	smapleText?: string;
}

/**
 * Handle message delegation.
 */
const router = (msg: Message) => {
	if (!msg.hasOwnProperty('type')) {
    console.log('Message type missing.');
  }

	ACTIONS.forEach(action => {
		if (action.getName() == msg.type) {
			action.callback(msg);
		}
	});
};

export default router;