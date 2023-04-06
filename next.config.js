/** @type {import('next').NextConfig} */
const withLess = require('next-with-less');
const withPlugins = require('next-compose-plugins');

const nextConfig = {
    reactStrictMode: true,
};

const plugins = [
    [withLess, {}],
];

module.exports = withPlugins(plugins, nextConfig);
