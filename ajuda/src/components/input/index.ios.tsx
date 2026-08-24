import React from "react";
import { TextInput } from "react-native";
import { styles } from "./styles";

import { InputProps } from "./types";

export default function InputIOS(props: InputProps) {  return (
    <TextInput
      style={[styles.input, { borderRadius: 12 }]}
      placeholderTextColor="#8E8E93"
      {...props}
    />
  );
}