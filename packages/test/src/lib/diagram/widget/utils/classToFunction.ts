/* eslint-disable @typescript-eslint/no-explicit-any */
function classToFunction<V extends new (...arr: any[]) => any>(Clazz: V) {
	return (...arr: ConstructorParameters<V>) => new Clazz(...arr) as InstanceType<V>;
}

export default classToFunction;
