import React from "react";
import { TextInput } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { colors } from "../util/colors";

export const InputText = ({ value, onChange, label }) => {
  return (
    <View style={styles.textWrapper}>
      <TextInput
        label={label}
        value={value}
        mode="flat"
        style={styles.text}
        onChangeText={(text) => onChange(text)}
        autoCompleteType={undefined}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  text: {
    backgroundColor: colors.white,
    width: "90%",
  },
  textWrapper: {
    flexDirection: "row",
    justifyContent: "center",
  },
});
