<style>
  @import url(https://fonts.googleapis.com/css?family=Lato:300);
  /*! minireset.css v0.0.2 | MIT License | github.com/jgthms/minireset.css */
  html,
  body,
  p,
  ol,
  ul,
  li,
  dl,
  dt,
  dd,
  blockquote,
  figure,
  fieldset,
  legend,
  textarea,
  pre,
  iframe,
  hr,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 0;
    padding: 0;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-size: 100%;
    font-weight: normal;
  }

  ul {
    list-style: none;
  }

  button,
  input,
  select,
  textarea {
    margin: 0;
  }

  html {
    box-sizing: border-box;
  }

  * {
    box-sizing: inherit;
  }

  *:before, *:after {
    box-sizing: inherit;
  }

  img,
  embed,
  object,
  audio,
  video {
    height: auto;
    max-width: 100%;
  }

  iframe {
    border: 0;
  }

  table {
    border-collapse: collapse;
    border-spacing: 0;
  }

  td,
  th {
    padding: 0;
    text-align: left;
  }
  html {
    background-color: whitesmoke;
    font-size: 14px;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    min-width: 300px;
    overflow: hidden;
    text-rendering: optimizeLegibility;
  }

  article,
  aside,
  figure,
  footer,
  header,
  hgroup,
  section {
    display: block;
  }

  body,
  button,
  input,
  select,
  textarea {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", "Helvetica", "Arial", sans-serif;
  }

  code,
  pre {
    -moz-osx-font-smoothing: auto;
    -webkit-font-smoothing: auto;
    font-family: "Inconsolata", "Consolas", "Monaco", monospace;
    line-height: 1.25;
  }

  body {
    color: #4a4a4a;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.428571428571429;
  }

  a {
    color: #00d1b2;
    cursor: pointer;
    text-decoration: none;
    -webkit-transition: none 86ms ease-out;
    transition: none 86ms ease-out;
  }

  a:hover {
    color: #363636;
  }
</style>

<template>
  <router-view></router-view>
</template>

<script>
  import store from './vuex/store'
  
  export default {
    store
  }
</script>
