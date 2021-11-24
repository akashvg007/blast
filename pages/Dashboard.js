import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { spaces } from '../util/spaces';
import ChatScreen from './ChatScreen';
import { colors } from '../util/colors';
import ChatList from './ChatList';

export default function Dashboard({ list = {}, contact = {}, profiles, ...props }) {
  const [currentUser, setCurrentUser] = useState('')
  const [contactList, setContactList] = useState({});
  const [showContact, setShowContact] = useState(false)


  return (
    <View style={styles.container}>
      {currentUser != '' ? (
        <ChatScreen {...props} photo={profiles[currentUser]}
          handleBack={setCurrentUser}
          name={currentUser} contact={contact[currentUser]} />
      ) :
        <ChatList setCurrentUser={setCurrentUser} list={list}
          contact={contact} profiles={profiles} />
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    color: '#000',
    width: '100%',
  },
  heading: {
    backgroundColor: colors.bggreen,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    height: 50,
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
  },
  contacts: {
    height: 1000,
    overflow: 'scroll',
  },
  headingText: {
    fontSize: spaces.md,
    color: colors.white,
  },
  chatlist: {
    overflow: 'scroll',
    flexGrow: 1
  },
  newChat: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 14,
    borderRadius: 20,
  },
});
