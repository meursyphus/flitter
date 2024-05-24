import { BuildContext, Provider, type Widget } from '@meursyphus/flitter';
import { EventManager } from '../../event';

const KEY = Symbol('EventManagerProvider');

function EventManagerProvider({ child }: { child: Widget }) {
	return Provider({
		providerKey: KEY,
		child,
		value: new EventManager()
	});
}

function of(context: BuildContext) {
	return Provider.of(KEY, context) as EventManager;
}

EventManagerProvider.of = of;

export default EventManagerProvider;
