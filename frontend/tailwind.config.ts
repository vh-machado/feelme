import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  theme: {
    extend: {
      fontFamily: {
        k2d: ['K2D'],
        montserrat: ['Montserrat']
      },
      colors: {
        'dark-purple': '#2C2739',
        'rich-black': '#0D1F2E'
      }
    }
  }
}