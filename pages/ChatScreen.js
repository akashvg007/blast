import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, ScrollView, BackHandler } from "react-native";
import moment from "moment";
import { getLastSeen, updateStatus } from "../api/service";
import { getLocal, updateLocalChatStatusAll } from "../helper/logicHelper";
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
// import ChatInput from "../components/ChatInput";
import ChatMessage from "../components/ChatMessage";
import ChatInput from "../components/ChatInput2";

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
  const [reveicedmsgTime, setReceivedmsgTime] = useState(Date.now());
  const [showProfile, setShowProfile] = useState(false);
  const socket = useSocket();
  const [reply, setReply] = useState("");
  const [isLeft, setIsLeft] = useState();

  const swipeToReply = (message, isLeft) => {
    setReply(message.length > 50 ? message.slice(0, 50) + "..." : message);
    setIsLeft(isLeft);
  };

  const closeReply = () => {
    setReply("");
  };

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
    await addToMessage({ ...msgObj, rt: Date.now() });
    const data = await getUpdatedMessage(name);
    console.log("seen::emit", {
      receiver: name,
      time: Date.now(),
      sender: myphone,
    });

    socket.emit("statusUpdate", {
      receiver: name,
      time: Date.now(),
      sender: myphone,
    });
    setLocalData(data);
    console.log("update status");
    updateStatus(msgObj.sender);
  };
  const backAction = () => {
    handleBack("");
    return true;
  };
  async function handleLastSeen() {
    const result = await getLastSeen({ phone: name });
    if (!result) return;
    const time = result[0]?.lastseen;
    if (!time) return;
    const date = moment(time).calendar();
    SetLastSeen(date);
  }
  // console.log("last msg", reveicedmsgTime);

  const checkOnline = async ({ ids, status }) => {
    if (ids && Array.isArray(ids) && ids.length && status == 1) {
      if (ids.includes(name)) {
        if (online != "online") setOnline("online");
      } else setOnline("offline");
    } else {
      setOnline("offline");
    }
  };
  const lastStatusUpdateTime = ({ receiver, time, sender }) => {
    // console.log("seen", receiver, name);
    if (sender === name) {
      setReceivedmsgTime(time);
    }
  };
  useEffect(() => {
    handleLastSeen();
  }, [name, online]);
  useEffect(() => {
    if (socket == null) return;
    socket.on("online", checkOnline);
    socket.on("offline", checkOnline);
    socket.on("status-update-last", lastStatusUpdateTime);
  }, [socket, checkOnline]);

  const newMessages = async () => {
    const phone = await getLocal("myphone");
    setMyPhone(phone);
    await updateStatus(name);
    await updateLocalChatStatusAll(name);
    const data = await getUpdatedMessage(name);
    setLocalData(data);
  };

  useEffect(() => {
    newMessages();
    if (socket == null) return;
    socket.on("receive-message", handleReceive);
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    socket.emit("statusUpdate", {
      receiver: name,
      time: Date.now(),
      sender: myphone,
    });
    return () => {
      socket.off("receive-message");
      socket.off("offline");
      socket.off("offline");
      socket.off("status-update-last");
      backHandler.remove();
    };
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
        edit={undefined}
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
        <View style={{ flexDirection: "column-reverse" }}>
          {localData &&
            localData?.map((chat, idx) => (
              <ChatMessage
                onSwipeToReply={swipeToReply}
                key={chat.time}
                lastTime={reveicedmsgTime}
                myphone={myphone}
                next={localData[idx + 1]}
                chat={chat}
                online={online}
              />
            ))}
        </View>
      </ScrollView>
      {/* <ChatInput text={textInput} setText={setTextInput} send={handleSend} /> */}
      <ChatInput
        reply={reply}
        isLeft={isLeft}
        closeReply={closeReply}
        username={contactName}
        text={textInput}
        setText={setTextInput}
        send={handleSend}
      />
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
