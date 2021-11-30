import React from "react";
import { Text, View, StyleSheet, Image } from "react-native";
import RoundedButton from "../components/RoundedButton";
import { spaces } from "../util/spaces";

export default ({ onAgree }) => {
  const handlePress = (e) => {
    onAgree(true);
  };
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.text}>Welcome to Blast</Text>
      </View>
      <View>
        <Image
          style={styles.frontLogo}
          source={{
            uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuORDCVH4qLJJqBfKFc4DWSyols71jWmNuNg&usqp=CAU",
          }}
        />
      </View>
      <View style={styles.btnGrp}>
        <RoundedButton title="AGREE AND CONTINUE" handlePress={handlePress} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: spaces.md,
  },
  btnGrp: {
    flexDirection: "row",
  },
  frontLogo: {
    width: 250,
    height: 250,
  },
  text: {
    justifyContent: "center",
    fontSize: spaces.xl,
    fontWeight: "bold",
  },
});
