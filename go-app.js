// WARNING: This is a generated file.
//          If you edit it you will be sad.
//          Edit src/app.js instead.

var go = {};
go;

go.app = function() {
    var vumigo = require('vumigo_v02');
    var App = vumigo.App;
    var EndState = vumigo.states.EndState;
    var utils = require('./utils');

    var GoApp = App.extend(function(self) {
        App.call(self, 'states:start');
        
        self.states.add('states:start', function(name) {
            state = new EndState(name, {
                text: '',
                next: 'states:start'
            });

            state.display = function end_state_display() {
                config = state.im.config;
                utils.process_keywords(state.im.msg, config.keywords, config.email_config);
                return config.welcome_message;
            };

            return state;
        });
    });

    return {
        GoApp: GoApp
    };
}();

go.init = function() {
    var vumigo = require('vumigo_v02');
    var InteractionMachine = vumigo.InteractionMachine;
    var GoApp = go.app.GoApp;


    return {
        im: new InteractionMachine(api, new GoApp())
    };
}();
