# Constant Chain Wallet Client App

Setup React Native following this guide: [React Native Setup](https://facebook.github.io/react-native/docs/getting-started)

## Run project:
Install dependencies, make sure [Yarn](https://yarnpkg.com/lang/en/docs/install/#mac-stable) was installed 
```sh
yarn
```

Make sure you copied `.sample.env` to `.env` (or `.env.production` in production build, will fallback to `.env` if this file was not exist) for setting enviroment varibles.

Link to  `constant-chain-web-js` (because The yarn/npm link command doesn't work because React Native packager doesn't [support symlinks.](https://github.com/facebook/metro-bundler/issues/1))
```sh
yarn add `path/to/local/project/constant-chain-web-js`
```

```
yarn postinstall
```

Start project in development
```sh
react-native run-android (for Android)
react-native run-ios (for iOS)
```

## Additional
[React Native Debugger](https://github.com/jhen0409/react-native-debugger) can help more easier to debug the app.

[VSCode](https://code.visualstudio.com/) is recommended.

Unit Testing with [Jest](https://jestjs.io/).
