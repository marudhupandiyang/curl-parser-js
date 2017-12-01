const optionsRegex = /(--[a-zA-Z\-]+ '.*?')|(--[a-zA-Z\-]+)|(-[a-zA-Z\-]+? '.+?')|('?[a-z]+:\/\/.*?'+?)|("?[a-z]+:\/\/.*?"+?)/g; // eslint-disable-line
const urlRegex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/; // eslint-disable-line

export function parse(command = '') {
  const trimmedCmd = command.trim();

  const parsedOptions = {
    url: '',
    headers: {},
  };

  // quit if the command does not starts with curl
  if (trimmedCmd.indexOf('curl') !== 0) {
    console.error('Not a valid curl command'); // eslint-disable-line
    return parsedOptions;
  }

  const matches = trimmedCmd.match(optionsRegex);

  matches.forEach((val = '') => {
    let trimmedVal = val.trim();

    // URL MATCHER starts
    if (['\'', '"'].includes(trimmedVal[0])) {
      trimmedVal = trimmedVal.substr(1, trimmedVal.length - 2);
    }

    const urlMatch = trimmedVal.match(urlRegex);
    if (urlMatch && urlMatch.length > 0) {
      parsedOptions.url = urlMatch[0]; // eslint-disable-line

      const paramPosition = parsedOptions.url.indexOf('?');
      if (paramPosition !== -1) {
        // const splitUrl = parsedOptions.url.substr(0, paramPosition);
        const paramsStr = parsedOptions.url.substr(paramPosition + 1);
        const params = paramsStr.split('&') || [];

        parsedOptions.queryString = {};

        params.forEach((param) => {
          const splitParam = param.split('='); // eslint-disable-line
          parsedOptions.queryString[splitParam[0]] = splitParam[1]; // eslint-disable-line
        });
      }
      return;
    }
    // URL MATCHER ends

    // Other options starts
    if (trimmedVal.startsWith('-H ') || trimmedVal.startsWith('--headers ')) {
      let newVal = trimmedVal.substr(trimmedVal.indexOf(' ')).trim();
      if (['\'', '"'].includes(newVal[0])) {
        newVal = newVal.substr(1, newVal.length - 2);
      }
      const splitHeader = newVal.split(':');
      parsedOptions.headers[splitHeader[0].trim()] = splitHeader[1].trim();
    } else if (trimmedVal.startsWith('--data ') || trimmedVal.startsWith('--data-ascii ') || trimmedVal.startsWith('-d ') || trimmedVal.startsWith('--data-raw ') || trimmedVal.startsWith('--dta-urlencode ') || trimmedVal.startsWith('--data-binary ')) {
      let newVal = trimmedVal.substr(trimmedVal.indexOf(' ')).trim();
      if (['\'', '"'].includes(newVal[0])) {
        newVal = newVal.substr(1, newVal.length - 2);
      }
      parsedOptions.body = newVal;
    }
    // Other options ends
  }); // parse over matches ends

  if (parsedOptions.body && parsedOptions.headers['content-type'] && parsedOptions.headers['content-type'].indexOf('application/json') !== -1) {
    try {
      parsedOptions.body.replace('\\"', '"');
      parsedOptions.body.replace("\\'", "'");
      parsedOptions.body = JSON.parse(parsedOptions.body);
    } catch (ex) {
      // ignore json conversion error..
      console.log('Cannot parse JSON Data ' + ex.message); // eslint-disable-line
    }
  }

  return parsedOptions;
}

export default parse;
