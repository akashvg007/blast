import React, { useState, useEffect } from 'react';
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
import { updateLastSeen } from './api/service';

export default function App() {
  const [agree, setAgree] = useState(false);
  const [otpSend, setOtpSend] = useState(false);
  const [verified, setVerified] = useState(false);
  const [chatlist, setChatlist] = useState({})
  const [profilepic, setProfilepic] = useState({})

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

  const setStartVals = () => {
    setAgree(false);
    setOtpSend(false);
    setVerified(false)
  }

  const handleUpdateLastTime = () => {
    setInterval(() => {
      updateLastSeen();
    }, 60000)
  }

  useEffect(() => {
    // clearAllStorage();
    handleUpdateLastTime()
    getLocal("token").then(token => {
      if (token) {
        setInitialStates()
        getInitialValues();
        getNewChats();
        getAllContacts()
      }
      else setStartVals()
    })
  }, [verified])

  const renderOtpPage = () => {
    if (!agree) return <Agree onAgree={setAgree} />;
    if (!otpSend) return <VerifyPhone setAgree={setAgree} setOtpSend={setOtpSend} />;
    if (!verified) return <VerifyOtp setVerified={setVerified} />;
    return (
      <SocketProvider id={myPhone}>
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
