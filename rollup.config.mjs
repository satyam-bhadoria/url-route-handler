import typescript from '@rollup/plugin-typescript';
import del from 'rollup-plugin-delete';
import dts from 'rollup-plugin-dts';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

const input = 'src/index.ts';

export default [
  {
    input,
    plugins: [
      del({
        targets: ['./dist/'],
      }),
      peerDepsExternal(),
      typescript(),
    ],
    output: [
      {
        file: 'dist/esm/index.mjs',
        format: 'es',
        sourcemap: true,
      },
      {
        file: 'dist/cjs/index.cjs',
        format: 'cjs',
        interop: 'auto',
        sourcemap: true,
      },
    ]
  },
  {
    input,
    plugins: [dts()],
    output: [
      {
        file: 'dist/esm/index.d.ts',
        format: 'es',
      },
      {
        file: 'dist/cjs/index.d.ts',
        format: 'cjs',
        interop: 'auto',
      },
    ]
  }
];
