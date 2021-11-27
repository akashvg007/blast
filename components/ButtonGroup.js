import React from "react";
import { View, StyleSheet } from "react-native";
import RoundedButton from "../components/RoundedButton";

export const ButtonGrp = ({ data = [] }) => {
  return (
    <View style={styles.btnGrp}>
      {data.map(({ title, press }, idx) => (
        <RoundedButton key={idx} title={title} handlePress={press} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  btnGrp: {
    flex: 0.2,
    flexDirection: "row",
  },
});
