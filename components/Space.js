import React from "react";
import { View } from "react-native";

export default function Space({ sp = 15 }) {
  return <View style={{ width: "100%", height: sp }} />;
}
