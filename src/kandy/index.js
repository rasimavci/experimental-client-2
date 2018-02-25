/*
ravci@genband.com, yjke9884
bkocak@genband.com, pneg4200
*/
import store from "../store";
// import {EventBus} from '../EventBus.js';
import { incomingCall } from "../store/getters";
let callId;
let local = document.getElementById("local-container");
let remote = document.getElementById("remote-container");
const myVideoResolution = {
  height: 640,
  width: 480
};

const options = {
  isAudioEnabled: true, //document.getElementById ('isAudioEnabled').checked,
  isVideoEnabled: false, // document.getElementById ('isVideoEnabled').checked,
  sendInitialVideo: false, //document.getElementById ('sendInitialVideo').checked,
  sendScreenShare: false, //document.getElementById ('sendScreenShare').checked,
  videoResolution: myVideoResolution,
  //localVideoContainer: this.$ref.local-container, // document.getElementById('local-container'),
  //remoteVideoContainer: this.$ref.remote-container //document.getElementById('remote-container')
  localVideoContainer: local, //document.getElementById ('local-container'), //olmadi this.$refs.container1, //
  remoteVideoContainer: remote //document.getElementById ('remote-container'),
};
function addEventListeners() {
  kandy.on("auth:change", function(data) {
    console.log("auth:change Event Data: " + JSON.stringify(data));
    if (kandy.getConnection().isConnected === true) {
      Kandyjs.refreshContacts();
      Kandyjs.retrieveCallLogs();
      Kandyjs.getCallLogs();
      Kandyjs.fetchConversations();
      Kandyjs.searchDirectory();
    }
  });

  kandy.on("call:error", err => {
    if (store.getters.activeCall) store.dispatch("toggleActiveCall");
    console.log("call error: " + err);
  });

  kandy.on("call:stateChange", function(call) {
    var calls = kandy.call.getAll();
    // debugger;
    store.commit("UPDATE_CALLS", calls);
    calls.forEach(function(call) {
      if (call.id === store.state.activeCall.id) {
        store.commit("SET_ACTIVE_CALL", call);
        //  store.dispatch("toggleActiveCall");
        // store.commit (types.SET_ACTIVE_CALL, call);
      }
    });

    // kandy.call.getAll().filter(function(call) {
    //   if (call.state === "IN_CALL") {
    //     store.dispatch("setActiveCallId", { callId: call.id });
    //   } else if (call.state === "ENDED") {
    //     store.dispatch("toggleActiveCall");
    //   }
    //});
  });

  kandy.on("call:mediaStateChange", function(params) {});

  kandy.on("call:start", function(params) {
    const calls = kandy.call.getAll();
    calls.forEach(function(call) {
      console.log("all call ids curently : " + params.callId);
      if (call.id === params.callId) {
        store.commit("SET_ACTIVE_CALL", call);
        //  store.dispatch("toggleActiveCall");
        // store.commit (types.SET_ACTIVE_CALL, call);
      }
    });
  });

  kandy.on("call:receive", params => {
    let callId = params.callId;
    let incomingCallData = {
      callId: params.callId,
      active: true
    };
    store.dispatch("setIncomingCall", incomingCallData);
    store.dispatch("toggleNewIncomingCallModal");
  });

  kandy.on("contacts:change", params => {
    store.commit("REFRESH_CONTACTS", params.contacts);
  });

  kandy.on("directory:change", params => {
    debugger;
    tore.commit("REFRESH_DIRECTORY", params.results);
  });

  kandy.on("conversations:new", function(params) {
    console.log("new conversation" + params.conversation);
    store.commit("ADD_CONVERSATION", params.conversation);
  });
}
// This line is used to create a new instans of Kandy
const kandy = createKandy({
  authentication: {
    subscription: {
      expires: 3600,
      service: ["IM", "Presence", "call"],
      protocol: "https",
      server: "spidr-ucc.genband.com",
      version: "1",
      port: "443"
    },
    websocket: {
      protocol: "wss",
      server: "spidr-ucc.genband.com",
      port: "443"
    }
  },
  logs: {
    logLevel: "debug",
    enableFcsLogs: true
  },
  call: {
    chromeExtensionId: "put real extension ID here",
    serverProvidedTurnCredentials: true,
    iceserver: [
      {
        url: "stun:turn-ucc-1.genband.com:3478?transport=udp"
      },
      {
        url: "stun:turn-ucc-2.genband.com:3478?transport=udp"
      },
      {
        url: "turns:turn-ucc-1.genband.com:443?transport=tcp",
        credential: ""
      },
      {
        url: "turns:turn-ucc-2.genband.com:443?transport=tcp",
        credential: ""
      }
    ]
  }
});

