import React from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import { colors } from "../util/colors";
import { spaces } from "../util/spaces";
import { IconButton } from "react-native-paper";

export default function Header({ text, back = null }) {
  return (
    <View style={styles.headingRow}>
      {back && (
        <IconButton
          icon={(prop) => <Image source={require("../assets/arrowLT.png")} />}
          size={20}
          onPress={(e) => back(false)}
          hasTVPreferredFocus={undefined}
          tvParallaxProperties={undefined}
        />
      )}
      <Text style={styles.headingText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headingRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.bggreen,
    height: 60,
    width: "100%",
  },
  headingText: {
    fontSize: spaces.md,
    paddingLeft: spaces.md,
    color: colors.white,
  },
});
