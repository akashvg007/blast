import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import { spaces } from '../util/spaces';
import { getLastMessageHelper } from '../helper/logicHelper';
import { relativeTime } from '../helper/logicHelper';
import { colors } from '../util/colors';

export default ({
  data,
  handleSelected,
  name,
  contact,
  newContact = false,
  ...props
}) => {
  const [lastMsg, setLastMsg] = useState({});

  let photo =
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/1024px-User-avatar.svg.png';

  if (props?.photo[name] && props?.photo[name] !== "") photo = props.photo[name];
  let contactName = contact || name;
  if (!contact && name === '+918848275018') contactName = 'Admin';
  // console.log("contactname", contact);

  const handlePress = () => {
    console.log("pressed this");

    handleSelected(name)
  };
  const lastMessage = () => {
    if (lastMsg?.msg) {
      const { msg } = lastMsg
      return msg.length > 20 ? msg.substring(0, 20) + "..." : msg;
    }
    return ""
  }
  useEffect(() => {
    getLastMessageHelper(data, setLastMsg)
  }, [])
  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View>
        <Image source={{ uri: photo }} style={styles.dp} />
      </View>
      <View style={styles.lastMsgContainer}>
        <View style={styles.title}>
          <Text style={styles.text}>{contactName}</Text>
          <Text style={styles.lastMsg}>{lastMessage()}</Text>
        </View>
        <Text >{relativeTime(lastMsg.time)}</Text>
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: spaces.sm,
    backgroundColor: colors.white,
    color: colors.black,
    flexDirection: 'row',
    alignItems: 'center',
    height: 70,
    width: '100%'
  },
  lastMsgContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '85%'
  },
  dp: {
    borderRadius: 20,
    width: 40,
    height: 40,
  },
  text: {
    fontSize: spaces.md,
    fontWeight: 'bold'
  },
  lastMsg: {
    fontWeight: 'normal',
    fontSize: spaces.sm
  },
  title: {
    paddingLeft: spaces.sm,

  }
});
