/** @type {import("prettier").Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  plugins: [require.resolve("prettier-plugin-tailwindcss")],
};

module.exports = config;
