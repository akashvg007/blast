import React from "react";
import { View, StyleSheet, Image, Text, TouchableOpacity } from "react-native";
import { Avatar } from "react-native-paper";
import { colors } from "../util/colors";
import { spaces } from "../util/spaces";
import { FontAwesome5 } from "@expo/vector-icons";

export default function AvatarGrp({ data, color, size }) {
  return (
    <View style={styles.row}>
      {data.map(({ label, icon, click }, idx) => (
        <View key={idx} style={styles.group}>
          <TouchableOpacity style={styles.group} onPress={click}>
            <Avatar.Icon
              size={size}
              style={styles.avatar}
              icon={() => (
                <FontAwesome5 name={icon} size={size / 2.5} color={color} />
              )}
            />
            <Text style={styles.label}>{label}</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    flexWrap: "nowrap",
    color: colors.fnShade,
    fontSize: spaces.md,
    width: 70,
    textAlign: "center",
  },
  group: {
    alignItems: "center",
    width: "100%",
    marginLeft: 30,
    marginRight: 30,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingLeft: 70,
    paddingRight: 70,
  },
  avatar: {
    backgroundColor: "#eb5b02",
  },
});
