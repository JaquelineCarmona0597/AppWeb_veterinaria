// PostCSS config using the Tailwind PostCSS plugin and autoprefixer (ESM)
// Do NOT paste this file contents into your PowerShell prompt. Edit the file in the editor.
import tailwindPostcss from '@tailwindcss/postcss'
import autoprefixer from 'autoprefixer'

export default {
  plugins: [
    tailwindPostcss(),
    autoprefixer(),
  ],
}
