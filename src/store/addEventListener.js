function addEventListeners () {
  kandy.on ('auth:change', function (data) {
    console.log ('auth:change Event Data: ' + JSON.stringify (data));
    if (kandy.getConnection ().isConnected === true) {
      //  store.dispatch ('refresh');
      kandy.contacts.refresh ();
      // this.refreshContacts ();
      // retrieveCallLogs ();
      // Kandyjs.getCallLogs ();
      // Kandyjs.fetchConversations ();
      // Kandyjs.searchDirectory ();
    }
  });

  kandy.on ('call:error', err => {
    if (store.getters.activeCall) store.dispatch ('toggleActiveCall');
    console.log ('call error: ' + err);
  });

  kandy.on ('call:stateChange', function (call) {
    var calls = kandy.call.getAll ();
    // store.commit('UPDATE_CALLS', calls)
    kandy.call.getAll ().filter (function (call) {
      if (call.state === 'IN_CALL') {
        store.dispatch ('setActiveCallId', {callId: call.id});
      } else if (call.state === 'ENDED') {
        //       store.dispatch('toggleActiveCall')
      }
    });
    kandy.contacts.search (state.lastCallee, 'USERNAME');
  });

  kandy.on ('call:mediaStateChange', function (params) {});

  kandy.on ('call:start', function (params) {
    const calls = kandy.call.getAll ();
    calls.forEach (function (call) {
      console.log ('all call ids curently : ' + params.callId);
      if (call.id === params.callId) {
        //      store.commit('SET_ACTIVE_CALL', call)
        //     store.dispatch('toggleActiveCall')
        // store.commit (types.SET_ACTIVE_CALL, call);
      }
    });
  });

  kandy.on ('call:receive', params => {
    let callId = params.callId;
    let incomingCallData = {
      callId: params.callId,
      active: true,
    };
    //  store.dispatch('setIncomingCall', incomingCallData)
    //  store.dispatch('toggleNewIncomingCallModal')
  });

  kandy.on ('contacts:change', params => {
    // store.dispatch ('REFRESH_CONTACTS', params.contacts);
    //  store.dispatch('refresh', params.contacts)
  });

  kandy.on ('directory:change', params => {
    //   store.dispatch('refresh')
    //  store.commit ('REFRESH_DIRECTORY', params.results);
    //   console.log ('directory' + params[0]);
    //  store.commit ('SET_USER', params.results[0]);
    //  store.commit('SET_CONV_NAMES', params.results[0])
    //  store.commit('SET_CALL_NAMES', params.results[0])
  });

  kandy.on ('conversations:change', function (params) {
    console.log ('new conversation !' + params.conversation);
    if (params.conversation) {
      store.commit ('ADD_CONVERSATION', params.conversation);
    } else {
      //   kandy.contacts.search (params, 'USERNAME');
      //    store.commit('ADD_CONVERSATION_WITHID', params.conversationId)
    }
  });

  kandy.on ('messages:change', function (params) {});

  kandy.on ('user:fetch', function (params) {
    console.log ('user' + params);
    const user = kandy.user.get (params.user.userId);
    kandy.contacts.search (params.user.userId, 'USERNAME');

    // console.log ('new conversation' + params.conversation);
    //   store.commit('SET_USER', user)
  });
}
