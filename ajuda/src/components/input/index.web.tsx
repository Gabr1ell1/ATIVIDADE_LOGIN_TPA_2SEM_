import React from "react";
import { TextInput } from "react-native";
import { styles } from "./styles";

import { InputProps } from "./types";

export default function InputWeb(props: InputProps) {  return (
    <TextInput
      style={[styles.input, { borderRadius: 4 }]}
      placeholderTextColor="#666"
      {...props}
    />
  );
}