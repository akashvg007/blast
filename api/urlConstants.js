const prod = "https://whatsapp-server.herokuapp.com";
const local = "localhost:3400";
export const chatService = "https://chat-service-whatsapp.herokuapp.com";

export const getBaseUrl = () => {
  // const { hostname } = document.location
  // const baseUrl = (hostname === 'localhost') ? local : prod;
  // return baseUrl
  return prod;
};

// export const baseUrl = "https://whatsapp-server.herokuapp.com";

export const endpoints = {
  register: "/register",
  verify: "/verify",
  sendMsg: "/send-msg",
  getMsg: "/get-msg",
  getRecent: "/getrecent",
  getcontacts: "/getcontacts",
  addcontact: "/addcontact",
  upload: "/upload",
  getAllContacts: "/getAllMyUserDetails",
  updateLastSeen: "/update-last-seen",
  getlastSeenL: "/get-last-seen",
  getBlastsContacts: "/getAllContacts",
  updateName: "/update/name",
  removePhoto: "/remove/profile",
  statusUpdate: "/update/status/:phone",
};

export const getEndpoint = (key, id, value) => {
  if (key == "statusUpdate") console.log("id::value", id, value);

  let url = "";
  if (id && value) url = endpoints[key].replace(id, value);
  else url = endpoints[key];
  return "/user" + url;
};
