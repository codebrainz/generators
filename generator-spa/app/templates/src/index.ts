import "./styles/index.scss";
import App from "./components/App.svelte";

new App({
  target: document.body,
  props: {
    title: "Some Application",
  },
});
