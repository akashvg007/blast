import React, { useState, useEffect, memo } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useSocket } from "../context/SocketProvider";
import { spaces } from "../util/spaces";
import ContactList from "../components/ContactList";
import { colors } from "../util/colors";
import { Button } from "react-native-paper";
import * as Contacts from "expo-contacts";
import {
  getLocalContacts,
  getLocal,
  getChatsFromLocal,
  getUnreadMsg,
  addToMessage,
} from "../helper/logicHelper";
import PhoneContacts from "./PhoneContacts";
import Profile from "./Profile";
import { Fullscreen } from "../components/Fullscreen";
import { SnackBar } from "../components/SnackBar";

export default memo(function ChatList({
  list = {},
  contact = {},
  profiles,
  setCurrentUser,
  myphone,
  getProfilePic,
}) {
  const [contactList, setContactList] = useState({});
  const [showContact, setShowContact] = useState(false);
  const [loader, setLoader] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [fullscreen, setFullscreen] = useState({});
  const [showSnack, setShowSnack] = useState(false);
  const [unreadCount, setUnreadCount] = useState({});
  const socket = useSocket();

  const handleSelected = (name) => {
    setUnreadCount({});
    setCurrentUser(name);
  };
  const showContacts = async () => {
    const list = await getLocal("blastContact");
    setContactList(list);
    setShowContact(true);
  };

  const handleProfile = () => {
    setShowProfile(true);
  };
  const getNewChats = async (st = 0) => {
    // console.log("newChat::St", st);
    await getChatsFromLocal();
    const unread = await getUnreadMsg();
    // console.log("unread", unread);
    setUnreadCount(unread);
  };

  const handleReceive = async (msgObj) => {
    await addToMessage({ ...msgObj, rt: Date.now() });
    getNewChats();
  };

  const turnOffLoader = () => {
    setTimeout(() => {
      setLoader(false);
    }, 5000);
  };
  useEffect(() => {
    (async () => {
      const un = await getLocal("myname");
      setProfileName(un);
      const isAvailable = await Contacts.isAvailableAsync();
      if (!isAvailable) alert("this device does not support contact api");
      const { granted } = await Contacts.requestPermissionsAsync();
      if (!granted) {
        const permission = await Contacts.getPermissionsAsync();
        if (!permission.granted) {
          alert("please grand permission to access the contacts");
          return;
        }
      }
      const resp = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers],
      });
      if (resp.data.length > 0) await getLocalContacts(resp.data);
    })();
    getNewChats(1);
  }, []);

  useEffect(() => {
    if (socket != null) socket.on("receive-message", handleReceive);
    return () => {
      if (socket != null) socket.off("receive-message");
    };
  }, [socket]);

  const renderView = () => {
    if (showContact)
      return (
        <PhoneContacts
          data={contactList}
          setCurrentUser={setCurrentUser}
          setShowContact={setShowContact}
        />
      );
    if (showProfile)
      return (
        <Profile
          getProfilePic={getProfilePic}
          dp={profiles[myphone]}
          myphone={myphone}
          back={setShowProfile}
          edit={true}
          name={profileName}
        />
      );
    if (Object.keys(fullscreen).length > 0)
      return (
        <Fullscreen
          back={setFullscreen}
          dp={fullscreen.photo}
          name={fullscreen.contactName}
          type="object"
        />
      );
    return (
      <>
        <View style={styles.heading}>
          <Text onPress={handleProfile} style={styles.headingText}>
            BLAST
          </Text>
          {/* <Text onPress={showContacts} style={styles.headingText}>
            NEW CHAT
          </Text> */}
          <Button
            onPress={showContacts}
            color={colors.white}
            style={styles.newChat}
          >
            New Chat
          </Button>
        </View>
        <ScrollView style={styles.chatlist}>
          {loader ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size={100} color={colors.prgreen} />
              <Text>loading contacts</Text>
            </View>
          ) : (
            Object.keys(list).map((chat) => (
              <ContactList
                viewDP={setFullscreen}
                contact={contact[chat]}
                key={chat}
                photo={profiles[chat]}
                phone={chat}
                handleSelected={handleSelected}
                data={list[chat]}
                joinedDate={undefined}
                unreadCount={unreadCount[chat]}
                resetUnread={setUnreadCount}
              />
            ))
          )}
          <SnackBar
            show={showSnack}
            title="Failed to load contacts"
            duration={undefined}
          />
        </ScrollView>
      </>
    );
  };
  return renderView();
});

const styles = StyleSheet.create({
  heading: {
    backgroundColor: colors.bggreen,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    height: 50,
    alignItems: "center",
    paddingLeft: 20,
    paddingRight: 20,
  },
  loaderContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    height: 600,
    backgroundColor: colors.white,
    justifyContent: "center",
  },
  headingText: {
    fontSize: spaces.md,
    color: colors.white,
  },
  chatlist: {
    overflow: "scroll",
    flexGrow: 1,
    position: "relative",
  },
  newChat: {
    fontFamily: "Montserrat-Bold",
    fontSize: 14,
    borderRadius: 20,
  },
});
