<template>
   <header>
      <div class="header-nav header-menu-left">
         <NuxtLink to="/" class="header-title">_a9r</NuxtLink>
      </div>
      <div class="header-nav header-menu-right">
         <div class="header-main-menu-container" v-click-outside="hide_menu">
            <button
               class="header-main-menu-button button-3"
               @click="show_menu = !show_menu"
            >
               <svg
                  v-if="!show_menu"
                  class="header-svg-icon"
                  viewBox="0 0 24 24"
                  height="24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
               >
                  <path
                     xmlns="http://www.w3.org/2000/svg"
                     d="M4 7C4 6.44772 4.44772 6 5 6H19C19.5523 6 20 6.44772 20 7C20 7.55228 19.5523 8 19 8H5C4.44772 8 4 7.55228 4 7ZM4 12C4 11.4477 4.44772 11 5 11H19C19.5523 11 20 11.4477 20 12C20 12.5523 19.5523 13 19 13H5C4.44772 13 4 12.5523 4 12ZM4 17C4 16.4477 4.44772 16 5 16H19C19.5523 16 20 16.4477 20 17C20 17.5523 19.5523 18 19 18H5C4.44772 18 4 17.5523 4 17Z"
                  ></path>
               </svg>
               <svg
                  v-if="show_menu"
                  class="header-svg-icon"
                  viewBox="0 0 24 24"
                  height="24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
               >
                  <path
                     xmlns="http://www.w3.org/2000/svg"
                     d="M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z"
                  ></path>
               </svg>
            </button>
            <transition name="slide-fade">
               <div class="header-main-menu" v-if="show_menu">
                  <div>
                     <NuxtLink @click.native="hide_menu" to="/blog"
                        ><span>✏️</span> Blog</NuxtLink
                     >
                     <NuxtLink @click.native="hide_menu" to="/recipes"
                        ><span>🍕</span> Recetas</NuxtLink
                     >
                     <NuxtLink @click.native="hide_menu" to="/about"
                        ><span>👻</span> Hola!</NuxtLink
                     >
                     <a
                        @click.prevent="hide_menu(true)"
                        href="https://alejandro9r.xyz"
                        target="_blank"
                        ><span>🏠</span> Casita</a
                     >
                  </div>
               </div>
            </transition>
         </div>
         <button class="button-1 header-dark-toggle" onclick="theme_toggle()">
            <svg
               class="header-svg-icon"
               fill="none"
               viewBox="0 0 24 24"
               height="24"
               width="24"
               xmlns="http://www.w3.org/2000/svg"
            >
               <path
                  xmlns="http://www.w3.org/2000/svg"
                  d="M12 2C12.5523 2 13 2.44772 13 3V4C13 4.55228 12.5523 5 12 5C11.4477 5 11 4.55228 11 4V3C11 2.44772 11.4477 2 12 2ZM19.0711 4.92893C19.4616 5.31945 19.4616 5.95261 19.0711 6.34314L18.364 7.05025C17.9735 7.44077 17.3403 7.44077 16.9498 7.05025C16.5593 6.65972 16.5593 6.02656 16.9498 5.63603L17.6569 4.92893C18.0474 4.5384 18.6806 4.5384 19.0711 4.92893ZM4.92893 4.92893C5.31945 4.5384 5.95262 4.5384 6.34314 4.92893L7.05025 5.63603C7.44077 6.02656 7.44077 6.65972 7.05025 7.05025C6.65972 7.44077 6.02656 7.44077 5.63603 7.05025L4.92893 6.34314C4.5384 5.95262 4.5384 5.31945 4.92893 4.92893ZM12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8ZM6 12C6 8.68629 8.68629 6 12 6C15.3137 6 18 8.68629 18 12C18 15.3137 15.3137 18 12 18C8.68629 18 6 15.3137 6 12ZM2 12C2 11.4477 2.44772 11 3 11H4C4.55228 11 5 11.4477 5 12C5 12.5523 4.55228 13 4 13H3C2.44772 13 2 12.5523 2 12ZM19 12C19 11.4477 19.4477 11 20 11H21C21.5523 11 22 11.4477 22 12C22 12.5523 21.5523 13 21 13H20C19.4477 13 19 12.5523 19 12ZM5.63603 16.9497C6.02656 16.5592 6.65972 16.5592 7.05025 16.9497C7.44077 17.3403 7.44077 17.9734 7.05025 18.364L6.34314 19.0711C5.95262 19.4616 5.31945 19.4616 4.92893 19.0711C4.5384 18.6805 4.5384 18.0474 4.92893 17.6568L5.63603 16.9497ZM16.9498 18.364C16.5593 17.9734 16.5593 17.3403 16.9498 16.9497C17.3403 16.5592 17.9735 16.5592 18.364 16.9497L19.0711 17.6568C19.4616 18.0474 19.4616 18.6805 19.0711 19.0711C18.6806 19.4616 18.0474 19.4616 17.6569 19.0711L16.9498 18.364ZM12 19C12.5523 19 13 19.4477 13 20V21C13 21.5523 12.5523 22 12 22C11.4477 22 11 21.5523 11 21V20C11 19.4477 11.4477 19 12 19Z"
               ></path>
            </svg>
         </button>
      </div>
   </header>
