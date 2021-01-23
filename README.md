# avt-dj

> DJ Tool, Gruppenarbeit im Rahmen von Audio- und Videotechnik an der HTW Berlin

[Live](https://dj.jneidel.com)

### Install

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
### Frontend - compile html:

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
- `axios` - ajax/fetch library
- `bitcrusher` - implementation of bitcrusher effect
- `bootstrap`/`bootstrap-vue` - framework for css/html
- `bootstrap-icon` - for icons in the media control and button
- `node-id3` - mp3 handling library
- `vue` - spa framework
- `vue-slider-component` - for each slider component
- `vue-virtual-scroll-list` - make each list able to slide
- `vuedraggable` - for draggable list

### backend
- `express` - http server
- `body-parser` - express middleware
---
# Manual

## What exactly is our *DJtool*?

- parallel playback of 2 sound tracks
- music editing with effects, tempo, volume, fading, equalizer
- setting and modification of playlists
- adding own mp3 files
- using Freesound library

## User interface
- 2 decks
  - Each deck has its audio player that shows the current song
- master area
  - for manipulating volume, tempo and fading
- music visualisation as a wave
- slider for seeking a song to a certain point
- playlist/effect window
  - change playlist, add effects, set the equalizer
- library window
  - delete/add/search songs

## How to ?
### play a song
- toggle play/pausing button for playing/pausing
- stop button resets the current song to the beginning
  - resets also effects, equalizer and tempo
- skip next/previous plays the next/previous song
    - activated effects and equalizer will be adopted
    - no end/beginning - endless looping of a playlist

### seek a song
- manipulating the slider will lead you to the chosen point in a song

### change the playlist
- change the order by dragging the songs
- adding and deleting of songs only possible in the library window
- **ADD A SONG**
  - library
    - under the tab **Bibliothek**
    - through dragging a song from the library list into the list **Deck A** or **Deck B**
    - a song can be added often
  - own mp3
    - under the tab **Musik importieren**
    - select an .mp3 file from the file explorer
    - click upload
    - song will be available under the tab **Bibliothek** in the list **Bibliothek** after the upload
    -  drag the uploaded song from the library list into  **Deck A** or **Deck B**
  - Freesound
    - search for a song with any term
    - 15 songs will be shown fitting to your search term
    - if you like a song, then click on the **ADD** button
    - applications needs some seconds for uploading the chosen song
    - afterwards the song will be available under the tab **Bibliothek** in the list **Bibliothek**
    -  drag the uploaded song from the library list into  **Deck A** or **Deck B**
- **DELETE A SONG**
  - library
    - under the tab **Bibliothek**
    - click the **trash** button within the **Bibliothek** list
    - song wont be available anymore
    - ! deletes automatically from **Deck A** and **Deck B** !
  - playlist
    - click the **trash** button within the **Deck A** or **Deck B** list
    - wont be available anymore in the playlist
    - can be added again through dragging from the **Bibliothek** list
- **CHANGE ORDER**
  - change the order of list **Deck A** or **Deck B** through dragging

### change the volume
- in the master area: slide up for increasing the volume, slide down for decreasing the volume
- **L** is for the **left** deck
- **R** is for the **right** deck
- **M** is for the **mastervolume**
### change the tempo
- in the master area: slide up for increasing the speed, slide down for decreasing the speed
- **L** is for the **left** deck
- **R** is for the **right** deck
### set the fading
- this is a **non-linear crossfader**
- on default: centered and balanced
- **slide** to the **left** to fade into the left deck or to **right** to fade into the right deck
### set the equalizer
- enable the equalizer in the checkbox under the tab **Equalizer**
- **slide up or down** at the chosen frequency
### activate effects
- under the tab **Effekte**
- switch an effect on or off by **toggling the buttons**
- effects can be activated all at once




