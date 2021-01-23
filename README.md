# avt-dj

> DJ Tool, Gruppenarbeit im Rahmen von Audio- und Videotechnik an der HTW Berlin

- [Live Instance](https://dj.jneidel.com)
- [Manual](documentation/manual.md#manual)

<details>
<summary><strong>Table of Contents</strong></summary>

<!-- toc -->

- [Install](#install)
- [Deployment](#deployment)
  * [Frontend](#frontend)
  * [Backend](#backend)
- [Backend API](#backend-api)
  * [GET `/search/query`](#get-searchquery)
  * [GET `/download/:id`](#get-downloadid)
- [Dependencies](#dependencies)
  * [Frontend](#frontend-1)
  * [Backend](#backend-1)

<!-- tocstop -->

</details>

## Install

```sh
npm install

npm run dev
```

## Deployment
### Frontend

Compile html:

```sh
npm run prod
```

### Backend

Fill in `config.json` with freesound `client_id`, `client_secret` and `auth_code`.

<!-- still won't work, data.json could not be loaded - worth fixing? -->

```sh
npm run server
```

## Backend API

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

### Frontend
- `axios` - ajax/fetch library
- `bitcrusher` - implementation of bitcrusher effect
- `bootstrap`/`bootstrap-vue` - framework for css/html
- `bootstrap-icon` - for icons in the media control and button
- `node-id3` - mp3 handling library
- `vue` - spa framework
- `vue-slider-component` - for each slider component
- `vue-virtual-scroll-list` - make each list able to slide
- `vuedraggable` - for draggable list

### Backend
- `express` - http server
- `body-parser` - express middleware
