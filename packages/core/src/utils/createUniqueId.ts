let id = 1;
export default function createUniqueId(): string {
  return (id++).toString();
}
