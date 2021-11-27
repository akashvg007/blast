import React, { useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import { colors } from "../util/colors";
import { spaces } from "../util/spaces";
import AvatarGrp from "./Avatar";
import { uploadImages, removePhoto } from "../api/service";
import * as ImagePicker from "expo-image-picker";

export default function ProfileChangeOptions({ setDp }) {
  const uploadToServer = async (resp) => {
    if (!resp.cancelled) {
      const { uri } = resp;
      const body = new FormData();
      body.append("file", uri);
      await uploadImages(body);
      setDp(uri);
    }
  };
  const handleGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0.9,
    });
    uploadToServer(result);
  };

  const handleRemove = async () => {
    setDp(null);
    const result = await removePhoto();
    console.log("result", result);
  };

  const handleCamera = async () => {
    const access = await ImagePicker.requestCameraPermissionsAsync();
    console.log("access", access);
    if (!access.granted) return;
    const options = {
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0.9,
    };
    const result = await ImagePicker.launchCameraAsync(options);
    uploadToServer(result);
  };
  const data = [
    { icon: "trash", label: "Remove Photo", click: handleRemove },
    { icon: "image", label: "Gallery", click: handleGallery },
    { icon: "camera", label: "Camera", click: handleCamera },
  ];
  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    })();
  }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Profile Photo</Text>
      <View style={styles.row}>
        <AvatarGrp data={data} color={colors.white} size={spaces.xxxl} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "90%",
  },
  text: {
    color: colors.black,
    fontSize: spaces.md,
    paddingLeft: spaces.lg,
    paddingBottom: spaces.md,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  avatar: {
    backgroundColor: "#eb5b02",
  },
});
