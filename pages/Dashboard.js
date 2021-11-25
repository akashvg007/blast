import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import ChatScreen from "./ChatScreen";
import { colors } from "../util/colors";
import ChatList from "./ChatList";

export default function Dashboard({
  list = {},
  contact = {},
  profiles,
  myphone,
  ...props
}) {
  const [currentUser, setCurrentUser] = useState("");
  return (
    <View style={styles.container}>
      {currentUser != "" ? (
        <ChatScreen
          {...props}
          photo={profiles[currentUser]}
          handleBack={setCurrentUser}
          name={currentUser}
          contact={contact[currentUser]}
        />
      ) : (
        <ChatList
          myphone={myphone}
          setCurrentUser={setCurrentUser}
          list={list}
          contact={contact}
          profiles={profiles}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    color: "#000",
    width: "100%",
  },
});
