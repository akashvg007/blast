import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import { colors } from "../util/colors";
import { IconButton } from "react-native-paper";
import { spaces } from "../util/spaces";

export default function Profile({ dp, back, myphone, name }) {
  const [profileImg, setProfileImg] = useState(null);

  useEffect(() => {
    setProfileImg(dp);
  }, [dp]);

  return (
    <View style={styles.container}>
      <View style={styles.headingRow}>
        <IconButton
          icon={(prop) => <Image source={require("../assets/arrowLT.png")} />}
          size={20}
          onPress={(e) => back(false)}
          hasTVPreferredFocus={undefined}
          tvParallaxProperties={undefined}
        />
        <Text style={styles.headingText}>Profile Settings</Text>
      </View>
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={{ uri: profileImg }}
          width={200}
          height={200}
        />
      </View>
      <Text style={styles.details}>{myphone}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    width: "100%",
  },
  details: {
    textAlign: "center",
    fontSize: spaces.md,
  },
  imageContainer: {
    height: 250,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    borderRadius: 100,
  },
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
