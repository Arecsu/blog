var storedTheme =
   localStorage.getItem('theme') ||
   (window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light');
if (storedTheme) {
   document.documentElement.setAttribute('data-theme', storedTheme);
}

document.addEventListener('DOMContentLoaded', function () {
   var color_background = getComputedStyle(
      document.documentElement
   ).getPropertyValue('--bg-color-1');

   var meta = document.createElement('meta');
   meta.name = 'theme-color';
   meta.content = color_background;
   document.head.appendChild(meta);

   // document
   // .querySelector('meta[name="theme-color"]')
   // .setAttribute('content', color_background);
   // document
   // .querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')
   // .setAttribute('content', color_background);
});

// dark theme

const toggle = document.getElementsByClassName('theme-toggle');

function theme_toggle() {
   var currentTheme = document.documentElement.getAttribute('data-theme');
   var targetTheme = 'light';

   if (currentTheme === 'light') {
      targetTheme = 'dark';
   }

   document.documentElement.setAttribute('data-theme', targetTheme);
   localStorage.setItem('theme', targetTheme);

   var color_background = getComputedStyle(
      document.documentElement
   ).getPropertyValue('--bg-color-1');

   document
      .querySelector('meta[name="theme-color"]')
      .setAttribute('content', color_background);
   //document
   //   .querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')
   //   .setAttribute('content', color_background);
}

Array.from(toggle).forEach((element) => {
   element.addEventListener('click', () => {
      theme_toggle();
   });
});

document.addEventListener('keypress', function onPress(event) {
   source = event.target;
   exclude = ['input', 'textarea'];

   if (
      (event.key === 'd' || event.key === 'D') &&
      exclude.indexOf(source.tagName.toLowerCase()) === -1
   ) {
      theme_toggle();
   }
});
