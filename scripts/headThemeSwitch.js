const systemColor = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
const savedThemeSetting = localStorage.getItem('theme-setting')
const colorScheme = savedThemeSetting === 'system' || !savedThemeSetting ? systemColor : savedThemeSetting
document.documentElement.setAttribute('theme', colorScheme)