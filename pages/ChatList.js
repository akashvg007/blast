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
import { SnackBar } from "../components/SnackBar";

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
  const [showSnack, setShowSnack] = useState(false);

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
      console.log("available", isAvailable);
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
      console.log("response", Object.keys(resp));
      // alert("total contacts: " + resp.total);
      if (resp.data.length > 0) await getLocalContacts(resp.data);
    })();
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
    position: "relative",
  },
  newChat: {
    fontFamily: "Montserrat-Bold",
    fontSize: 14,
    borderRadius: 20,
  },
});
