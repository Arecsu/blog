const colorScheme = localStorage.getItem('theme-color') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
document.documentElement.setAttribute('theme', colorScheme)
// implement theme color in head, probably an array from colorScheme
console.log(colorScheme)