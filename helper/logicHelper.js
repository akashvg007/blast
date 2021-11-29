import AsyncStorage from "@react-native-async-storage/async-storage";
import { getRecentChats, getContact, getAllMyContacts } from "../api/service";
import moment from "moment";
import { sendMessage, getAllBlastContacts } from "../api/service";

export const relativeTime = (date, st) => {
  const calendar = moment(date).calendar();
  if (st) return moment(date).format("MMM Do YY");
  if (calendar.indexOf("Today at") != "-1") {
    return calendar.substr(calendar.indexOf("at") + 2, calendar.length);
  } else if (calendar.indexOf("at") != "-1") {
    return calendar.substr(0, calendar.indexOf("at") - 1);
  }
  return calendar;
};

export const getLastMessageHelper = (data, setLast) => {
  if (!data || !Array.isArray(data)) return;
  let last = data[0] || {};
  if (last) {
    data.forEach((chat) => {
      if (chat.time > last.time) last = chat;
    });
    setLast(last);
  }
};
function isJson(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}
export const onChangeFnHelper = (e, setData) => {
  setData(e.target.value);
};

export const getLocal = async (key, initial = "") => {
  try {
    const value = await AsyncStorage.getItem(key);
    const jsonValue = isJson(value) ? JSON.parse(value) : value;
    return jsonValue || initial;
  } catch (err) {
    return initial;
  }
};

export const setLocal = async (key, value) => {
  const jsonValue = typeof value === "string" ? value : JSON.stringify(value);
  await AsyncStorage.setItem(key, jsonValue);
  return true;
};

export const removeLocal = async (key) => {
  await AsyncStorage.removeItem(key);
  return true;
};

export const getChatsFromLocal = async () => {
  try {
    const lastChatGet = await getLocal("lastChatGet", "");
    const conversation = await getLocal("chats", {});
    let last = 0;
    if (lastChatGet) last = lastChatGet;
    await setLocal("lastChatGet", Date.now());
    const chats = await getRecentChats({ time: 0 });
    const newData = chats.concat(conversation);
    // need to work here to optimize the application
    await setLocal("chats", chats);
  } catch (e) {
    //console.log("getChatsFromLocal", e);
  }
};
export const formateChats = async () => {
  try {
    const users = {};
    const chats = await getLocal("chats");
    const last = await getLocal("lastChatGet");
    // console.log("chats", chats, last);

    const myPhone = await getLocal("myphone");
    if (!chats || !Array.isArray(chats)) return {};
    chats.map((chat) => {
      const { from = "", to = "", msg = "", time = 0, status = 1 } = chat;
      if (!from || !to) return;
      const user = from === myPhone ? to : from;
      if (!users[user]) users[user] = [];
      const obj = { msg, time, status, from, to };
      users[user].push(obj);
    });
    await setLocal("localChat", users);
    return users;
  } catch (err) {
    console.log("catch::formateChats", err.message);
    return {};
  }
};
export const getAllContacts = async () => {
  try {
    const contact = await getLocal("contacts", {});
    const contacts = await getContact();
    const contactList = {};
    contacts.forEach((list) => {
      const { name, phone } = list;
      if (!contactList[phone] && !contact[phone]) contactList[phone] = name;
    });
    //console.log("contact::contactList", contact, contactList);
    await setLocal("contacts", { ...contactList, ...contact });
  } catch (e) {
    //console.log("getAllContacts::catch", e);
  }
};

export const getAllMyChatContacts = async () => {
  try {
    const list = await getAllMyContacts();
    const profilePicData = {};
    list.forEach((profile) => {
      const { profilePic = "", phone } = profile;
      if (!profilePicData[phone]) profilePicData[phone] = profilePic;
    });
    // //console.log("dp1", profilePicData);
    return profilePicData;
  } catch (e) {
    //console.log("getAllMyChatContacts::catch", e);
    return {};
  }
};

