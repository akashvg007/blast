import React, { useState, useEffect } from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import Agree from "./pages/AgreeTermsAndCondition";
import VerifyPhone from "./pages/VerifyPhone";
import VerifyOtp from "./pages/VerifyOtp";
import Dashboard from "./pages/Dashboard";
import {
  getLocal,
  formateChats,
  getChatsFromLocal,
  getAllContacts,
  getAllMyChatContacts,
  clearAllStorage,
} from "./helper/logicHelper";
import { SocketProvider } from "./context/SocketProvider";
import { updateLastSeen } from "./api/service";
import ProfileSetup from "./pages/ProfileSetup";

export default function App() {
  const [agree, setAgree] = useState(false);
  const [otpSend, setOtpSend] = useState(false);
  const [verified, setVerified] = useState(false);
  const [initial, setInitial] = useState(false);
  const [chatlist, setChatlist] = useState({});
  const [profilepic, setProfilepic] = useState({});
  const [myphone, setMyPhone] = useState("");

  //need to do something about the below local state
  const [contact, setContacts] = useState();

  const getNewChats = async () => {
    await getChatsFromLocal();
    getInitialValues();
  };

  const getAndSetNewChats = async () => {
    const users = await formateChats();
    setChatlist(users);
  };
  const getAndSetNewContacts = async () => {
    const data = await getAllMyChatContacts();
    setProfilepic(data);
  };

  const getInitialValues = async () => {
    getAndSetNewChats();
    getAndSetNewContacts();
    const contacts = await getLocal("contacts", {});
    setContacts(contacts);
  };
  const setInitialStates = async () => {
    const phone = await getLocal("myphone");
    const name = await getLocal("myname");
    setMyPhone(phone);
    setAgree(true);
    setOtpSend(true);
    setVerified(true);
    if (name) setInitial(true);
  };

  const setStartVals = () => {
    setAgree(false);
    setOtpSend(false);
    setVerified(false);
    setInitial(false);
  };
  // console.log("agree", agree);
  // console.log("otpSend", otpSend);
  // console.log("verified", verified);
  // console.log("initial", initial);

  const handleUpdateLastTime = () => {
    setInterval(() => {
      updateLastSeen();
    }, 60000);
  };

  useEffect(() => {
    // clearAllStorage();

    handleUpdateLastTime();
    getLocal("token")
      .then(async (token) => {
        if (token && typeof token === "string") {
          setInitialStates();
          getInitialValues();
          getNewChats();
          getAllContacts();
        } else setStartVals();
      })
      .catch((err) => {
        setStartVals();
      });
  }, [verified]);

  const renderOtpPage = () => {
    if (!agree) return <Agree onAgree={setAgree} />;
    if (!otpSend)
      return <VerifyPhone setAgree={setAgree} setOtpSend={setOtpSend} />;
    if (!verified) return <VerifyOtp setVerified={setVerified} />;
    if (!initial)
      return (
        <ProfileSetup
          dp={profilepic[myphone]}
          setValues={setInitial}
          phone={myphone}
          getProfilePic={getAndSetNewContacts}
        />
      );
    return (
      <SocketProvider id={myphone}>
        <Dashboard
          getProfilePic={getAndSetNewContacts}
          myphone={myphone}
          profiles={profilepic}
          getAllContacts={getAllContacts}
          contact={contact}
          getNew={getAndSetNewChats}
          list={chatlist}
        />
      </SocketProvider>
    );
  };
  return <View style={styles.container}>{renderOtpPage()}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: StatusBar.currentHeight,
  },
});
