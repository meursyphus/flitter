import { DiagramController } from '../../controller';
import { BuildContext, Provider, type Widget } from '@meursyphus/flitter';

const KEY = Symbol('DiagramMetaProvider');

function DiagramControllerProvider({ child }: { child: Widget }) {
	return Provider({
		value: new DiagramController(),
		providerKey: KEY,
		child
	});
}

function of(context: BuildContext) {
	return Provider.of(KEY, context) as DiagramController;
}

DiagramControllerProvider.of = of;

export default DiagramControllerProvider;
