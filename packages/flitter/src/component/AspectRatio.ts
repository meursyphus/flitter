import _AspectRatio from "./base/BaseAspectRatio";
function AspectRatio(...props: ConstructorParameters<typeof _AspectRatio>) {
  return new _AspectRatio(...props);
}

export default AspectRatio;
