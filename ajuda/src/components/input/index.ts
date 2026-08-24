import { Platform } from "react-native";
import { InputProps } from "./types";

import InputIOS from "./index.ios";
import InputAndroid from "./index.android";
import InputWeb from "./index.web";

const InputImplementation = Platform.select({
  ios: InputIOS,
  android: InputAndroid,
  web: InputWeb,
  default: InputWeb,
}) as React.FC<InputProps>;

export { InputImplementation as Input };
export * from "./types";