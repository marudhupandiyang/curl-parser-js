'use strict';

var options = require('./options.js').default;


const optionsRegex = /(--[a-zA-Z\-]+ '.*?')|(--[a-zA-Z\-]+)|(-[a-zA-Z\-]+? '.+?')|('?[a-z]+:\/\/.*?'+?)|("?[a-z]+:\/\/.*?"+?)/g

const urlRegex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/
export function parse(command = '') {
  const trimmedCmd = command.trim();

  const parsedOptions = {
    url: '',
    headers: {}
  };

  // quit if the command does not starts with curl
  if(trimmedCmd.indexOf('curl') !== 0) {
    console.error('Not a valid curl command');
    return parsedOptions;
  }

  var matches = trimmedCmd.match(optionsRegex);
  console.log(JSON.stringify(matches));


  matches.forEach((val = "") => {
    val = val.trim();

    // URL MATCHER starts
    if (['\'','"'].includes(val[0])) {
      val = val.substr(1, val.length - 2);
    }

    var urlMatch = val.match(urlRegex);
    if (urlMatch && urlMatch.length > 0) {
      parsedOptions.url = urlMatch[0];

      const paramPosition = parsedOptions.url.indexOf('?');
      if ( paramPosition !== -1) {
        let splitUrl = parsedOptions.url.substr(0, paramPosition);
        let paramsStr = parsedOptions.url.substr(paramPosition+1);
        let params = paramsStr.split('&') || [];
        console.log(params);

        parsedOptions.queryString = {};

        params.forEach((param) => {
          const splitParam = param.split("=");
          parsedOptions.queryString[splitParam[0]] = splitParam[1];
        });
      }
      return;
    }
    // URL MATCHER ends

    // Other options starts
    if (val.startsWith('-H ') || val.startsWith('--headers ')) {
      let newVal = val.substr(val.indexOf(' ')).trim();
      if (['\'','"'].includes(newVal[0])) {
        newVal = newVal.substr(1, newVal.length - 2);
      }
      const splitHeader = newVal.split(':');
      parsedOptions.headers[splitHeader[0].trim()] = splitHeader[1].trim();
    } else if (val.startsWith('--data ') || val.startsWith('--data-ascii ') || val.startsWith('-d ') || val.startsWith('--data-raw ') || val.startsWith('--dta-urlencode ') || val.startsWith('--data-binary ')) {
      let newVal = val.substr(val.indexOf(' ')).trim();
      if (['\'','"'].includes(newVal[0])) {
        newVal = newVal.substr(1, newVal.length - 2);
      }
      parsedOptions.body = newVal;
    }
    // Other options ends
  }); // parse over matches ends

  if (parsedOptions.body && parsedOptions.headers['content-type'] && parsedOptions.headers['content-type'].indexOf('application/json') !== -1) {
    try {
      parsedOptions.body.replace('\\"','"');
      parsedOptions.body.replace("\\'","'");
      parsedOptions.body = JSON.parse(parsedOptions.body);
    } catch(ex){
      // ignore json conversion error..
      console.log('Cannot parse JSON Data ' + ex.message);
    }
  }

  return parsedOptions;
}

export default parse;
