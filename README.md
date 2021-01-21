# avt-dj

> DJ Tool, Gruppenarbeit im Rahmen von Audio- und Videotechnik an der HTW Berlin

[Live](https://dj.jneidel.com)

## Install

```sh
npm install

npm run dev
```

<!--
## Test

```sh
npm test

# only unit tests
npm run unit
```
-->

## Deployment
### Frontend

Compile html:

```sh
npm run prod
```

### Server

Fill in `config.json` with freesound `client_id`, `client_secret` and `auth_code`.

<!-- still won't work, data.json could not be loaded - worth fixing? -->

```sh
npm run server
```

## API

Available at: `https://dj-api.jneidel.com`

### GET `/search/query`

Get a list of results for the query, with complete (for our purposes) meta data.

```sh
curl https://dj.jneidel.com/search/wave

# -> [
#  {"id":183881,"title":"Elementary Wave 11","artist":"Erokia","imgUrl":"https://freesound.org/data/displays/183/183881_9497060_wave_M.png","duration":51.7188}
# ... ]
```

### GET `/download/:id`

Download sound data.

```sh
curl https://dj.jneidel.com/download/183881 >wave.wav

# downloads the wave sound
```

## Dependencies

### frontend
- `vue` - spa framework
- `axios` - ajax/fetch library
- `node-id3` - mp3 handling library
- `bitcrusher` - implementation of bitcrusher effect

### backend
- `express` - http server
- `body-parser` - express middleware

