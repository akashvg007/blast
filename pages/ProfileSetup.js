import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import { colors } from "../util/colors";
import { InputText } from "../components/InputText";
import { links } from "../util/links";
import Header from "../components/Header";

export default function ProfileSetup({ dp }) {
  const [profileImg, setProfileImg] = useState(links.avatar);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    console.log("dp", dp);

    if (dp) setProfileImg(dp);
  }, [dp]);
  console.log("profile", profileImg);

  return (
    <View style={styles.container}>
      <Header text="Profile" />
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={{ uri: profileImg }}
          width={200}
          height={200}
        />
      </View>
      <InputText label="Name" value={userName} onChange={setUserName} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    width: "100%",
  },
  imageContainer: {
    backgroundColor: "red",
    height: 250,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    backgroundColor: "green",
    borderRadius: 100,
  },
});
