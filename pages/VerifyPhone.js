import React, { useState } from "react";
import { Text, View, StyleSheet, TextInput } from "react-native";
import { spaces } from "../util/spaces";
import { registerUser } from "../api/service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ButtonGrp } from "../components/ButtonGroup";

export default ({ setOtpSend, setAgree }) => {
  const [number, setNumber] = useState("");

  const handlePress = async () => {
    try {
      const phone = "+91" + number;
      await registerUser({ phone });
      await AsyncStorage.setItem("myphone", phone);
      setOtpSend(true);
    } catch (err) {
      //console.log('something went wrong')
    }
  };

  const handleBack = () => {
    setAgree(false);
  };

  const btns = [
    { title: "BACK", press: handleBack },
    { title: "SEND", press: handlePress },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Text style={styles.heading}>{"Verify your phone number"}</Text>
      </View>
      <View style={styles.mainContainer}>
        <Text style={styles.text}>
          Blast will send an SMS message to verify your phone number.Enter your
          country code and phone number.
        </Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            onChangeText={setNumber}
            placeholder="eg:9946578205"
            keyboardType="numeric"
            value={number}
          />
        </View>
      </View>
      <ButtonGrp data={btns} />
    </View>
  );
};

const styles = StyleSheet.create({
  top: {
    flex: 0.2,
    alignItems: "flex-start",
  },
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
  },
  inputWrapper: {
    flexDirection: "row",
  },
  heading: {
    justifyContent: "center",
    fontSize: spaces.xl,
    fontWeight: "bold",
  },
  mainContainer: {
    flex: 0.6,
    fontSize: spaces.md,
    textAlign: "left",
    height: 100,
    alignItems: "center",
  },
  text: {
    fontSize: spaces.md,
    padding: 10,
  },
});
