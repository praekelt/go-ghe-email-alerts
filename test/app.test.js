var vumigo = require('vumigo_v02');
var fixtures = require('./fixtures');
var AppTester = vumigo.AppTester;
var test_config = require('./config');
require('should');

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
          .check(function (api, im, app) {
            api.http.requests.length.should.eql(0);
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
          .check(function (api, im, app) {
            api.http.requests.length.should.eql(1);
            req = api.http.requests[0];
            email_config = test_config.config.email_config;

            // url
            req.url.should.eql('https://api.sendgrid.com/v3/mail/send');

            // headers
            req.headers.Authorization.should.eql('Bearer ' + email_config.api_key);

            // data
            req.data.personalizations.length.should.eql(1);
            req.data.personalizations[0].to.length.should.eql(1);
            req.data.personalizations[0].to[0].email.should.eql(email_config.to);
            req.data.personalizations[0].subject.should.eql(email_config.subject);
            req.data.personalizations[0].substitutions[':user_address:'].should.eql(go.utils.format_address(im.msg.from_addr));
            req.data.personalizations[0].substitutions[':message:'].should.eql(im.msg.content);
            req.data.from.email.should.eql(email_config.from);
            req.data.from.name.should.eql(email_config.from_name);
            req.data.template_id.should.eql(email_config.template);
          })
          .check.reply.ends_session()
          .run();
      });
    });
  });
});
