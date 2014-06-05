// Copyright (c) 2014 The WebRTC project authors. All Rights Reserved.
//
// Use of this source code is governed by a BSD-style license that can
// be found in the LICENSE file in the root of the source tree.
//
(function () {
var injectFunction = function (settings) {
  settings = settings || {};

  var logPrefix = "WebRTC-devtools > ";
  console.log(logPrefix + "Config(" + JSON.stringify(settings) + ")");

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
};

// Returns a string that when executed installs wrappers to RTCPeerConnection
// constructors that help debug WebRTC apps.
window.CreateRTCPeerConnectionObserver = function (settings) {
  return '(' + injectFunction + ')(' + JSON.stringify(settings) + ');';
};
})();
