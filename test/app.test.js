var vumigo = require('vumigo_v02');
var fixtures = require('./fixtures');
var AppTester = vumigo.AppTester;
var test_config = require('./config');
var utils = require('../src/utils');
require('should');
require('replay');

describe("app", function () {
  describe("GoApp", function () {
    var app;
    var tester;

    beforeEach(function () {
      app = new go.app.GoApp();

      tester = new AppTester(app);

      tester
        .setup.config.app(test_config.config)
        .setup(function (api) {
          fixtures().forEach(api.http.fixtures.add);
        });
    });

    describe("when the user starts a session", function () {
      it("should respond with welcome_message", function () {
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

    describe("when the user starts a session with a keyword in the message", function () {
      it("should respond with welcome_message and send an email", function () {
        return tester
          .start()
          .input('test this sms out')
          .check.interaction({
            state: 'states:start',
            reply: test_config.config.welcome_message
          })
          .check.reply.ends_session()
          .run();
      });
    });

    describe('utils', function () {
      describe('format_address', function () {
        it('should format the user address correctly', function () {
          utils.format_address('+1234657890').should.eql('*******7890');
          utils.format_address('+1234').should.eql('*1234');
          utils.format_address('+123').should.eql('+123');
          utils.format_address('test@test.net').should.eql('*********.net');
        });
      });

      describe('isNoU', function () {
        it('should detect nulls and undefines', function () {
          var test_obj = {};
          utils.isNoU(null).should.eql(true);
          utils.isNoU(test_obj).should.eql(false);
          utils.isNoU(test_obj.value).should.eql(true);
        });
      });

      describe('process_keywords', function () {
        it('should return false when keyword is not found', function () {
          var msg = {
            content: 'hi'
          };
          var keywords = ['test', 'test1'];

          utils.process_keywords(msg, keywords).should.eql(false);
        });

        it('should not match partial worlds', function () {
          var msg = {
            content: 'testing tester'
          };

          var keywords = ['test', 'test1'];

          utils.process_keywords(msg, keywords).should.eql(false);
        });

        it('should match whole worlds', function () {
          var msg = {
            content: 'testing tester'
          };

          var keywords = ['test', 'test1', 'tester'];

          utils.process_keywords(msg, keywords).should.eql(true);
        });

        it('should match whole worlds ignoring case', function () {
          var msg = {
            content: 'testing TeStEr'
          };

          var keywords = ['test', 'test1', 'tEstEr'];

          utils.process_keywords(msg, keywords).should.eql(true);
        });

        it('should match whole worlds in the begining of the message', function () {
          var msg = {
            content: 'tester testing'
          };

          var keywords = ['test', 'test1', 'tester'];

          utils.process_keywords(msg, keywords).should.eql(true);
        });

        it('should match whole worlds in the middle of the message', function () {
          var msg = {
            content: 'tester testing'
          };

          var keywords = ['test', 'test1', 'tester'];

          utils.process_keywords(msg, keywords).should.eql(true);
        });
      });
    });
  });
});
