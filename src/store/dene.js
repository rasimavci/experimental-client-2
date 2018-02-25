function addEventListeners () {
  console.log ('deneme');
}

// This line is used to create a new instans of Kandy

kandy = createKandy ({
  authentication: {
    subscription: {
      expires: 3600,
      service: ['IM', 'Presence', 'call'],
      protocol: 'https',
      server: 'spidr-ucc.genband.com',
      version: '1',
      port: 443,
    },
    websocket: {
      protocol: 'wss',
      server: 'spidr-ucc.genband.com',
      port: 443,
    },
  },
  logs: {
    logLevel: 'debug',
    enableFcsLogs: true,
  },
  call: {
    chromeExtensionId: 'put real extension ID here',
    serverProvidedTurnCredentials: true,
    iceserver: [
      {
        url: 'stun:turn-ucc-1.genband.com:3478?transport=udp',
      },
      {
        url: 'stun:turn-ucc-2.genband.com:3478?transport=udp',
      },
      {
        url: 'turns:turn-ucc-1.genband.com:443?transport=tcp',
        credential: '',
      },
      {
        url: 'turns:turn-ucc-2.genband.com:443?transport=tcp',
        credential: '',
      },
    ],
  },
});

kandy.connect ('args');
addEventListeners ();
