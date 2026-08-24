import React from "react";
import { TextInput } from "react-native";
import { styles } from "./styles";
import { InputProps } from "./types";

export default function InputAndroid(props: InputProps) {
  return (
    <TextInput
      style={[styles.input, { borderRadius: 6 }]}
      placeholderTextColor="#999"
      underlineColorAndroid="transparent"
      {...props}
    />
  );
}