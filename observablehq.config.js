// See https://observablehq.com/framework/config for documentation.
export default {
  // The app's title; used in the sidebar and webpage titles.
  title: "Paragon | Lienzo Charro",
  
  // Base path for GitHub Pages deployment
  base: process.env.BASE_PATH || "/",

  // The pages and sections in the sidebar. If you don't specify this option,
  // all pages will be listed in alphabetical order. Listing pages explicitly
  // lets you organize them into sections and have unlisted pages.
  pages: [
    {name: "Inicio", path: "/index"},
    {name: "Resumen Ejecutivo", path: "/resumen-ejecutivo"},
    {
      name: "Análisis del Sitio",
      pages: [
        {name: "Ficha del Sitio", path: "/ficha-sitio"},
        {name: "Demanda y NSE", path: "/demanda-nse"},
        {name: "Accesibilidad", path: "/accesibilidad"}
      ]
    },
    {
      name: "Análisis de Mercado",
      pages: [
        {name: "Competencia", path: "/competencia"},
        {name: "Vocación y Tenant Mix", path: "/vocacion"},
        {name: "Afinidad Temática", path: "/afinidad-tematica"},
        {name: "Restaurante Ancla", path: "/restaurante-ancla"}
      ]
    },
    {name: "Benchmark", path: "/benchmark"},
    {name: "Anexos y Descargas", path: "/anexos"}
  ],

  // Content to add to the head of the page, e.g. for a favicon:
  head: '<link rel="icon" href="observable.png" type="image/png" sizes="32x32">',

  // The path to the source root.
  root: "src",

  // Theme configuration
  theme: "light", // Tema claro para mejor legibilidad
  
  header: "<div style='display: flex; align-items: center; gap: 0.5rem; height: 2.2rem; margin: -1.5rem -2rem; padding: 0 2rem; border-bottom: solid 1px var(--theme-foreground-faintest); font: 500 16px var(--sans-serif);'><span style='display: flex; flex-grow: 1; align-items: baseline; gap: 0.5rem; min-width: 0;'><a href='/' style='display: flex; align-items: center;'><span>Paragon | Lienzo Charro</span></a></span></div>",
  footer: "Análisis geoestadístico generado por STRTGY AI Geointelligence.",
  // sidebar: true, // whether to show the sidebar
  toc: true, // whether to show the table of contents
  // pager: true, // whether to show previous & next links in the footer
  // output: "dist", // path to the output root for build
  // search: true, // activate search
  // linkify: true, // convert URLs in Markdown to links
  // typographer: false, // smart quotes and other typographic improvements
  // preserveExtension: false, // drop .html from URLs
  // preserveIndex: false, // drop /index from URLs
};
