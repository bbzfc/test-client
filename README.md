# Test client for BBZFC project

Application built for demo purposes.
Testing capabilities of [Three.js](https://github.com/mrdoob/three.js/).
Based on the starter [valera-rozuvan/three-js-webgl-playground](https://github.com/valera-rozuvan/three-js-webgl-playground).

## Live version

See a live preview of this project hosted via GitHub pages:
[https://bbzfc.github.io/test-client](https://bbzfc.github.io/test-client/dist/index.html).

## Running & Building

To start hacking:

```
git clone https://github.com/bbzfc/test-client
cd ./test-client
npm install
npm run start
```

This will get you a development server up and running with livereload capability.
Navigate to `http://localhost:8080/` and observe a spinning cube.

To generate static files:

```
npm run build
```

This will produce a `./dist` folder with `html`, `js`, and `css` files.

## Production mode

To build the application for production environment, we need to disable source maps and also minify
the static files. The following commands are available:

```
npm run start-prod
npm run build-prod
```

## License

Licensed under the MIT license. See [LICENSE](LICENSE) file for more details.

## Enjoy ;)
