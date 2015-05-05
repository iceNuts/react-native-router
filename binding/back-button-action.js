'use strict';

var FluxConstants = require('./flux-constants.js');
var AppDispatcher = require('./app-dispatcher.js');

var BackButtonAction = {
  onBack: function(data) {
    if (!data)
        data = {}
    var payload = {
      actionType: FluxConstants.BACK_BUTTON_PRESSED,
      data: data
    };
    AppDispatcher.handleViewAction(payload);
  },

};

module.exports = BackButtonAction;