import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, ScrollView, BackHandler } from "react-native";
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
import ChatMessage from "../components/ChatMessage";

export default function ChatScreen({
  photo,
  name,
  contact,
  handleBack,
  getProfilePic,
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
        getProfilePic={getProfilePic}
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
        style={styles.scroll}
        ref={scrollViewRef}
        onContentSizeChange={scrollDown}
      >
        <ChatMessage myphone={myphone} localData={localData} />
      </ScrollView>
      <ChatInput text={textInput} setText={setTextInput} send={handleSend} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    color: colors.black,
    width: "100%",
  },
  scroll: {
    backgroundColor: colors.chatBg,
  },
});
