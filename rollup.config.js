import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';

const dev = process.env.ROLLUP_WATCH === 'true';

export default {
  input: 'src/schoolday-panel.ts',
  output: {
    // Must live inside custom_components/schoolday/ — HACS copies only that folder
    // for integration-category repositories, and the integration serves it from there.
    file: 'custom_components/schoolday/frontend/schoolday-panel.js',
    format: 'es',
    sourcemap: dev,
    inlineDynamicImports: true,
  },
  plugins: [
    resolve({ browser: true }),
    commonjs(),
    typescript({ tsconfig: './tsconfig.json', sourceMap: dev, inlineSources: dev }),
    !dev && terser({ format: { comments: false } }),
  ].filter(Boolean),
};
