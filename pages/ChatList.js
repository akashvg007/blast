import React, { useState } from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { spaces } from '../util/spaces';
import ContactList from '../components/ContactList';
import { colors } from '../util/colors';
import { Button } from 'react-native-paper';
import * as Contacts from 'expo-contacts';
import { setLocal, getPhoneContacts, getLocal } from '../helper/logicHelper';
import PhoneContacts from './PhoneContacts';

export default function ChatList({ list = {}, contact = {}, profiles,setCurrentUser }) {
    const [contactList, setContactList] = useState({});
    const [showContact, setShowContact] = useState(false)

    const handleSelected = (name) => {
        setCurrentUser(name);
    }
    const showContacts = async () => {
        console.log("showContacts");

        const list = await getPhoneContacts();
        console.log("showContacts", list);
        setContactList(list);
        setShowContact(true)
    }

    const newContact = async () => {
        const list = await getLocal('phone-contact');
        // console.log("list", list);

        if (!list || list.length === 0) {
            const { status } = await Contacts.requestPermissionsAsync();
            if (status !== 'granted') return;
            const { data } = await Contacts.getContactsAsync({
                fields: [Contacts.Fields.PhoneNumbers]
            })
            if (data.length > 0) {
                // console.log("Contacts list", data);
                await setLocal('phone-contact', data);
            }
        }
        showContacts();
    }

    const renderView = () =>{
        if(showContact) return ( 
            <PhoneContacts data={contactList} setCurrentUser={setCurrentUser} 
                setShowContact={setShowContact} />
            )
        return (
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
                            photo={profiles[chat]} name={chat} handleSelected={handleSelected}
                            data={list[chat]} />
                    ))
                }
            </ScrollView>
        </>
        )
    }

    return renderView();
}

const styles = StyleSheet.create({
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
