import React, { useState, useEffect, memo } from "react";
import { View, StyleSheet, BackHandler } from "react-native";
import { colors } from "../util/colors";
import Header from "../components/Header";
import { Uploader } from "../components/Uploader";
import ProfileText from "../components/CommonText";
import Space from "../components/Space";
import { Fullscreen } from "../components/Fullscreen";
import { getLocal } from "../helper/logicHelper";

export default memo(function Profile({
  dp,
  back,
  myphone,
  name,
  edit,
  getProfilePic,
}) {
  const [fullscreen, setFullscreen] = useState(false);
  const [userName, setUserName] = useState(name);
  const backAction = () => {
    back(false);
    return true;
  };
  const getLocalName = async () => {
    const un = await getLocal("myname");
    setUserName(un);
  };
  useEffect(() => {
    if (!name) getLocalName();
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, []);

  return fullscreen ? (
    <Fullscreen back={setFullscreen} dp={dp} name={userName} />
  ) : (
    <View style={styles.container}>
      <Header text="Profile Settings" back={back} />
      <Space />
      <Uploader
        dp={dp}
        edit={edit}
        getProfilePic={getProfilePic}
        name={userName}
        showImg={setFullscreen}
      />
      <Space />
      <ProfileText title={userName} label="Name" />
      <Space />
      <ProfileText title={myphone} label="Phone" />
    </View>
  );
});

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
