import Vue from "vue"; // get vue
import Vuex from "vuex"; // get vuex
import VueResource from "vue-resource"; // get $http
import createKandy from "../kandy.link.js";

Vue.use(Vuex);
Vue.use(VueResource);

const state = {
  cardData: [],
  conversations: [],
  messages: [],
  calls: [],
  isloadingComplete: false,
  busy: false,
  isShow: false,
  activeContact: "",
  lastAction: "",
  user: "",
  lastCallee: ""
};

const getters = {};

const mutations = {
  updateLoadingState(state, data) {
    state.isloadingComplete = data;
  },
  updateBusyState(state, data) {
    state.busy = data;
  },
  addData(state, data) {
    state.cardData = state.cardData.concat(data);
  },
  refreshData(state, data) {
    state.cardData = data;
  },
  isShowAlert(state, data) {
    state.isShow = data;
  },
  updateLastAction(state, action) {
    state.lastAction = action;
  },
  REFRESH_DIRECTORY(state, data) {
    console.log("geldi");
    state.cardData = data;
  },
  ADD_CONVERSATION(state, conv) {
    console.log("yeni conv");
    state.conversations.push(conv);
    kandy.contacts.search(conv.destination, "USERNAME");
  },
  ADD_CONVERSATION_WITHID(state, destinationId) {
    console.log("yeni conv");
    const conv = {
      destination: destinationId
    };
    state.conversations.push(conv);
    kandy.contacts.search(conv.destination, "USERNAME");
  },
  ADD_MSG_TO_CONVERSATION(state) {
    //adds last msg to each conv
    state.conversations.forEach(function(conv) {
      const messages = conv.getMessages();
      conv.lastMessage = messages[messages.length - 1].parts[0].text;
    });
  },
  GET_MESSAGES_FROM_CONV(state) {
    console.log("add last msg to conv");
    state.messages = state.conversations[0].getMessages();
  },

  SET_USER(state, user) {
    console.log("add last msg to conv");
    state.user = user;
  },
  SET_CALLEE(state, callee) {
    // console.log ('add last msg to conv');
    state.lastCallee = callee;
  },
  SET_CONV_NAMES(state, user) {
    console.log("add last msg to conv");
    state.conversations.forEach(function(conv) {
      if (conv.destination === user.userId) {
        conv.firstName = user.firstName;
        conv.lastName = user.lastName;
      }
    });
  },
  SET_CALL_NAMES(state, user) {
    console.log("add last msg to conv");
    state.calls.forEach(function(call) {
      if (call.to === user.userId) {
        call.firstName = user.firstName;
        call.lastName = user.lastName;
      }
    });
  },
  UPDATE_CALLS(state, calls) {
    console.log("add call if not exist");
    // state.calls = calls;
    var exist = false;
    calls.forEach(function(call) {
      exist = false;
      state.calls.forEach(function(call1) {
        if (call1.to === call.to) {
          if (call.state === "IN_CALL") call1.state = "Active Call";
          else if (call.state === "ON_HOLD") call1.state = "Call on Hold";
          else if (call.state === "ON_REMOTE_HOLD")
            call1.state = "Call on Remote Hold";
          else if (call.state === "ENDED") call1.state = "Call ended";

          call1.mediaState = call.mediaState;
          let txt1 = String(call.startTime);
          call1.startTime = txt1.slice(0, 2) + ":" + txt1.slice(2);
          call1.id = call.id;
          call1.sendingVideo = call.sendingVideo;
          call1.muted = call.muted;

          exist = true;
        }
      });

      //if that call not exist, add new call to state
      if (!exist) {
        let calll = {};
        (calll.to = call.to),
          (calll.startTime = String(call.startTime)),
          (calll.state = call.state),
          (calll.sendingVideo = call.sendingVideo),
          (calll.muted = call.muted),
          state.calls.push(calll);
      }
    });
  }
};

