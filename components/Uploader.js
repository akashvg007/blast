import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image } from "react-native";
import { IconButton } from "react-native-paper";
import { links } from "../util/links";
import * as ImagePicker from "expo-image-picker";
import { uploadImages } from "../api/service";
import { colors } from "../util/colors";

export const Uploader = ({ dp, edit = false }) => {
  const [profileImg, setProfileImg] = useState(links.avatar);

  useEffect(() => {
    if (dp) setProfileImg(dp);
  }, [dp]);

  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0.9,
    });
    if (!result.cancelled) {
      const { uri } = result;
      const body = new FormData();
      body.append("file", uri);
      await uploadImages(body);
      setProfileImg(uri);
    }
  };
  return (
    <View style={styles.imageContainer}>
      <Image
        style={styles.image}
        source={{ uri: profileImg }}
        width={200}
        height={200}
      />
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
