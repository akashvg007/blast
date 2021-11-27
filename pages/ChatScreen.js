import React, { useState, useEffect, useRef } from "react";
import { Text, View, StyleSheet, ScrollView, BackHandler } from "react-native";
import moment from "moment";
import { getLastSeen } from "../api/service";
import { getLocal } from "../helper/logicHelper";
import { colors } from "../util/colors";
import { useSocket } from "../context/SocketProvider";
import {
  addToMessage,
  getChatsFromLocal,
  getUpdatedMessage,
} from "../helper/logicHelper";
import Profile from "./Profile";
import { links } from "../util/links";
import ChatHeader from "../components/ChatHeader";
import ChatInput from "../components/ChatInput";
import { spaces } from "../util/spaces";

export default function ChatScreen({
  photo,
  name,
  contact,
  handleBack,
  ...props
}) {
  const [myphone, setMyPhone] = useState("");
  const [textInput, setTextInput] = useState("");
  const [localData, setLocalData] = useState([]);
  const [online, setOnline] = useState("offline");
  const [lastSeen, SetLastSeen] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const socket = useSocket();

  const scrollViewRef = useRef(null);
  const scrollDown = () =>
    scrollViewRef.current.scrollToEnd({ animated: true });

  let DP = links.avatar;
  if (photo) DP = photo;

  let contactName = contact || name;
  if (!contact && name === "+918848275018") contactName = "Admin";

  const handleSend = async () => {
    if (!textInput || textInput === "") return;
    socket.emit("send-message", { recipient: name, text: textInput });
    await addToMessage({
      recipient: name,
      text: textInput,
      sender: myphone,
      status: 1,
    });
    const data = await getUpdatedMessage(name);
    setLocalData(data);
    setTextInput("");
  };
  const handleReceive = async (msgObj) => {
    await addToMessage(msgObj);
    const data = await getUpdatedMessage(name);
    setLocalData(data);
  };
  const backAction = () => {
    handleBack("");
    return true;
  };
  const getLocalChat = async () => {
    await getChatsFromLocal();
    props.getNew();
  };
  async function handleLastSeen() {
    const result = await getLastSeen({ phone: name });
    if (!result) return;
    const time = result[0]?.lastseen;
    if (!time) return;
    const date = moment(time).calendar();
    SetLastSeen(date);
  }

  const checkOnline = async ({ ids, status }) => {
    if (ids && Array.isArray(ids) && ids.length && status == 1) {
      if (ids.includes(name)) {
        if (online != "online") setOnline("online");
      } else setOnline("offline");
    } else {
      setOnline("offline");
    }
  };
  useEffect(() => {
    handleLastSeen();
  }, [name, online]);
  useEffect(() => {
    if (socket == null) return;
    socket.on("online", checkOnline);
    socket.on("offline", checkOnline);
  }, [socket, checkOnline]);

  useEffect(() => {
    getLocal("myphone").then((phone) => {
      setMyPhone(phone);
      getLocalChat();
    });
    if (socket == null) return;
    socket.on("receive-message", handleReceive);
    getUpdatedMessage(name).then((data) => setLocalData(data));
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, []);

  const handleProfile = () => {
    setShowProfile(true);
  };
  if (showProfile) {
    return (
      <Profile
        dp={DP}
        myphone={name}
        name={contactName}
        back={setShowProfile}
      />
    );
  }

  return (
    <View style={styles.container}>
      <ChatHeader
        DP={DP}
        back={backAction}
        profile={handleProfile}
        online={online}
        name={contactName}
        lastSeen={lastSeen}
      />
      <ScrollView
        style={{ backgroundColor: colors.chatBg }}
        ref={scrollViewRef}
        onContentSizeChange={scrollDown}
      >
        <View style={{ flexDirection: "column-reverse" }}>
          {localData &&
            localData?.map((chat, idx) => {
              const date = moment(chat.time).format("MMM Do YY");
              const curr = moment(chat.time).format("MMM Do YY");
              let prev = "";
              if (localData[idx + 1])
                prev = moment(localData[idx + 1].time).format("MMM Do YY");
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
                <View key={idx} style={styles.chatContainer}>
                  {showDate()}
                  <View
                    style={[
                      styles.chatRegion,
                      chat.from === myphone
                        ? styles.rightSide
                        : styles.leftSide,
                    ]}
                  >
                    <View
                      style={[
                        styles.chat,
                        chat.from === myphone
                          ? styles.rightChat
                          : styles.leftChat,
                      ]}
                    >
                      <Text style={styles.message}>{chat.msg}</Text>

                      <Text
                        style={[
                          styles.time,
                          chat.from === myphone
                            ? styles.rightTime
                            : styles.leftTime,
                        ]}
                      >
                        {moment(chat.time).format("LT")}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
        </View>
      </ScrollView>
      <ChatInput text={textInput} setText={setTextInput} send={handleSend} />
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