const actions = {
  getData(context, object) {
    // state.cardData.forEach (function (contact) {
    //   console.log ('all call ids curently : ' + contact.firstName);
    // });

    const { progress, isRefresh } = object;
    progress.$Progress.start();
    // context.commit ('updateLoadingState', false);
    // context.commit ('updateBusyState', true);
    /**
     * use vue-resource
     */
    // Vue.http.get ('/mock/api.json').then (
    //   response => {
    //     const json = response.data;
    //     context.commit ('updateLoadingState', true);
    //     context.commit ('updateBusyState', false);
    //     if (isRefresh === true) {
    //       context.commit ('refreshData', json);
    //     } else {
    //       context.commit ('addData', json);
    //     }
    progress.$Progress.finish();
    //   },
    //   () => {
    //     context.commit ('updateBusyState', false);
    //     progress.$Progress.fail ();
    //   }
    // );
  },

  // normaly I shouldnt call contacts refresh whenever contact page
  // but needed bcos of search result change after a call.
  getContacts(context, object) {
    kandy.contacts.refresh();
  },

  getConversations(context) {
    // state.conversations.forEach (function (conv) {

    //   const messages = conv.getMessages ();
    //   conv.lastMessages = messages[0].parts[0].text;
    //   console.log (key, conv[key]);
    // });
    //just logging
    let currentConvo = state.conversations[0];
    Object.keys(currentConvo).forEach(function(key) {
      console.log(key, currentConvo[key]);
    });

    //   state.activeConv = conv;
    //   state.messages = conv.getMessages ();
    // state.messages.forEach (function (key) {
    //   console.log (key, state.messages[key]);
    // });

    //adds last msg to conversations..
    context.commit("ADD_MSG_TO_CONVERSATION");
  },

  getMessages(context) {
    context.commit("GET_MESSAGES_FROM_CONV");
  },

  connect({ context }, credentials) {
    addEventListeners();
    console.log(
      "credentials" + credentials.username + " " + credentials.password
    );
    kandy.connect(credentials);
  },

  disconnect({ context }) {
    context.commit(types.DISCONNECT);
  },

  call(context, callee) {
    console.log("call to:" + callee);
    kandy.call.make(callee, options);
    context.commit("SET_CALLEE", callee);
  },

  answer({ context }) {
    context.commit(types.CALL_ANSWER);
  },

  reject({ context }) {
    context.commit(types.CALL_REJECT);
  },

  ignore({ context }) {
    context.commit(types.CALL_IGNORE);
  },

  hold(context) {
    kandy.call.hold(state.calls[0].id);
  },

  unhold(context) {
    kandy.call.unhold(state.calls[0].id);
  },

  mute(context) {
    kandy.call.mute(state.calls[0].id);
  },

  end(context) {
    kandy.call.end(state.calls[0].id);
  },

  unmute(context) {
    kandy.call.unmute(state.calls[0].id);
  },
  startVideo(context) {
    kandy.call.startVideo(state.calls[0].id);
  },
  stopVideo(context) {
    kandy.call.stopVideo(state.calls[0].id);
  },
  send(context, messageObject) {
    //send;
    //context.commit (types.SEND, participant, message);
    console.log(
      "giden mesaj " +
        messageObject.message +
        " to " +
        messageObject.participant
    );
    sendMessage(messageObject.participant, messageObject.message);
  },
  fetchConversations() {
    kandy.conversation.fetch();
  },
  refreshContacts() {
    kandy.contacts.refresh();
  },
  /////////////// CALL HISTORY /////////////
  retrieveCallLogs(amount = 20, offset = 0) {
    kandy.call.history.fetch(amount, offset); //fetch
  },
  removeCallLog(recordId) {
    kandy.call.history.remove(recordId); //remove
  },
  removeCallHistory() {
    kandy.call.history.ckear("all"); //clear
  },
  getCallLogs() {
    let logs = kandy.call.history.get();
    store.commit("REFRESH_CALLLOGS", logs);
  },
  refresh(context, data) {
    context.commit("REFRESH_DIRECTORY", data);
  }
};

const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions
});

export default store;

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

function sendMessage(participant, messagetoSend) {
  //currentConvo = self.getConversation(participant)
  const currentConvo = kandy.conversation.get(participant);
  let convoExist = false;
  const message = currentConvo.createMessage(messagetoSend);

  //dont add it ıf already exist in the state
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
}

function addEventListeners() {
  kandy.on("auth:change", function(data) {
    console.log("auth:change Event Data: " + JSON.stringify(data));
    if (kandy.getConnection().isConnected === true) {
      //  store.dispatch ('refresh');
      kandy.contacts.refresh();
      //this.refreshContacts ();
      //retrieveCallLogs ();
      // Kandyjs.getCallLogs ();
      // Kandyjs.fetchConversations ();
      // Kandyjs.searchDirectory ();
    }
  });

  kandy.on("call:error", err => {
    if (store.getters.activeCall) store.dispatch("toggleActiveCall");
    console.log("call error: " + err);
  });

  kandy.on("call:stateChange", function(call) {
    var calls = kandy.call.getAll();
    store.commit("UPDATE_CALLS", calls);
    kandy.call.getAll().filter(function(call) {
      if (call.state === "IN_CALL") {
        store.dispatch("setActiveCallId", { callId: call.id });
      } else if (call.state === "ENDED") {
        store.dispatch("toggleActiveCall");
      }
    });
    kandy.contacts.search(state.lastCallee, "USERNAME");
  });

  kandy.on("call:mediaStateChange", function(params) {});

  kandy.on("call:start", function(params) {
    const calls = kandy.call.getAll();
    calls.forEach(function(call) {
      console.log("all call ids curently : " + params.callId);
      if (call.id === params.callId) {
        store.commit("SET_ACTIVE_CALL", call);
        store.dispatch("toggleActiveCall");
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
    //store.dispatch ('REFRESH_CONTACTS', params.contacts);
    store.dispatch("refresh", params.contacts);
  });

  kandy.on("directory:change", params => {
    store.dispatch("refresh");
    //  store.commit ('REFRESH_DIRECTORY', params.results);
    //   console.log ('directory' + params[0]);
    //  store.commit ('SET_USER', params.results[0]);
    store.commit("SET_CONV_NAMES", params.results[0]);
    store.commit("SET_CALL_NAMES", params.results[0]);
  });

  kandy.on("conversations:change", function(params) {
    console.log("new conversation !" + params.conversation);
    if (params.conversation) {
      store.commit("ADD_CONVERSATION", params.conversation);
    } else {
      //   kandy.contacts.search (params, 'USERNAME');
      store.commit("ADD_CONVERSATION_WITHID", params.conversationId);
    }
  });

  kandy.on("messages:change", function(params) {});

  kandy.on("user:fetch", function(params) {
    console.log("user" + params);
    const user = kandy.user.get(params.user.userId);
    kandy.contacts.search(params.user.userId, "USERNAME");

    // console.log ('new conversation' + params.conversation);
    store.commit("SET_USER", user);
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

createKandy();
