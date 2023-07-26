# Test client for BBZFC project

Application built for demo purposes.

Testing capabilities of [Three.js](https://github.com/mrdoob/three.js/).

Based on the starter [valera-rozuvan/three-js-webpack-starter](https://github.com/valera-rozuvan/three-js-webpack-starter).

## Live version

... setup of deploy to a `dev` and `prod` env is in progress ...

## Running locally

To start hacking on the app:

```shell
git clone git@github.com:bbzfc/test-client.git
cd ./test-client
npm install
npm run start
```

You also need to start up a static server to host asset files such as gltf objects.

As a quick solution, use [http-server](https://www.npmjs.com/package/http-server). Install it globally, and then run in a separate terminal (from within root directory of the project):

```shell
http-server --cors='*' --port 3001 ./assets
```

This will get you a development server up and running with livereload capability.
Navigate to `http://localhost:3000/` and observe `;-)`

## Building for deploys

### Debug mode

```shell
npm run build:local
```

This will produce a `./build` folder with `html`, `js`, and `css` files. Source maps will be generated as well. Use for debugging builds.

### Production mode

To build the application for production environment, we need to disable source maps and also minify the static files. The following command will do this:

```shell
npm run build
```

## License

Licensed under the MIT license. See [LICENSE](LICENSE) file for more details.

## Enjoy ;)
