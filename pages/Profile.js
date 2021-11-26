import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import { colors } from "../util/colors";
import { spaces } from "../util/spaces";
import Header from "../components/Header";

export default function Profile({ dp, back, myphone, name }) {
  const [profileImg, setProfileImg] = useState(null);

  useEffect(() => {
    setProfileImg(dp);
  }, [dp]);

  return (
    <View style={styles.container}>
      <Header text="Profile Settings" back={back} />
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
});
