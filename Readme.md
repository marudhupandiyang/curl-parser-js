# curl-parser-js
  **Final javascript size is 2.58kB only!!**

  Simple javascript library to parse `cUrl command` to `json object`. Regex based matching without adding any complex parser code/library. Can be used in `Node`, in any `frontend project` or as `standalone js file`.

  With the generated json object you may construct your own `ajax` call using your `favourite` library.

  ## Usage

  ### Standalone

  Add your script tag

      <script src="https://cdn.jsdelivr.net/npm/curl-parser-js@0.0.3/dist/parse-curl-js.js"></script>

  Parse your cmd

      const curlCmd = `curl 'http://server.com:5050/a/c/getName/?param1=pradeep&param2=kumar&param3=sharma'`;
      parse_curl_js.parse(curlCmd);

  Standalone Demo on [Codepen](https://codepen.io/marudhupandiyang/pen/jaXRYp?editors=0010)

  ### Node/frontend projects who support modules importing.

    import Curlparser from 'curl-parser-js';

    Assume you have your `cUrl` command as a string constant

    const curlCmd = `curl 'http://server.com:5050/a/c/getName'`;

    ### Execute parser to parse the curl command
    const result = parsecurl(curlCmd);

   `console.log(JSON.stringify(result, null, 2));` will result in

    {
     "url": "http://server.com:5050/a/c/getName",
     "headers": {}
    }


   ### cUrl command with query params

    const curlCmd = `curl 'http://server.com:5050/a/c/getName/?param1=pradeep&param2=kumar&param3=sharma'`;
    const result = parsecurl(curlCmd);


   `console.log(JSON.stringify(result, null, 2));` will result in

    {
      "url": "http://server.com:5050/a/c/getName/?param1=pradeep&param2=kumar&param3=sharma",
      "headers": {},
      "queryString": {
        "param1": "pradeep",
        "param2": "kumar",
        "param3": "sharma"
      }
    }

   ### cUrl command with post data

     const curlCmd = `curl 'https://exampleserver.com/api/v5/tracktime/' -H 'origin: https://exampleserver.com' -H 'accept-encoding: gzip, deflate, br' -H 'accept-language: en-GB,en-US;q=0.8,en;q=0.6' -H 'authorization: JWT eyJiOjE1MTIyMTIyNzYsIm9yaiOjE1MTIyMTIyNzYsIm9yaJ9.eyJ2ZXJzaW9uIjoiMjciLCJleHAiOjE1MTIyMTIyNzYsIm9yaiOjE1MTIyMTIyNzYsIm9yaLCJ1c2VyX2lkIjo1MTAsImVtYWlsIjoibWFydWRodS5ndW5iOjE1MTIyMTIyNzYsIm9yam5hbWUiOiJtYXJ1ZGh1Lmd1iOjE1MTIyMTIyNzYiOjE1MTIyMTIyNzYsIm9yafQ._BuiOjE1MTIyMTIyNzYsIm9yadJ__2iOjE1MTIyMTIyNzYsIm9yaRTmNcW0' -H 'content-type: application/json; charset=UTF-8' -H 'accept: */*' -H 'referer: https://exampleserver.com/timeSheetChange' -H 'authority: exampleserver.com' -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36' --data-binary '{"action":"Add custom time","data":"November 27, 2017 - December 03, 2017"}' --compressed`;
     const result = parsecurl(curlCmd);

   `console.log(JSON.stringify(result, null, 2));` will result in

    {
      "url": "https://exampleserver.com/api/v5/tracktime/",
      "headers": {
        "origin": "https",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "en-GB,en-US;q=0.8,en;q=0.6",
        "authorization": "JWT eyJiOjE1MTIyMTIyNzYsIm9yaiOjE1MTIyMTIyNzYsIm9yaJ9.eyJ2ZXJzaW9uIjoiMjciLCJleHAiOjE1MTIyMTIyNzYsIm9yaiOjE1MTIyMTIyNzYsIm9yaLCJ1c2VyX2lkIjo1MTAsImVtYWlsIjoibWFydWRodS5ndW5iOjE1MTIyMTIyNzYsIm9yam5hbWUiOiJtYXJ1ZGh1Lmd1iOjE1MTIyMTIyNzYiOjE1MTIyMTIyNzYsIm9yafQ._BuiOjE1MTIyMTIyNzYsIm9yadJ__2iOjE1MTIyMTIyNzYsIm9yaRTmNcW0",
        "content-type": "application/json; charset=UTF-8",
        "accept": "*/*",
        "referer": "https",
        "authority": "exampleserver.com",
        "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36"
      },
      "body": {
        "action": "Add custom time",
        "data": "November 27, 2017 - December 03, 2017"
      }
    }

   ## Roadmap

   1. Add plugins to generate request for different libraries.


