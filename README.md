# Test client for BBZFC project

Application built for demo purposes.

Testing capabilities of [Three.js](https://github.com/mrdoob/three.js/).

Based on the starter [valera-rozuvan/three-js-webpack-starter](https://github.com/valera-rozuvan/three-js-webpack-starter).

## Live version

... setup of deploy to a `dev` and `prod` env is in progress ...

## Running & Building

To start hacking:

```
git clone git@github.com:bbzfc/test-client.git
cd ./test-client
npm install
npm run start
```

This will get you a development server up and running with livereload capability.
Navigate to `http://localhost:3000/` and observe `;-)`

To generate static files:

```
npm run build:local
```

This will produce a `./build` folder with `html`, `js`, and `css` files.

## Production mode

To build the application for production environment, we need to disable source maps and also minify
the static files. The following command will do this:

```
npm run build
```

## License

Licensed under the MIT license. See [LICENSE](LICENSE) file for more details.

## Enjoy ;)
