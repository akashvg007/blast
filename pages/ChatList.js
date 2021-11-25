import React, { useState,useEffect } from 'react';
import { Text, View, StyleSheet, ScrollView,ActivityIndicator } from 'react-native';
import { spaces } from '../util/spaces';
import ContactList from '../components/ContactList';
import { colors } from '../util/colors';
import { Button } from 'react-native-paper';
import * as Contacts from 'expo-contacts';
import { setLocal, getLocalContacts, getLocal } from '../helper/logicHelper';
import PhoneContacts from './PhoneContacts';

export default function ChatList({ list = {}, contact = {}, profiles,setCurrentUser }) {
    const [contactList, setContactList] = useState({});
    const [showContact, setShowContact] = useState(false);
    const [loader,setLoader] = useState(false);

    const handleSelected = (name) => {
        setCurrentUser(name);
    }
    const showContacts = async () => {
        const list = await getLocal('blastContact');
        console.log("showContacts", list);
        setContactList(list);
        setShowContact(true)
    }
    
    const newContact = async () => {
        setLoader(true)
        const { status } = await Contacts.requestPermissionsAsync();
        if (status !== 'granted') return;
        const { data } = await Contacts.getContactsAsync({
            fields: [Contacts.Fields.PhoneNumbers]
        })
        if (data.length > 0) await getLocalContacts(data);
        setLoader(false)
    }

    useEffect(()=>{
        newContact();
    },[])

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
                    onPress={showContacts}
                    color={colors.white}
                    style={styles.newChat}>New Chat</Button>
            </View>
            <ScrollView style={styles.chatlist}>
                {
                     loader
                     ?(
                         <View style={styles.loaderContainer}>
                             <ActivityIndicator size={100} color={colors.prgreen} />
                             <Text>loading contacts</Text>
                         </View>
                     ):Object.keys(list).map(chat => (
                        <ContactList contact={contact[chat]}
                            key={chat}
                            photo={profiles[chat]} phone={chat} handleSelected={handleSelected}
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
    loaderContainer:{
        flex:1,
        width:'100%',
        alignItems:'center',
        height:600,
        backgroundColor:colors.white,
        justifyContent:'center'
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
