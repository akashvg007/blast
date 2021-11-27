import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { spaces } from "../util/spaces";
import { colors } from "../util/colors";

export default function ProfileText({ title, label = "Name" }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.text}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: spaces.md,
    padding: spaces.sm,
    paddingLeft: spaces.xl,
    color: colors.fnShade,
  },
  label: {
    fontSize: spaces.sm,
    color: colors.fngreen,
  },
  row: {
    paddingLeft: spaces.xxl,
    width: "100%",
    backgroundColor: colors.white,
    paddingTop: spaces.md,
  },
});
