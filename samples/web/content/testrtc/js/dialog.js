/*
 *  Copyright (c) 2014 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

/* More information about these options at jshint.com/docs/options */
/* jshint browser: true, camelcase: true, curly: true, devel: true, eqeqeq: true, forin: false, globalstrict: true, quotmark: single, undef: true, unused: strict */

'use strict';

function TestDialog(title, durationMs) {
  this.title_ = title;
  this.durationMs_ = durationMs;
  this.stats_ = [];

  this.element_ = document.createElement('div');
  this.element_.classList.add('dialog');

  this.titleElement_ = document.createElement('div');
  this.titleElement_.classList.add('title');
  this.titleElement_.textContent = title;
  this.element_.appendChild(this.titleElement_);

  this.canvasElement_ = document.createElement('canvas');
  this.element_.appendChild(this.canvasElement_);
}

TestDialog.prototype = {
  show: function () {
    document.body.appendChild(this.element_);
    setInterval(this.updateCanvas_.bind(this), 1000);
  },

  hide: function () {
    document.body.removeChild(this.element_);
  },


  addPlot: function (stats) {
    this.stats_.push(stats);
  },

  updateCanvas_: function () {
    window.c = this.canvasElement_;
    var width = this.canvasElement_.width;
    var height = this.canvasElement_.heigth;
    var context = this.canvasElement_.getContext("2d");

    context.save();
    context.lineWidth = 10; // window.devicePixelRatio;
    if (context.lineWidth % 2)
      context.translate(0.5, 0.5);

    context.beginPath();
    context.strokeStyle = "rgba(20,0,0,0.4)";
    context.fillStyle = "rgba(214,225,254,0.8)";
    context.moveTo(0, 0);
    context.lineTo(50, 50);
    context.lineTo(width/2, height/2);
    context.lineTo(50, 100.0);
    context.fill();
    context.stroke();
    context.closePath();
    context.restore();
  }
};
