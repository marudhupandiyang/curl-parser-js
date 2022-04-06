const optionsRegex =
  /(--[a-zA-Z\-]+ '.*?')|(--[a-zA-Z\-]+)|(-[a-zA-Z\-]+? '.+?')|('?[a-z]+:\/\/.*?'+?)|("?[a-z]+:\/\/.*?"+?)/g // eslint-disable-line
const urlRegex =
  /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/ // eslint-disable-line

const contentTypeHeader = 'content-type'
const jsonMimeType = 'application/json'

const isMatchingOption = (headers, str) => {
  for (let i = 0; i < headers.length; i += 1) {
    if (str.startsWith(headers[i])) {
      return true
    }
  }
  return false
}

const isAHeaderOption = str => isMatchingOption(['-H ', '--headers '], str)
const isDataOption = str =>
  isMatchingOption(
    [
      '--data ',
      '--data-ascii ',
      '-d ',
      '--data-raw ',
      '--data-urlencode ',
      '--data-binary ',
    ],
    str,
  )

const removeLeadingTrailingQuotes = str => {
  const quotes = ["'", '"']
  const newStr = str.trim()
  return quotes.includes(newStr[0])
    ? newStr.substring(1, newStr.length - 1)
    : newStr
}

const subStrFrom = (val, startFromVal) => {
  const dataPosition = val.indexOf(startFromVal)
  return val.substring(dataPosition)
}

const isJsonRequest = parsedCommand =>
  parsedCommand.headers[contentTypeHeader] &&
  parsedCommand.headers[contentTypeHeader].indexOf(jsonMimeType) !== -1

const parseBodyByContentType = ({body, headers}) => {
  if (body && isJsonRequest(headers)) {
    try {
      const cleanedBodyData = body.replace('\\"', '"').replace("\\'", "'")
      return JSON.parse(cleanedBodyData)
    } catch (ex) {
      // ignore json conversion error..
      console.log('Cannot parse JSON Data ' + ex.message) // eslint-disable-line
    }
  }
  return body
}

const parseOptionValue = val => {
  const headerSplit = subStrFrom(val, ' ').split(':')
  return {
    key: headerSplit[0].trim(),
    value: headerSplit[1].trim(),
  }
}

const parseQueryStrings = url => {
  const paramPosition = url.indexOf('?')
  const queryStrings = {}
  if (paramPosition !== -1) {
    // const splitUrl = parsedCommand.url.substr(0, paramPosition);
    const paramsString = url.substring(paramPosition + 1)
    const params = paramsString.split('&') || []

    params.forEach(param => {
      const splitParam = param.split('=') // eslint-disable-line
      queryStrings[splitParam[0]] = splitParam[1] // eslint-disable-line
    })
  }
  return queryStrings
}

const parseUrlOption = val => {
  const urlMatches = val.match(urlRegex) || []
  if (urlMatches.length) {
    const url = urlMatches[0] // eslint-disable-line
    return {
      url,
      queryStrings: parseQueryStrings(url),
    }
  }
  return {url: '', queryStrings: {}}
}

const parseBody = val => removeLeadingTrailingQuotes(subStrFrom(val, ' '))

const isACurlCommand = val => val.trim().startsWith('curl ')
const isAUrlOption = val => {
  const matches = val.match(urlRegex) || []
  return !!matches.length
}

/*
 * Parse cUrl command to a JSON structure
 * params:
 * command - cUrl command as a string.
 * return JSON object
 */
export function parse(command) {
  if (!command) {
    return ''
  }

  const parsedCommand = {
    url: '',
  }

  // quit if the command does not starts with curl
  if (isACurlCommand(command)) {
    const matches = command.match(optionsRegex)
    matches.forEach(val => {
      const option = removeLeadingTrailingQuotes(val)
      if (isAUrlOption(option)) {
        const {url, queryStrings} = parseUrlOption(option)
        parsedCommand.url = url
        parsedCommand.queryStrings = queryStrings
      } else if (isAHeaderOption(option)) {
        const {key, value} = parseOptionValue(option)
        parsedCommand.headers = parsedCommand.headers || {}
        parsedCommand.headers[key] = value
      } else if (isDataOption(option)) {
        parsedCommand.body = parseBody(option)
      } else {
        console.log(`Skipped Header ${val}`) // eslint-disable-line
      }
    }) // parse over matches ends

    // should be checked after all the options are analyzed
    // so that we guarentee that we have content-type header
    parsedCommand.body = parseBodyByContentType(parsedCommand)
  }

  return parsedCommand
}

export default parse
