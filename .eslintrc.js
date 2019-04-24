module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true,
        "jest/globals": true
    },
    "extends": ["eslint:recommended", "react-native", "plugin:jest/recommended"],
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2018,
        "sourceType": "module",
        "babelOptions": {
            "configFile": "./babel.config.js",
        },
    },
    "plugins": [
        "react",
        "react-native",
        "jest"
    ],
    "settings": {
        "import/resolver": {
          "babel-module": {}
        }
    },
    "rules": {
        "indent": [
            "error",
            2
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        "import/no-commonjs": 0,
        "react/jsx-no-bind": 0,
        "react/prop-types": 1,
        "import/prefer-default-export": 0
    }
};