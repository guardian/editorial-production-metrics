module.exports = {
    env: {
        browser: true,
        es6: true,
        node: true,
    },
    // extends: "eslint:recommended",
    parser: "babel-eslint",
    parserOptions: {
        ecmaFeatures: {
            experimentalObjectRestSpread: true,
            jsx: true,
        },
        sourceType: "module",
    },
    plugins: ["react"],
    rules: {
        indent: ["warn", 4],
        "linebreak-style": ["error", "unix"],
        quotes: ["warn", "double"],
        semi: ["warn", "always"],
        "no-duplicate-imports": "error",
        "react/jsx-uses-react": "error",
        "react/jsx-uses-vars": "error",
    },
    overrides: [
        {
            files: ["**/__test__/*.spec.js"],
            env: {
                browser: false,
                jest: true,
            },
        },
    ],
};
