import { nodeResolve } from '@rollup/plugin-node-resolve';

export default [
    {
        input: './src/index.js',
        output: {
            file: './build/browser/bundle.js',
            name: 'tournament',
            format: 'iife'
        },
        plugins: [nodeResolve()]
    },
    {
        input: './src/index.js',
        output: {
            file: './build/es/bundle.js',
            name: 'tournament',
            format: 'es'
        },
        plugins: [nodeResolve()]
    },
    {
        input: './src/index.js',
        output: {
            file: './build/cjs/bundle.cjs',
            name: 'tournament',
            format: 'cjs'
        },
        plugins: [nodeResolve()]
    },
];