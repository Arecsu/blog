const systemColor = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
const savedThemeSetting = localStorage.getItem('theme-setting')
const colorScheme = savedThemeSetting === 'system' || !savedThemeSetting ? systemColor : savedThemeSetting

const metaThemeColor = document.createElement('meta')
metaThemeColor.name = 'theme-color'
metaThemeColor.content = colorScheme === 'dark' ? '#01080f' : '#fbeec0'

document.documentElement.setAttribute('theme', colorScheme)
document.head.appendChild(metaThemeColor)