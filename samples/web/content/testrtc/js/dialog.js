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
    setInterval(this.updateCanvas_.bind(this), 200);
  },

  hide: function () {
    // document.body.removeChild(this.element_);
  },


  addPlot: function (stats) {
    this.stats_.push(stats);
  },

  updateCanvas_: function () {
    window.c = this;
    var plotHeight = 100;
    var numPlots = this.stats_.length;
    var width = this.canvasElement_.width = 600;
    var height = this.canvasElement_.height = numPlots * plotHeight + 10;
    var context = this.canvasElement_.getContext("2d");

    context.save();
    context.clearRect(0, 0, width, height);

    context.lineWidth = window.devicePixelRatio;
    if (context.lineWidth % 2)
      context.translate(0.5, 0.5);

    var minTime, maxTime;
    for (var statIndex = 0; statIndex != this.stats_.length; ++statIndex) {
      var stat = this.stats_[statIndex];
    }

    for (var statIndex = 0; statIndex != this.stats_.length; ++statIndex) {
      var stat = this.stats_[statIndex];

      var getX = function (time) {
        return (time - stat.startTime_)/40000.0 * width;
      }

      var getY = function (value) {
        return (1.0 - value / stat.max_) * plotHeight + statIndex * plotHeight;
      }

      window.vy = [];
      if (stat.times.length != 0) {
        context.beginPath();
        // context.scale( 1 / 10000, 1);
        // context.translate( - stat.startTime_, 0);
        context.moveTo(getX(stat.times[0]), getY(stat.values[0]));
        for (var i = 1; i != stat.times.length; ++i) {
          window.vy.push(getY(stat.values[i]));
          context.lineTo(getX(stat.times[i]), getY(stat.values[i]));
        }
        context.moveTo(getX(stat.times[0]), getY(stat.values[0]));
        context.closePath();

        context.strokeStyle = "rgba(20,0,0,0.4)";
        context.stroke();
      }
    }

    context.restore();
  },
};
