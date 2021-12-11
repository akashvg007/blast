import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { ActivityIndicator, IconButton } from "react-native-paper";
import { links } from "../util/links";
import { colors } from "../util/colors";
import RBSheet from "react-native-raw-bottom-sheet";
import ProfileChangeOptions from "./ProfileChangeOption";
import PopupSheet from "./PopupSheet/PopupSheet";

export const Uploader = ({ dp, edit = false, getProfilePic, showImg }) => {
  const [profileImg, setProfileImg] = useState(links.avatar);
  const [loader, setLoader] = useState(false);
  const [open, setOpen] = useState(false);
  // const refRBSheet = useRef();

  useEffect(() => {
    if (dp) setProfileImg(dp);
    else setProfileImg(links.avatar);
  }, [dp]);

  useEffect(() => {
    getProfilePic();
  }, [profileImg]);

  const pickImage = async () => {
    setOpen(!open);
  };
  return (
    <View style={styles.imageContainer}>
      <TouchableOpacity onPress={(e) => showImg(true)}>
        {loader ? (
          <ActivityIndicator size={100} color={colors.prgreen} />
        ) : (
          <Image
            style={styles.image}
            source={{ uri: profileImg }}
            width={200}
            height={200}
          />
        )}
      </TouchableOpacity>
      {edit && (
        <View style={styles.iconWrapper}>
          <IconButton
            icon={"camera"}
            color={colors.white}
            size={30}
            style={styles.iconbutton}
            onPress={pickImage}
            hasTVPreferredFocus={undefined}
            tvParallaxProperties={undefined}
          />
        </View>
      )}
      <PopupSheet open={open} setOpen={setOpen}>
        <ProfileChangeOptions setDp={setProfileImg} setLoader={setLoader} />
      </PopupSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    height: 250,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    backgroundColor: colors.white,
  },
  iconWrapper: {
    position: "absolute",
    right: 95,
    bottom: 28,
    height: 50,
    width: 50,
    backgroundColor: colors.bggreen,
    borderRadius: 25,
  },
  iconbutton: {
    position: "absolute",
    right: -4,
    bottom: -4,
  },
  image: {
    width: 220,
    height: 220,
    borderRadius: 110,
  },
});
