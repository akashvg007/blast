import React,{useEffect} from 'react';
import { Text, View, StyleSheet, Image, ScrollView,BackHandler } from 'react-native';
import { spaces } from "../util/spaces";
import { colors } from '../util/colors';
import { IconButton } from 'react-native-paper';
import ContactList from '../components/ContactList';


export default ({ data, setCurrentUser, setShowContact }) => {
    const clickBack = () => {
        setShowContact(false)
        return true;
    }
    const selectContact = (phone) => {
        console.log("selected", phone);
        setCurrentUser(phone)
    }
    useEffect(()=>{
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            clickBack
        );
        return () => backHandler.remove();
    },[])
    return (
        <View style={styles.container}>
            <View style={styles.heading}>
                <IconButton
                    icon={({ size, color }) => (
                        <Image source={require('../assets/arrowLT.png')} />
                    )}
                    size={20}
                    onPress={clickBack} hasTVPreferredFocus={undefined} tvParallaxProperties={undefined} />
                <Text style={styles.headingText}>Select Contacts</Text>
            </View>
            <ScrollView style={{ backgroundColor: colors.white }}>
                {
                    //phone,cr_date,lastseen,profilePic
                    Object.keys(data).map(key => (
                        <ContactList contact={data[key].name}
                            key={key} phone={key} 
                            handleSelected={selectContact}
                            photo={data[key].profilePic}
                            joinedDate={data[key].cr_date}
                        />
                        // <Text onPress={e=>selectContact(key)} key={key} style={styles.text}>{data[key]}</Text>
                    ))
                }
            </ScrollView>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    text: {
        flexDirection: 'row',
        width: '100%',
        paddingLeft:spaces.md,
        height:50
    },
    heading: {
        backgroundColor: colors.bggreen,
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'flex-start',
        height: 50,
        alignItems: 'center',
        paddingLeft: 20,
        paddingRight: 20,
    },
    headingText: {
        fontSize: spaces.md,
        color: colors.white,
    },
});
