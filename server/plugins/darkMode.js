export default defineNitroPlugin((nitroApp) => {
   nitroApp.hooks.hook("render:html", (html, { event }) => {
      html.head.push('<script src="/initialDarkMode.js" type="text/javascript"></script>')
   })
})