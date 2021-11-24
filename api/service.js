import axios from 'axios';
import { getBaseUrl, getEndpoint } from "./urlConstants";
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseUrl = getBaseUrl();
const commonGet = async (url) => {
    try {
        const token = await AsyncStorage.getItem("token")
        let resp;
        if (token) {
            resp = await axios.get(url, { headers: { "Authorization": `Bearer ${token}` } });
        }
        else resp = await axios.get(url);
        if (resp.status == 200)
            return resp?.data.data;
    }
    catch (err) {
        //console.log("something went wrong::commonGet", err.message);
    }
}

const commonPost = async (url, payload) => {
    try {
        const token = await AsyncStorage.getItem("token")
        let resp;
        if (token) {
            resp = await axios.post(url, payload, { headers: { "Authorization": `Bearer ${token}` } });
        }
        else resp = await axios.post(url, payload);
        if (resp.status == 200)
            return resp?.data.data;
    }
    catch (err) {
        //console.log("something went wrong::commonGet", err.message);
    }
}

const commonPostFormData = async (url, payload) => {
    try {
        const token = await AsyncStorage.getItem("token")
        let resp;
        if (token) {
            resp = await axios.post(url, payload, { headers: { "Authorization": `Bearer ${token}`, "Content-Type": "multipart/form-data" } });
        }
        else resp = await axios.post(url, payload);
        if (resp.status == 200)
            return resp?.data.data;
    }
    catch (err) {
        //console.log("something went wrong::commonGet", err.message);
    }
}

export const registerUser = async (payload) => {
    try {
        const url = baseUrl + getEndpoint('register');
        const result = await commonPost(url, payload);
        return result
    }
    catch (err) {
        //console.log("something went wrong", err.message);

    }
}

export const verifyOTP = async (payload) => {
    try {
        const url = baseUrl + getEndpoint('verify');
        const result = await commonPost(url, payload);
        return result
    }
    catch (err) {
        //console.log("something went wrong", err.message);

    }
}

const getLastTime = async (key) => {
    const Prefixedkey = "whatsApp-chat-" + key;
    const data = await AsyncStorage.getItem(Prefixedkey);
    const now = Date.now();
    //console.log("lastTime", now);
    const obj = !data ? { time: 0, data: [] } : JSON.parse(data);
    if (!data) await AsyncStorage.setItem(Prefixedkey, JSON.stringify(obj))
    return [obj.time, now];
}

const setLastTime = async (key, result, time) => {
    const Prefixedkey = "whatsApp-chat-" + key;
    const data = await AsyncStorage.getItem(Prefixedkey);
    const obj = JSON.parse(data);
    // obj.data = obj.data.concate(result);
    //console.log("setLastTime", obj.data, result);

    obj.data = result.concat(obj.data)
    obj.time = time;
    await AsyncStorage.setItem(Prefixedkey, JSON.stringify(obj))
}

export const getMessageOne = async (payload) => {
    try {
        const [lastTime, time] = getLastTime(payload?.to)
        //console.log("lastTime, time", lastTime, time);

        payload.lastTime = lastTime;
        const url = baseUrl + getEndpoint('getMsg');
        const result = await commonPost(url, payload);
        setLastTime(payload?.to, result, time);
        return true;
    }
    catch (err) {
        //console.log("something went wrong", err.message);

    }
}

export const getRecentChats = async ({ time }) => {
    try {
        let url = baseUrl + getEndpoint('getRecent');
        if (time) url += "/" + time;
        const result = await commonGet(url);
        //console.log("getRecentChats::result", result);
        return result
    }
    catch (err) {
        //console.log("something went wrong", err.message);

    }
}

export const sendMessage = async (payload) => {
    try {
        const url = baseUrl + getEndpoint('sendMsg');
        const result = await commonPost(url, payload);
        //console.log("sendMessage::result", result);
        return result
    }
    catch (err) {
        //console.log("something went wrong", err.message);

    }
}

export const getContact = async () => {
    try {
        const url = baseUrl + getEndpoint('getcontacts');
        const result = await commonGet(url);
        //console.log("getContact::result", result);
        return result
    }
    catch (err) {
        //console.log("something went wrong", err.message);

    }
}
export const updateLastSeen = async () => {
    try {
        const url = baseUrl + getEndpoint('updateLastSeen');
        const result = await commonPost(url, {});
        //console.log("updateLastSeen::result", result);
        return result
    }
    catch (err) {
        //console.log("something went wrong", err.message);

    }
}
export const getLastSeen = async (payload) => {
    try {
        const url = baseUrl + getEndpoint('getlastSeenL');
        const result = await commonPost(url, payload);
        //console.log("getLastSeen::result", result);
        return result
    }
    catch (err) {
        //console.log("something went wrong", err.message);

    }
}

// export const addContact = async (payload) => {
//     try {
//         const url = baseUrl + getEndpoint('addcontact');
//         const result = await commonPost(url, payload);
//         //console.log("addContact::result", result);
//         return result
//     }
//     catch (err) {
//         //console.log("something went wrong", err.message);

//     }
// }

// export const uploadImages = async (payload) => {
//     try {
//         const url = baseUrl + getEndpoint('upload');
//         const result = await commonPostFormData(url, payload);
//         //console.log("uploadImages::result", result);
//         return result
//     }
//     catch (err) {
//         //console.log("something went wrong", err.message);

//     }
// }

export const getAllMyContacts = async () => {
    try {
        const url = baseUrl + getEndpoint('getAllContacts');
        const result = await commonGet(url);
        //console.log("getAllMyContacts::result", result);
        return result
    }
    catch (err) {
        //console.log("something went wrong", err.message);

    }
}