export const clearAllStorage = () => {
  AsyncStorage.getAllKeys()
    .then((keys) => AsyncStorage.multiRemove(keys))
    .then(() => alert("success"));
};

export const getUnreadMsg = async () => {
  const localChat = await getLocal("localChat");
  const myphone = await getLocal("myphone");
  const unreadMap = {};
  // console.log("keys", localChat["+918848275018"]);

  Object.keys(localChat).forEach((k) => {
    if (!unreadMap[k]) unreadMap[k] = 0;
    localChat[k].forEach((x) => {
      if (x.from !== myphone && x.status !== 2) {
        console.log("unreadMesg", x);
        unreadMap[k]++;
      }
    });
  });
  return unreadMap;
};

export const addToMessage = async ({
  recipient,
  text,
  sender,
  status = 2,
  rt = Date.now(),
}) => {
  const localChat = await getLocal("localChat", {});
  const messageObj = {
    msg: text,
    to: recipient,
    from: sender,
    time: Date.now(),
    status,
    rt,
  };
  // console.log("addtomessage", localChat, recipient);
  const myphone = await getLocal("myphone");
  const phone = myphone === recipient ? sender : recipient;
  if (!localChat[phone]) localChat[phone] = [];
  localChat[phone] = [messageObj, ...localChat[phone]];
  await setLocal("localChat", localChat);
  if (status != 2) await sendMessage(messageObj);
};
export const getUpdatedMessage = async (recipient) => {
  const localChat = await getLocal("localChat");
  const last100 = localChat[recipient] ? localChat[recipient].slice(0, 50) : [];
  return last100;
  return localChat[recipient] || [];
};

export const updateLocalChatStatusAll = async (recipient) => {
  const localChat = await getLocal("localChat");
  const oneChat = localChat[recipient];
  // console.log("keys", oneChat);
  const newData = oneChat.map((chat) => ({ ...chat, status: 2 }));
  localChat[recipient] = [...newData];
  localChat[recipient].forEach((x) => {
    if (x.status != 2) console.log("not 2", x);
  });
  const newObj = JSON.parse(JSON.stringify(localChat));
  // await removeLocal("localChat");
  const keys = await AsyncStorage.getAllKeys();
  console.log("all keys", keys);
  await AsyncStorage.flushGetRequests();
  await setLocal("localChat", newObj);
  console.log("all keys2", keys);
};

export const updateLocalChatStatus = async (recipient) => {
  const localChat = await getLocal("localChat");
  const oneChat = localChat[recipient];
  oneChat.map((chat) => {
    if (chat.from === recipient) return { ...chat, status: 2 };
    return chat;
  });
  localChat[recipient] = oneChat;
  await setLocal("localChat", localChat);
};

export const getLocalContacts = async (contacts) => {
  const contactMap = {};
  contacts.forEach((contact) => {
    const { firstName = "", lastName = "", phoneNumbers } = contact;
    if (phoneNumbers && phoneNumbers.length > 0) {
      phoneNumbers.forEach((x) => {
        let key = x.number.replace(/\s+|-/g, "");
        if (!contactMap[key]) contactMap[key] = firstName + lastName + "";
      });
    }
  });
  // await setLocal('phoneContacts',contactMap)
  getBlastContacts(contactMap);
};

export const getBlastContacts = async (contacts) => {
  try {
    const phones = Object.keys(contacts);
    const blastContacts = await getAllBlastContacts({ phones });
    // console.log("blastContacts", blastContacts);
    const blastContactMap = {};
    blastContacts.forEach((x) => {
      const { phone, cr_date, lastseen, profilePic = "" } = x;
      if (!blastContactMap[phone])
        blastContactMap[phone] = {
          phone,
          cr_date,
          lastseen,
          profilePic,
          name: contacts[phone],
        };
    });
    // console.log("blastContacts1", blastContactMap);
    await setLocal("blastContact", blastContactMap);
  } catch (e) {
    console.log("getBlastContacts", e.message);
  }
};
