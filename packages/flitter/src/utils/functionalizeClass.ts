function functionalizeClass<V extends new (...arr: any[]) => any>(Clazz: V) {
  return (...arr: ConstructorParameters<V>) =>
    new Clazz(...arr) as InstanceType<V>;
}

export default functionalizeClass;
