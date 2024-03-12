import _Align from "./base/BaseAlign";

export default function Align(...props: ConstructorParameters<typeof _Align>) {
  return new _Align(...props);
}