</template>

<script>
import vClickOutside from 'v-click-outside';

export default {
   data() {
      return {
         show_menu: false,
         links: { Amount: '/about', Contact: '/contact' },
      };
   },
   directives: {
      clickOutside: vClickOutside.directive,
   },
   methods: {
      hello: function (message) {
         alert(message);
      },
      hide_menu: function (prevent) {
         if (prevent == true) {
            setTimeout(function () {
               window.open('https://alejandro9r.xyz', '_blank');
            }, 300);
         }
         this.show_menu = false;
      },
   },
};
</script>

<style lang="sass" scoped>
header
   display: flex
   justify-content: space-between
   height: 4em
   align-items: center
   position: sticky
   top: 0
   z-index: 1
   background-color: var(--bg-color-1)

   // @media screen and (max-width: 1060px)

   .header-title
      color: var(--fg-color-1)
      font-size: 1.1em
      font-weight: 600

   .header-nav
      display: flex
      flex-flow: row
      align-items: center

   .header-menu-right
      gap: 0.3em

      svg.header-svg-icon
         display: block
         path
            fill: var(--fg-color-1)

      .header-flag-button
         svg
            width: 1.4em
            height: 1.4em

            transition: all .4s cubic-bezier(.61,-0.41,.24,1.21)
            &:hover
               transform: translateY(1px)

      .header-main-menu-button
         margin-top: 1px
         svg
            width: 1.8em
            height: 1.8em

      .header-dark-toggle
         cursor: pointer
         svg
            transition: all .8s cubic-bezier(.61,-0.41,.24,1.21)
            &:hover
               transform: rotate(150deg)

      .header-main-menu-container
         position: relative

         .slide-fade-enter-active
            transition: all .15s cubic-bezier(.43,.23,.5,1.4)

         .slide-fade-leave-active
            transition: all .15s cubic-bezier(.91,-0.8,.37,1.02)

         .slide-fade-enter, .slide-fade-leave-to
            transform: translateY(-10px)
            opacity: 0

         .header-main-menu
            position: absolute
            width: auto
            right: 0.55em
            top: 2.5em

            > div
               display: flex
               flex-flow: column
               white-space: nowrap
               gap: 1em
               font-weight: 500
               background-color: var(--bg-color-1)
               transition: border $t-time-normal, background-color $t-time-normal
               padding: 1.4em 1.2em
               border: 2px solid var(--fg-color-1)
               border-radius: 0.3em
               width: 100%
               height: 100%
               box-sizing: border-box

               @media screen and (max-width: 768px)
                  gap: 1.5em
                  padding: 1.6em 1.3em


               span
                  font-weight: 400
</style>
