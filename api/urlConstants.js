const prod = "https://whatsapp-server.herokuapp.com";
const local = "localhost:3400"
export const chatService = "https://chat-service-whatsapp.herokuapp.com"

export const getBaseUrl = () => {
    // const { hostname } = document.location
    // const baseUrl = (hostname === 'localhost') ? local : prod;
    // return baseUrl
    return prod
}

// export const baseUrl = "https://whatsapp-server.herokuapp.com";


export const endpoints = {
    register: "/register",
    verify: "/verify",
    sendMsg: "/send-msg",
    getMsg: "/get-msg",
    getRecent: "/getrecent",
    getcontacts: "/getcontacts",
    addcontact: "/addcontact",
    upload: '/upload',
    getAllContacts: "/getAllMyUserDetails",
    updateLastSeen: "/update-last-seen",
    getlastSeenL: "/get-last-seen",
    getBlastsContacts:'/getAllContacts',
}

export const getEndpoint = (key) => {
    return "/user" + endpoints[key];
}