//createKandy()

const Kandyjs = {
  connect: credentials =>
    new Promise((resolve, reject) => {
      if (credentials.username && credentials.password) {
        kandy.connect(credentials);
        addEventListeners();
        resolve("OK");
      } else {
        reject("Bad credentials");
      }
    }),
  disconnect: () => {
    console.log("disconnect method runs for ");
    kandy.disconnect();
  },
  // This is new, to know if kandy is connected!
  isConnected: () =>
    new Promise((resolve, reject) => {
      try {
        let res = kandy.getConnection().isConnected;
        resolve(res);
      } catch (err) {
        reject(err);
      }
    }),
  getConnection: () => {
    try {
      let res = kandy.getConnection();
      resolve(res);
    } catch (err) {
      reject(err);
    }
  },
  makeCall: callee => {
    // console.log("aradiniz: " + callee)
    kandy.call.make(callee, options);
  },
  answerCall: () => {
    console.log("answer call for id: " + callId);
    kandy.call.answer(store.state.incomingCall.callId, options);
  },
  // Call Operations.
  ignoreCall: () => {
    //   var callId = firstCallId; //getSelectedCall();
    kandy.call.ignore(store.state.activeCall.id);
  },
  rejectCall: () => {
    //   var callId = firstCallId; //getSelectedCall();
    kandy.call.reject(store.state.activeCall.id);
  },
  endCall: callId => {
    debugger;
    kandy.call.end(store.state.activeCall.id);
  },
  // Mid-Call Operations.
  muteCall: () => {
    //    var callId = firstCallId; //getSelectedCall();
    kandy.call.mute(store.state.activeCall.id);
  },
  unmuteCall: () => {
    //   var callId = firstCallId; //getSelectedCall();
    kandy.call.unmute(store.state.activeCall.id);
  },
  holdCall: () => {
    console.log("id" + store.state.activeCall.id);
    kandy.call.hold(store.state.activeCall.id);
  },
  unholdCall: () => {
    kandy.call.unhold(store.state.activeCall.id);
  },
  startVideo: () => {
    kandy.call.startVideo(store.getters.activeCall.id);
  },
  stopVideo: () => {
    kandy.call.stopVideo(store.getters.activeCall.id);
  },
  startScreenshare: () => {
    //     var callId = firstCallId; //getSelectedCall();
    getMediaStreamId()
      .then(function(mediaSourceId) {
        kandy.call.startScreenshare(callId, {
          mediaSourceId: mediaSourceId
        });
      })
      .catch();
  },
  stopScreenshare: () => {
    //    var callId = firstCallId; //getSelectedCall();
    kandy.call.stopScreenshare(store.state.activeCall.id);
  },
  directTransfer: target => {
    //  var callId = firstCallId; //getSelectedCall();
    //var destination = document.getElementById('transfer-to').value;
    kandy.call.directTransfer(store.state.activeCall.id, target);
  },

  /**
   * Do consultative transfer as a two-step process, just like
   *      the join operation.
   */

  consultativeTransfer: (firstCallId, target) => {
    /*
    if (step === 'select') {
        transferCallOne = firstCallId; //getSelectedCall();
    } else if (step === 'transfer') {
        */
    let destination = firstCallId; //getSelectedCall();
    console.log(
      "Consul. transfering call (" +
        transferCallOne +
        ") to call (" +
        destination +
        "."
    );
    kandy.call.consultativeTransfer(transferCallOne, target);
    //  transferCallOne = undefined;
    // }
  },

  joinCall: targetId => {
    //  var callId = firstCallId; //getSelectedCall();
    //var destination = document.getElementById('transfer-to').value;
    kandy.call.join(store.state.activeCall.id, targetId);
  },

  sendMessage: (participant, message1) => {
    //currentConvo = self.getConversation(participant)
    const currentConvo = kandy.conversation.get(participant, options);
    let convoExist = false;
    const message = currentConvo.createMessage(message1);
    store.state.conversations.forEach(function(conv) {
      if (conv.destination === currentConvo.destination) convoExist = true;
    });
    if (!convoExist) {
      store.commit("ADD_CONVERSATION", currentConvo);
    }
    message.send();
    Object.keys(currentConvo).forEach(function(key) {
      console.log(key, currentConvo[key]);
    });
    //console.log('currentConvo: ' + currentConvo)
  },

  // ///////////// CONVERSATIONS /////////////
  /*
  * Attempts to retrieve a list of conversations that the current user is a part of.
  * These conversations can then be retrieved from the store using getConversations.
  *
  * @public
  * @memberof Messaging
  * @requires fetchConversations
  * @method fetchConversations
  */
  fetchConversations: () => {
    kandy.conversation.fetch();
  },
  refreshContacts: () => {
    kandy.contacts.refresh();
  },
  /////////////// CALL HISTORY /////////////
  retrieveCallLogs: (amount = 20, offset = 0) => {
    kandy.call.history.fetch(amount, offset); //fetch
  },
  removeCallLog: recordId => {
    kandy.call.history.remove(recordId); //remove
  },
  removeCallHistory: () => {
    kandy.call.history.clear("all"); //clear
  },
  getCallLogs: () => {
    let logs = kandy.call.history.get();
    store.commit("REFRESH_CALLLOGS", logs);
  },
  /**
   * Add a contact to a user's personal address book.
   *
   * @method addContact
   * @param {Object} contact The contact object.
   */
  addContact1: contact => {
    kandy.user.addContact(contact);
  },
  /**
   * Remove a contact from a personal address book.
   *
   * @method removeContact
   * @param  {string} id The Id of the contact that will be removed.
   */
  removeContact: id => {
    kandy.user.removeContact(id);
  },
  /**
   * Update a contact from the user's personal address book.
   *
   * @method updateContact
   * @param  {string} id The id of the contact that will be updated.
   * @param  {Object} contact The contact object.
   */
  updateContact: (id, contact) => {
    kandy.user.updateContact(id, contact);
  },
  /**
   * Search the users in the directory.
   *
   * @method searchDirectory
   * @param  {string} criteria Search criteria.
   * @param  {string} type The type of criteria. Can be `FIRSTNAME`, `LASTNAME`, `NAME`, `PHONENUMBER` or `USERNAME`.
   */
  searchDirectory: (criteria, type) => {
    kandy.contacts.search(criteria, type);
  },
  /**
   * Get user details from the server.
   *
   * @method fetchUser
   * @param  {string} userId The Id of the user to fetch.
   */
  fetchUser: userId => {
    kandy.cacheUser(userId);
  },
  /**
   * Get user from local state.
   *
   * @method getUser
   * @param  {string} userId The Id of the user to get.
   * @return {User} A User object for the requested user.
   */
  getUser: userId => {
    kandy.getUser({ userId });
  },
  /**
   * Get currently logged in user data from the local state.
   *
   * @method getSelf
   * @return {User} A User object for the currently logged in user.
   */
  getSelf: () => {
    kandy.getState();
  },

  // Advanced screenshare - Get media stream from extension (for Chrome).
  getMediaStreamId: () => {
    return new Promise(function(resolve, reject) {
      let extId = document.getElementById("extension-id").value;
      // Send our extension a message, asking for the media source id.
      window.chrome.runtime.sendMessage(
        extId,
        {
          message: "chooseDesktopMedia"
        },
        response => {
          if (response && response.mediaSourceId) {
            resolve(response.mediaSourceId);
          } else {
            console.error("Could not get mediaSourceId.");
            reject();
          }
        }
      );
    });
  }
};

export default Kandyjs;
