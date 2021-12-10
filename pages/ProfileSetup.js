import React, { memo, useState } from "react";
import { View, StyleSheet } from "react-native";
import { colors } from "../util/colors";
import { InputText } from "../components/InputText";
import Header from "../components/Header";
import { ButtonGrp } from "../components/ButtonGroup";
import { Uploader } from "../components/Uploader";
import { updateName } from "../api/service";
import { setLocal } from "../helper/logicHelper";

export default memo(function ProfileSetup({
  dp,
  setValues,
  phone,
  getProfilePic,
}) {
  const [name, setName] = useState("");

  const handlePress = async () => {
    if (name === "") return;
    await updateName({ name, phone });
    await setLocal("myname", name);
    setValues(true);
  };
  const btns = [
    // { title: "SKIP", press: () => setValues(true) },
    { title: "NEXT", press: handlePress },
  ];

  return (
    <View style={styles.container}>
      <Header text="Profile" />
      <Uploader dp={dp} getProfilePic={getProfilePic} name={name} edit={true} />
      <InputText label="Enter Your Name" value={name} onChange={setName} />
      <ButtonGrp data={btns} />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    width: "100%",
  },
});
