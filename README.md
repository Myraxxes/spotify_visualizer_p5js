# Spotify Art Visualizer (p5.js)

An interactive web-based visualizer that transforms Spotify album covers into animated glitch-style artwork.

Users can search for a song, select it, and see its album cover transform into a dynamic visual made with distortion, noise, and shifting colors.


## Demo
https://www.youtube.com/watch?v=UGnoSnYPFlU

## Features
- Search for songs using the Spotify API
- Select a track to generate visual effects from its album cover
- Unique visual style per song using a seeded system
- Glitch slicing distortion effects
- Animated color shifting and overlays
- Smooth transitions between songs

## How it works
Each song is turned into a unique number called a seed, generated from its name or ID.

That seed controls all visual behavior, such as:

- glitch strength
- animation speed
- color palette
- distortion style

This means every song always produces the same visual style when selected.


## Tech Stack
- JavaScript
- p5.js
- Node.js + Express
- Spotify Web API
