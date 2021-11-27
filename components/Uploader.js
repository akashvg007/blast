import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { IconButton } from "react-native-paper";
import { links } from "../util/links";
import { colors } from "../util/colors";
import RBSheet from "react-native-raw-bottom-sheet";
import ProfileChangeOptions from "./ProfileChangeOption";

export const Uploader = ({ dp, edit = false, getProfilePic, showImg }) => {
  const [profileImg, setProfileImg] = useState(links.avatar);
  const refRBSheet = useRef();

  useEffect(() => {
    if (dp) setProfileImg(dp);
    else setProfileImg(links.avatar);
    getProfilePic();
  }, [dp, profileImg]);

  const pickImage = async () => {
    refRBSheet.current.open();
  };
  return (
    <View style={styles.imageContainer}>
      <TouchableOpacity onPress={(e) => showImg(true)}>
        <Image
          style={styles.image}
          source={{ uri: profileImg }}
          width={200}
          height={200}
        />
      </TouchableOpacity>
      {edit && (
        <View style={styles.iconWrapper}>
          <IconButton
            icon={"camera"}
            color={colors.white}
            size={30}
            onPress={pickImage}
            hasTVPreferredFocus={undefined}
            tvParallaxProperties={undefined}
          />
        </View>
      )}
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        height={200}
        customStyles={{
          wrapper: {
            backgroundColor: "transparent",
          },
          draggableIcon: {
            backgroundColor: "#000",
          },
        }}
      >
        <ProfileChangeOptions setDp={setProfileImg} />
      </RBSheet>
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
    right: 90,
    bottom: 18,
    height: 54,
    width: 54,
    backgroundColor: colors.bggreen,
    borderRadius: 27,
  },
  image: {
    width: 220,
    height: 220,
    borderRadius: 110,
  },
});
