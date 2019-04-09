# Add Two-Factor Authentication to Node.js Web Apps

 [![Remix on Glitch](https://cdn.glitch.com/2703baf2-b643-4da7-ab91-7ee2a2d00b5b%2Fremix-button.svg)](https://glitch.com/edit/#!/remix/verify-2fa-koa)

This project introduces the [Nexmo Verify API](https://developer.nexmo.com/verify/overview) and how to retrieve information about a number via a web interface using [Koa.js](https://koajs.com/).

To set up your own version, run the following commands after cloning the repo, or [remix the Glitch version](https://glitch.com/edit/#!/verify-2fa-koa):

```bash
$ npm install
$ cp .example-env > .env # Remember to include your own API keys
$ node server.js
```
Remember to enter your Nexmo API credentials in your `.env` file.