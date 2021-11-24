import React, { useState } from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { spaces } from '../util/spaces';
import ContactList from '../components/ContactList';
import ChatScreen from './ChatScreen';
import { colors } from '../util/colors';
import { Button } from 'react-native-paper';
import { PermissionsAndroid } from 'react-native';
import Contacts from 'react-native-contacts';

export default function Dashboard({ list = {}, contact = {}, profiles, ...props }) {
  const [currentUser, setCurrentUser] = useState('')

  // console.log('list', list)
  // console.log('contact', contact)
  const handleSelected = (name) => {
    // setSelected(true);
    console.log("selected user", name);

    setCurrentUser(name);
  }
  const newContact = async () => {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      {
        'title': 'Contacts',
        'message': 'This app would like to view your contacts.',
        'buttonPositive': 'Please accept bare mortal'
      }
    )
      .then(Contacts.getAll)
      .then(contacts => {
        console.log("contacts", contacts);

      }).catch(err => console.log("something went wrong", err))
  }
  return (
    <View style={styles.container}>
      {currentUser != '' ? (
        <ChatScreen {...props} photo={profiles[currentUser]}
          handleBack={setCurrentUser}
          name={currentUser} contact={contact[currentUser]} />
      ) :
        (
          <>
            <View style={styles.heading}>
              <Text style={styles.headingText}>KEEP IT BLAST</Text>
              <Button
                onPress={newContact}
                color={colors.white}
                style={styles.newChat}>New Chat</Button>
            </View>
            <ScrollView style={styles.chatlist}>
              {
                Object.keys(list).map(chat => (
                  <ContactList contact={contact[chat]}
                    key={chat}
                    photo={profiles} name={chat} handleSelected={handleSelected}
                    data={list[chat]} />
                ))
              }
            </ScrollView>
          </>)}
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
