import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  BackHandler,
} from "react-native";
import { spaces } from "../util/spaces";
import { TextInput, IconButton } from "react-native-paper";
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
import EmojiSelector, { Categories } from "react-native-emoji-selector";
import Profile from "./Profile";

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

  let DP =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/1024px-User-avatar.svg.png";
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
  const clickBack = () => {
    handleBack("");
  };
  const backAction = () => {
    handleBack("");
    return true;
  };
  const getLocalChat = async () => {
    await getChatsFromLocal();
    props.getNew();
  };
  async function handleLastSeen(): Promise<void> {
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

  const handleEmoji = () => {
    return (
      <EmojiSelector
        category={Categories.symbols}
        onEmojiSelected={(emoji) => console.log(emoji)}
      />
    );
  };
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
      <View style={styles.heading}>
        <View style={styles.hleft}>
          <IconButton
            icon={(prop) => <Image source={require("../assets/arrowLT.png")} />}
            size={20}
            onPress={clickBack}
            hasTVPreferredFocus={undefined}
            tvParallaxProperties={undefined}
          />
          <Image source={{ uri: DP }} style={styles.dp} />
          <View style={styles.nameSection}>
            <Text onPress={handleProfile} style={styles.headingText}>
              {contactName}
            </Text>
            <Text style={styles.online}>
              {online == "online" ? online : lastSeen}
            </Text>
          </View>
        </View>
      </View>
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
                      <View
                        style={[
                          styles.time,
                          chat.from === myphone
                            ? styles.rightSide
                            : styles.leftSide,
                        ]}
                      >
                        <Text>{moment(chat.time).format("LT")}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })}
        </View>
      </ScrollView>
      <View>
        <TextInput
          style={styles.textInput}
          multiline
          placeholder="Type a Message"
          onChangeText={setTextInput}
          value={textInput}
          left={
            <TextInput.Icon
              style={styles.emoji}
              onPress={handleEmoji}
              name={require("../assets/emoticon-happy.png")}
            />
          }
          right={<TextInput.Icon onPress={handleSend} name="send" />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  textInput: {
    backgroundColor: "#fff",
    borderRadius: 15,
  },
  emoji: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
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
  },
  rightSide: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  leftSide: {
    flexDirection: "row",
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
    fontSize: 10,
    fontFamily: "Rubik-Regular",
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
  hleft: {
    width: "60%",
    flexDirection: "row",
  },
  hright: {
    width: "40%",
  },
  heading: {
    backgroundColor: colors.bggreen,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    height: 50,
    alignItems: "center",
    paddingLeft: 5,
  },
  dp: {
    borderRadius: 20,
    width: 40,
    height: 40,
  },
  nameSection: {
    paddingLeft: spaces.sm,
  },
  headingText: {
    fontSize: spaces.md,
    color: colors.white,
  },
  online: {
    fontSize: spaces.xsm,
    color: colors.white,
  },
});
