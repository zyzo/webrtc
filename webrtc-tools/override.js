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
  var logPrefix = "WebRTC-tools > ";
  console.log(logPrefix + "WebRTC Tools extension is running on this page.");

  // Hijack window.webkitRTCPeerConnection.
  var webkitRTCPeerConnection_ = window.webkitRTCPeerConnection;
  window.webkitRTCPeerConnection = function (pcConfig, pcConstraints) {
    var pc = new webkitRTCPeerConnection_(pcConfig, pcConstraints);

    // Overwrite addIceCandidate such that non-relay candidates are never passed
    // to the peer connection.
    var addIceCandidate_ = pc.addIceCandidate.bind(pc);
    pc.addIceCandidate = function(candidate, successCallback, failureCallback) {
      if (candidate.candidate.indexOf("typ relay ") != -1) {
        addIceCandidate_(candidate, successCallback, failureCallback);
      } else {
        console.log(logPrefix + "Dropping addIceCandidate of non relay type: " + candidate.candidate);
        successCallback();
      }
    }

    return pc;
  }
})();

