/**
 * Handle action routing based on message type.
 */
import fetchSelection from './fetch-selection';

/**
 * Add Actions Here.
 */
export const ACTIONS = [
	fetchSelection,
];

/**
 * Expected msg to recieve from ui.
 */
export interface Message {
	type: string;
}

/**
 * Handle message delegation.
 */
const router = (msg: Message) => {
	if (!msg.hasOwnProperty('type')) {
    console.log('Message type missing.');
  }

	ACTIONS.forEach(action => {
		if (action.NAME == msg.type) {
			action.CALLBACK(msg);
		}
	});
};

export default router;