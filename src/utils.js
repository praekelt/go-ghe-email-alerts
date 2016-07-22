var _ = require('lodash');

function format_address(address) {
    if (isNoU(address) || address.length === 0) {
        return '';
    }

    var len = address.length;
    var working_len = 0;

    if (len > 4) {
        working_len = len - 4;
    }

    var rep_str = '';
    var retVal = '';

    if (working_len > 0) {
        var rx = new RegExp('.{' + working_len + '}(.*)');            

        rep_str = Array(working_len + 1).join('*');
        retVal = address.replace(rx, rep_str + '$1');
    }
    else {
        retVal = address;
    }

    return retVal;
}

function send_email(email_config, usr_addr) {
}

function process_keywords(msg, keywords, email_config) {
    var usr_msg = msg.content.toLowerCase();
    var usr_addr = format_address(msg.from_addr);

    if (
        isNoU(usr_msg) || 
        isNoU(keywords) || 
        !_.isArray(keywords) || 
        (_.isArray(keywords) && keywords.length === 0)
    ) {
        return;
    }

    _.each( keywords, function(keyword) {
        
    });

    send_email(email_config, usr_addr);
}

function isNoU(value) {
    var retVal = false;

    if (_.isNull(value) || _.isUndefined(value)) {
        retVal = true;
    }

    return retVal;
}

module.exports = {
    format_address: format_address,
    send_email: send_email,
    process_keywords: process_keywords,
    isNoU: isNoU
};
