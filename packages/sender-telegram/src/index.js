import got from 'got';
import fetch from 'node-fetch';
import merge from 'deepmerge';

async function send(userOptions = {}, userBody = {}) {
  const options = merge({
    payload: `json`,
    apiBase: `https://api.telegram.org/bot`,
    token: process.env.TELEGRAM_TOKEN,
    method: `sendMessage`,
    requestOptions: {
      headers: {
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
      },
      retry: {
        limit: 3,
        methods: [
          'POST',
          'OPTIONS',
        ],
        statusCodes: [
          400,
          408,
          413,
          429,
          500,
          502,
          503,
          504,
          521,
          522,
          524
        ],
      }
    },
  }, userOptions);

  if (!options.token) { throw new Error(`Telegram bot token is missing`) };

  const payload = options.payload === `form` ? {
    body: userBody,
  } : {
    json: userBody,
  };

  if (options.payload === `form`) {
    // Switch to node-fetch for FormData since got is buggy
    // https://github.com/sindresorhus/got/issues/1907
    try {
      const resp = await fetch(`${options.apiBase}${options.token}/${options.method}`, {
        method: 'post',
        ...payload,
        ...options.requestOptions,
      });

      console.log(await resp.json());
      return resp
    } catch (err) {
      console.log(err);
    }
  } else {
    try {
      const resp = await got.post(`${options.apiBase}${options.token}/${options.method}`, {
        ...payload,
        ...options.requestOptions
      });

      return resp;
    } catch (err) {
      console.log(err);
    }
  }
}

export default send;
