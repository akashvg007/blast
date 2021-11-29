import React from "react";
import { View, Text, StyleSheet } from "react-native";
import moment, { fn } from "moment";
import { colors } from "../util/colors";
import { spaces } from "../util/spaces";
import { Ionicons } from "@expo/vector-icons";

export default function ChatMessage({ chat, lastTime, myphone, next, online }) {
  // console.log("lastTime", moment(lastTime).format("LT"), localData[0].time);
  // console.log("lastTime", lastTime, localData[0].time);

  const date = moment(chat.time).format("MMM Do YY");
  const curr = moment(chat.time).format("MMM Do YY");
  let prev = "";
  const rt = chat.rt || chat.time;
  // console.log("rt::lt", rt, lastTime);

  if (next) prev = moment(next.time).format("MMM Do YY");
  const showDate = () => {
    const compareString = curr.localeCompare(prev);
    if (compareString !== 0) {
      return (
        <View style={styles.chatDate}>
          <Text style={styles.dateWrapper}>{date}</Text>
        </View>
      );
    }
  };
  return (
    <View style={styles.chatContainer}>
      {showDate()}
      <View
        style={[
          styles.chatRegion,
          chat.from === myphone ? styles.rightSide : styles.leftSide,
        ]}
      >
        <View
          style={[
            styles.chat,
            chat.from === myphone ? styles.rightChat : styles.leftChat,
          ]}
        >
          <Text style={styles.message}>{chat.msg}</Text>
          <Text
            style={[
              styles.time,
              chat.from === myphone ? styles.rightTime : styles.leftTime,
            ]}
          >
            {moment(chat.time).format("LT")}
            {chat.from == myphone && (
              <Ionicons
                name={`checkmark-done`}
                size={18}
                color={rt <= lastTime ? colors.bluetick : colors.fnShade}
              />
            )}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chatContainer: {
    flexGrow: 1,
    width: "100%",
  },
  chatRegion: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    width: "100%",
    flexDirection: "row",
  },
  rightSide: {
    justifyContent: "flex-end",
  },
  leftSide: {
    justifyContent: "flex-start",
  },
  chat: {
    padding: 10,
    alignItems: "baseline",
    borderRadius: 20,
    maxWidth: "90%",
    lineHeight: 1.5,
  },
  leftChat: {
    backgroundColor: colors.white,
  },
  rightChat: {
    backgroundColor: colors.prchatbg,
  },
  rightTime: {
    textAlign: "right",
    width: "100%",
  },
  leftTime: {
    width: "100%",
    textAlign: "left",
  },
  dateWrapper: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
    fontSize: 16,
    backgroundColor: colors.lightblue,
    borderRadius: 7.5,
  },
  message: {
    padding: 5,
    fontSize: 16,
    borderRadius: 7.5,
  },
  time: {
    fontSize: spaces.xsm,
    paddingLeft: 5,
  },
  chatDate: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
    color: colors.black,
    width: "100%",
  },
});
