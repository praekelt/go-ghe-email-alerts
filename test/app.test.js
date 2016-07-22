var vumigo = require('vumigo_v02');
var fixtures = require('./fixtures');
var AppTester = vumigo.AppTester;
var test_config = require('./config');
var utils = require('../src/utils');
require('should');


describe("app", function() {
    describe("GoApp", function() {
        var app;
        var tester;

        beforeEach(function() {
            app = new go.app.GoApp();

            tester = new AppTester(app);

            tester
                .setup.config.app(test_config.config)
                .setup(function(api) {
                    fixtures().forEach(api.http.fixtures.add);
                });
        });

        describe("when the user starts a session", function() {
            it("should respond with welcome_message", function() {
                return tester
                    .start()
                    .input('hi')
                    .check.interaction({
                        state: 'states:start',
                        reply: test_config.config.welcome_message 
                    })
                    .check.reply.ends_session()
                    .run();
            });
        });

        describe('utils', function() {
            describe('format_address', function() {
                it('should format the user address correctly', function() {
                    utils.format_address('+1234657890').should.eql('*******7890');
                    utils.format_address('+1234').should.eql('*1234');
                    utils.format_address('+123').should.eql('+123');
                    utils.format_address('test@test.net').should.eql('*********.net');
                }); 
            });

            describe('isNoU', function() {
                it('should detect nulls and undefines', function() {
                    var test_obj = {};
                    utils.isNoU(null).should.eql(true);
                    utils.isNoU(test_obj).should.eql(false);
                    utils.isNoU(test_obj.value).should.eql(true);
                });
            });

            describe('process_keywords', function() {
            });

            describe('send_email', function() {
            });
        });
    });
});
