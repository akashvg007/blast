import React, { useEffect } from "react";
import { View, StyleSheet, Image, BackHandler } from "react-native";
import { colors } from "../util/colors";
import Header from "./Header";

export const Fullscreen = ({ dp, back, name, type = "bool" }) => {
  const backAction = () => {
    if (type != "bool") back({});
    else back(false);
    return true;
  };
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, []);

  return (
    <View style={styles.container}>
      <Header text={name} back={back} />
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={{ uri: dp }} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: "85%",
  },
  image: {
    width: "100%",
    height: "100%",
    minHeight: 400,
    minWidth: 400,
  },
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
});
