import React from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import { colors } from "../util/colors";
import { spaces } from "../util/spaces";
import { IconButton } from "react-native-paper";

export default function ChatHeader({
  DP,
  back,
  profile,
  online,
  name,
  lastSeen,
}) {
  return (
    <View style={styles.heading}>
      <View style={styles.hleft}>
        <IconButton
          icon={(prop) => <Image source={require("../assets/arrowLT.png")} />}
          size={20}
          onPress={back}
          hasTVPreferredFocus={undefined}
          tvParallaxProperties={undefined}
        />
        <TouchableOpacity onPress={profile}>
          <Image source={{ uri: DP }} style={styles.dp} />
        </TouchableOpacity>
        <View style={styles.nameSection}>
          <Text onPress={profile} style={styles.headingText}>
            {name}
          </Text>
          <Text style={styles.online}>
            {online == "online" ? online : lastSeen}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hleft: {
    width: "60%",
    flexDirection: "row",
  },
  hright: {
    width: "40%",
  },
  heading: {
    backgroundColor: colors.bggreen,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    height: 50,
    alignItems: "center",
    paddingLeft: 5,
  },
  dp: {
    borderRadius: 20,
    width: 40,
    height: 40,
  },
  nameSection: {
    paddingLeft: spaces.sm,
  },
  headingText: {
    fontSize: spaces.md,
    color: colors.white,
  },
  online: {
    fontSize: spaces.xsm,
    color: colors.white,
  },
});
