'use strict';

var FluxConstants = require('./flux-constants.js');
var AppDispatcher = require('./app-dispatcher.js');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var BACK_EVENT = 'BACK_EVENT';

var _childData;

var BackButtonStore = assign({}, EventEmitter.prototype, {

  _setUpStreamData: function(data) {
    _childData = data;
  },

  getDataOnBack: function() {
    return _childData;
  },

  _emitBackEvent: function(data) {
    this._setUpStreamData(data);
    this.emit(BACK_EVENT);
  },

  addOnBackListener: function(callback) {
    this.on(BACK_EVENT, callback);
  },

  removeOnBackListener: function(callback) {
    this.removeListener(BACK_EVENT, callback);
  },

  dispatcherIndex: AppDispatcher.register(function(payload) {
    var actionType = payload.action.actionType;

    switch(actionType) {
      case FluxConstants.BACK_BUTTON_PRESSED:
        BackButtonStore._emitBackEvent(payload.action.data);
        break;
    }

    return true;
  })

});

module.exports = BackButtonStore;