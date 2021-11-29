import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, Text, TouchableOpacity } from "react-native";
import { spaces } from "../util/spaces";
import { getLastMessageHelper } from "../helper/logicHelper";
import { relativeTime } from "../helper/logicHelper";
import { colors } from "../util/colors";
import { Badge } from "react-native-paper";

export default ({
  data = undefined,
  handleSelected,
  phone,
  contact,
  newContact = false,
  joinedDate,
  viewDP,
  unreadCount = 0,
  resetUnread,
  ...props
}) => {
  const [lastMsg, setLastMsg] = useState({});

  let photo =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/1024px-User-avatar.svg.png";

  if (props?.photo && props?.photo !== "") photo = props.photo;
  let contactName = contact || phone;
  if (!contact && phone === "+918848275018") contactName = "Admin";
  // console.log("unreadCount", unreadCount);

  const handlePress = () => {
    resetUnread({});
    handleSelected(phone);
  };
  const lastMessage = () => {
    if (lastMsg?.msg) {
      const { msg } = lastMsg;
      return msg.length > 20 ? msg.substring(0, 25) + "..." : msg;
    }
    return "";
  };
  const viewImage = (e) => {
    if (joinedDate) return;
    e.stopPropagation();
    viewDP({ photo, contactName });
  };
  const dateColor = () => {
    if (unreadCount > 0) {
      return { color: colors.fngreen };
    }
    return { color: colors.fnShade };
  };
  useEffect(() => {
    if (data) getLastMessageHelper(data, setLastMsg);
  }, []);
  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View>
        <TouchableOpacity onPress={viewImage}>
          <Image source={{ uri: photo }} style={styles.dp} />
        </TouchableOpacity>
      </View>
      <View style={styles.lastMsgContainer}>
        <View style={styles.title}>
          <Text style={styles.text}>{contactName}</Text>
          {data && <Text style={styles.lastMsg}>{lastMessage()}</Text>}
        </View>
        <View>
          {data && (
            <Text style={[dateColor()]}>{relativeTime(lastMsg.time)}</Text>
          )}
          {!joinedDate && unreadCount > 0 && (
            // <Text>15</Text>
            <Badge style={styles.badge}>{unreadCount}</Badge>
          )}
        </View>
        {joinedDate && <Text>Joined on {relativeTime(joinedDate, 1)}</Text>}
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: spaces.sm,
    backgroundColor: colors.white,
    color: colors.black,
    flexDirection: "row",
    alignItems: "center",
    height: 70,
    width: "100%",
  },
  badge: {
    color: colors.white,
    backgroundColor: colors.fngreen,
  },
  lastMsgContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "85%",
  },
  dp: {
    borderRadius: 20,
    width: 40,
    height: 40,
  },
  text: {
    fontSize: spaces.md,
    fontWeight: "bold",
  },
  lastMsg: {
    fontWeight: "normal",
    fontSize: spaces.sm,
  },
  title: {
    paddingLeft: spaces.sm,
  },
});
