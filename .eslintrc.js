module.exports = {
  env: {
    es2021: true,
  },
  extends: [
    "airbnb-base",
    "airbnb-typescript/base",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "plugin:prettier/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
  ],

  plugins: ["@typescript-eslint"],
  rules: {
    "prettier/prettier": "error",
  },
};
