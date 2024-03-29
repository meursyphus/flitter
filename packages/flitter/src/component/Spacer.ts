import Expanded from "./Expanded";
import SizedBox from "./SizedBox";

function Spacer({ flex, key }: { flex?: number; key?: any } = {}) {
  return Expanded({
    flex,
    key,
    child: SizedBox.shrink(),
  });
}

export default Spacer;
