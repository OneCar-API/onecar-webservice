import request from 'request';
import OAuth from 'oauth-1.0a';
import crypto from 'crypto';
import api from '@shared/infra/http/apiHere';

export default async function generateToken(): Promise<void> {
  const oauth = new OAuth({
    consumer: {
      key: `${process.env.HERE_ACCESS_KEY}`,
      secret: `${process.env.HERE_ACCESS_SECRET}`,
    },
    signature_method: 'HMAC-SHA256',
    hash_function(base_string, key) {
      return crypto
        .createHmac('sha256', key)
        .update(base_string)
        .digest('base64');
    },
  });


  const request_data = {
    url: `${process.env.HERE_URL_REQUEST}`,
    method: 'POST',
    data: { grant_type: 'client_credentials' },
  };

  request(
    {
      url: request_data.url,
      method: request_data.method,
      form: request_data.data,
      headers: oauth.toHeader(oauth.authorize(request_data)),
    },
    async function (error, response, body): Promise<void> {
      if (response.statusCode !== 200) {
        console.log('HERE token was not generated!');

        return;
      }

      const result = await JSON.parse(response.body);
      api.defaults.headers.authorization = `Bearer ${result.access_token}`;
    },
  );
}

generateToken();

setInterval(() => {
  generateToken();
}, 80000);
