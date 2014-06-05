// Copyright (c) 2014 The WebRTC project authors. All Rights Reserved.
//
// Use of this source code is governed by a BSD-style license that can
// be found in the LICENSE file in the root of the source tree.
//
// TODO(andresp): File description
(function() {

function MakeWebRTCModSettings() {
  var settings = {};

  // If set overrides the application provided peer connection config.
  settings.overridePcConfig = {
    iceServers: [
      { url: 'stun:stun.l.google.com:19302' },
      {
        username: '1401358751:156547625762562',
        credential: '8SggXyp9uVrqfrWZ/1DpuBKdmq8=',
        urls: [ 'turn:192.158.30.23:3478?transport=udp',
                'turn:192.158.30.23:3479?transport=udp' ],
      },
    ]
  };

  // If set overrides the application provided peer connection constraints.
  settings.overridePcConstraints = {
    'optional': [
      { 'googImprovedWifiBwe': true }
    ]
  };

  // If true addIceCandidates will simulate non-relay candidates are added with
  // success but never actually add them to the peer connection. When used on
  // both peers on a connection leaves TURN as the only way to establish a
  // connection.
  //
  // TODO(andresp): Switch to iceTransports constraint once Chrome supports it.
  //                https://code.google.com/p/webrtc/issues/detail?id=1179
  //
  settings.ignoreAddNonRelayIceCandidates = true;

  return settings;
}

function reloadWindowWithWebRTCMod() {
  var options = {
    ignoreCache: true,
    injectedScript: '' + CreateRTCPeerConnectionObserver(MakeWebRTCModSettings())
  };
  chrome.devtools.inspectedWindow.reload(options);
}

window.addEventListener('load', function() {
  var reloadButton = document.querySelector('.reload-button');
  reloadButton.addEventListener('click', reloadWindowWithWebRTCMod());
});
})();
