//
// Copyright 2014 Google Inc. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
(function () {
  // TODO(andresp): These settings should be settable runtime and not
  // require modify the source code and reloading the extension.
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

  var logPrefix = "WebRTC-tools > ";
  console.log(logPrefix + "WebRTC Tools extension is running on this page: " + JSON.stringify(settings));

  // Hijack window.webkitRTCPeerConnection.
  var webkitRTCPeerConnection_ = window.webkitRTCPeerConnection;
  window.webkitRTCPeerConnection = function (pcConfig, pcConstraints) {
    if (typeof settings.overridePcConfig != 'undefined')
      pcConfig = settings.overridePcConfig;

    if (typeof settings.overridePcConstraints != 'undefined')
      pcConstraints = settings.overridePcConstraints;

    var pc = new webkitRTCPeerConnection_(pcConfig, pcConstraints);

    if (settings.ignoreAddNonRelayIceCandidates === true) {
      var addIceCandidate_ = pc.addIceCandidate.bind(pc);
      pc.addIceCandidate = function(candidate, successCallback, failureCallback) {
        if (candidate.candidate.indexOf("typ relay ") == -1) {
          console.log(logPrefix + "Dropping addIceCandidate of non relay type: " + candidate.candidate);
          successCallback();
        } else {
          addIceCandidate_(candidate, successCallback, failureCallback);
        }
      }
    }

    return pc;
  }
})();

