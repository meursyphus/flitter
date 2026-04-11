type OmitPrivateAndProtected<T> = {
  [P in keyof T]: T[P];
};

function classToFunction<V extends new (...args: any[]) => any>(Clazz: V) {
  return (...args: ConstructorParameters<V>) =>
    new Clazz(...args) satisfies OmitPrivateAndProtected<InstanceType<V>>;
}
export default classToFunction;
