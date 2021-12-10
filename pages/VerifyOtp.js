import React, { memo, useState } from "react";
import { View, StyleSheet, TextInput } from "react-native";
import { spaces } from "../util/spaces";
// import { countryList } from '../util/data';
import { verifyOTP } from "../api/service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  formateChats,
  getChatsFromLocal,
  getAllContacts,
  getLocal,
} from "../helper/logicHelper";
import { ButtonGrp } from "../components/ButtonGroup";

export default memo(({ setVerified }) => {
  const [otp, setOtp] = useState("");

  const getInitialDetails = async () => {
    await getChatsFromLocal();
    await formateChats();
    await getAllContacts();
    setVerified(true);
  };

  const handlePress = async () => {
    try {
      const no = await getLocal("myphone");
      const resp = await verifyOTP({ phone: no, otp });
      AsyncStorage.setItem("token", resp.accessToken);
      if (resp.accessToken) getInitialDetails();
    } catch (err) {
      console.log("something went wrong");
    }
  };

  const btns = [{ title: "VERIFY", press: handlePress }];

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          onChangeText={setOtp}
          placeholder="enter OTP"
          keyboardType="numeric"
          value={otp}
        />
      </View>
      <ButtonGrp data={btns} />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: spaces.xxxl,
    alignItems: "center",
    backgroundColor: "#fff",
    color: "#000",
  },
  input: {
    height: 40,
    margin: 12,
    width: "90%",
    borderWidth: 1,
    padding: 10,
    fontSize: 20,
  },
  inputWrapper: {
    flex: 0.8,
    flexDirection: "row",
  },
});
