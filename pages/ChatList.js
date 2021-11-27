import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { spaces } from "../util/spaces";
import ContactList from "../components/ContactList";
import { colors } from "../util/colors";
import { Button } from "react-native-paper";
import * as Contacts from "expo-contacts";
import { getLocalContacts, getLocal } from "../helper/logicHelper";
import PhoneContacts from "./PhoneContacts";
import Profile from "./Profile";
import { Fullscreen } from "../components/Fullscreen";

export default function ChatList({
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

  const handleSelected = (name) => {
    setCurrentUser(name);
  };
  const showContacts = async () => {
    const list = await getLocal("blastContact");
    console.log("showContacts", list);
    setContactList(list);
    setShowContact(true);
  };

  const handleProfile = () => {
    setShowProfile(true);
  };

  const newContact = async () => {
    setLoader(true);
    const un = await getLocal("myname");
    setProfileName(un);
    const { status } = await Contacts.requestPermissionsAsync();
    if (status !== "granted") return;
    const { data } = await Contacts.getContactsAsync({
      fields: [Contacts.Fields.PhoneNumbers],
    });
    if (data.length > 0) await getLocalContacts(data);
    setLoader(false);
  };

  useEffect(() => {
    newContact();
  }, []);

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
            KEEP IT BLAST
          </Text>
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
              />
            ))
          )}
        </ScrollView>
      </>
    );
  };

  return renderView();
}

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
  },
  newChat: {
    fontFamily: "Montserrat-Bold",
    fontSize: 14,
    borderRadius: 20,
  },
});
