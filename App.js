import React, { useState, useEffect } from 'react';
import { configureFonts, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { View, StyleSheet, StatusBar } from 'react-native';
import Agree from './pages/AgreeTermsAndCondition';
import VerifyPhone from './pages/VerifyPhone';
import VerifyOtp from './pages/VerifyOtp';
import Dashboard from './pages/Dashboard';
import {
  getLocal, formateChats, getChatsFromLocal,
  getAllContacts, getAllMyChatContacts, clearAllStorage
} from './helper/logicHelper';
import { SocketProvider } from "./context/SocketProvider"

export default function App() {
  const [agree, setAgree] = useState(false);
  const [otpSend, setOtpSend] = useState(false);
  const [verified, setVerified] = useState(false);
  const [chatlist, setChatlist] = useState({})
  const [profilepic, setProfilepic] = useState({})
  const [loader, setLoader] = useState(false)

  //need to do something about the below local state
  const [contact, setContacts] = useState();

  let myPhone = "";
  getLocal('myphone').then(phone => {
    myPhone = phone;
  })

  const getNewChats = async () => {
    await getChatsFromLocal();
    getInitialValues();
  }

  const getAndSetNewChats = async () => {
    const users = await formateChats();
    // console.log("users", users);

    setChatlist(users)
  }
  const getAndSetNewContacts = async () => {
    const data = await getAllMyChatContacts();
    // console.log("contacts", data);

    setProfilepic(data);
  }

  const getInitialValues = async () => {
    getAndSetNewChats();
    getAndSetNewContacts();
    const contacts = await getLocal('contacts', {});
    setContacts(contacts)
  }
  const setInitialStates = () => {
    setAgree(true);
    setOtpSend(true);
    setVerified(true)
  }

  useEffect(() => {
    // clearAllStorage();
    getLocal("token").then(token => {
      if (token) {
        setInitialStates()
        getInitialValues();
        getNewChats();
        getAllContacts()
      }
    })
  }, [])

  const renderOtpPage = () => {
    if (!agree) return <Agree onAgree={setAgree} />;
    if (!otpSend) return <VerifyPhone setAgree={setAgree} setOtpSend={setOtpSend} />;
    if (!verified) return <VerifyOtp setVerified={setVerified} />;
    return (
      <SocketProvider id={"+918848275018"}>
        <Dashboard
          dp={profilepic[myPhone]}
          profiles={profilepic}
          getAllContacts={getAllContacts}
          contact={contact}
          getNew={getAndSetNewChats}
          list={chatlist} />
      </SocketProvider>
    );
  };
  const getMyPhoneAndCallPage = async () => {
    setLoader(true);
    myPhone = await getLocal('myphone');
    renderOtpPage();
    setLoader(false);
  }
  return (
    <View style={styles.container}>{renderOtpPage()}</View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: StatusBar.currentHeight,
  },
});
