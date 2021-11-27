import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import { colors } from "../util/colors";
import Header from "../components/Header";
import { Uploader } from "../components/Uploader";
import ProfileText from "../components/CommonText";
import Space from "../components/Space";

export default function Profile({ dp, back, myphone, name = "user", edit }) {
  return (
    <View style={styles.container}>
      <Header text="Profile Settings" back={back} />
      <Space />
      <Uploader dp={dp} edit={edit} />
      <Space />
      <ProfileText title={name} label="Name" />
      <Space />
      <ProfileText title={myphone} label="Phone" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.profileBg,
    width: "100%",
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
