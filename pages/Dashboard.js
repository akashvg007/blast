import React, { useState, useRef, useEffect, memo } from "react";
import Constants from "expo-constants";
import { View, StyleSheet, Platform } from "react-native";
import ChatScreen from "./ChatScreen";
import { colors } from "../util/colors";
import ChatList from "./ChatList";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const registerForPushNotificationsAsync = async () => {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#c4c4cc",
    });
  }
  return token;
};

export default memo(function Dashboard({
  list = {},
  contact = {},
  profiles,
  myphone,
  getProfilePic,
  ...props
}) {
  const [currentUser, setCurrentUser] = useState("");
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("notification received", response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);
  return (
    <View style={styles.container}>
      {currentUser != "" ? (
        <ChatScreen
          {...props}
          photo={profiles[currentUser]}
          handleBack={setCurrentUser}
          name={currentUser}
          contact={contact[currentUser]}
          getProfilePic={getProfilePic}
        />
      ) : (
        <ChatList
          getProfilePic={getProfilePic}
          myphone={myphone}
          setCurrentUser={setCurrentUser}
          list={list}
          contact={contact}
          profiles={profiles}
        />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    color: "#000",
    width: "100%",
  },
});
