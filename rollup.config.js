import typescript from 'rollup-plugin-typescript2';

export default {
  input: './src/game.ts',
  output: {
    format: 'es',
    file: 'dist/bundle.js',
    
  },
  plugins: [    
    typescript(),    
  ]
};