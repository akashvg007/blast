import React from "react";
import { TextInput } from "react-native-paper";

export const InputText = ({ value, onChange, label }) => {
  return (
    <TextInput
      label={label}
      value={value}
      mode="flat"
      onChangeText={(text) => onChange(text)}
      autoCompleteType={undefined}
    />
  );
};
