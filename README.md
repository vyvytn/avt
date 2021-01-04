# avt-dj

> DJ Tool, Gruppenarbeit im Rahmen von Audio- und Videotechnik an der HTW Berlin

## Install

```sh
npm install

npm run dev
```
<!--
# concurrently run vue server and server
-->

## Test

```sh
npm test

# only unit tests
npm run unit
```

## Deployment

```sh
npm run prod
```
<!--
# fill in these freesound config files (server)
# start server - server static files via server?
-->

## API

Response format:
```json
{
  "error": false,
  "errorMsg": "",
  ...
}
```

### GET `/sounds/:id`

Get sound meta data.

<!-- Todo: insert docu url -->
Res: [see freesound docs]()

### GET `/download/:id`

Download sound data.

Res: Stream of audio data. Encoding specified in the meta data.

## Dependencies

- `axios` - ajax/fetch library
- `body-parser` - express middleware
- `express` - http server
- `vue` - spa framework

