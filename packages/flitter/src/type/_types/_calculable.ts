import Data from "./_data";
abstract class Calculable extends Data {
  plus(_other: Calculable): Calculable {
    throw Error("plus is not implemented");
  }

  minus(other: Calculable): Calculable {
    return this.plus(other.multiply(-1));
  }

  multiply(_value: number): Calculable {
    throw Error("multiply is not implemented");
  }
}

export default Calculable;
