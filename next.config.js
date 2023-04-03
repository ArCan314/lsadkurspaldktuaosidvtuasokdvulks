/** @type {import('next').NextConfig} */
const withLess = require('next-with-less');
const withPlugins = require('next-compose-plugins');
const withFont = require('next-fonts');

const nextConfig = {
    reactStrictMode: true,
};

const plugins = [
    [withLess, {}],
    [withFont, {}],
];

module.exports = withPlugins(plugins, nextConfig);
