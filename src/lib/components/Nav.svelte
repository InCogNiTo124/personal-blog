<script>
  import { BLANK } from "./utils.js";
  import Theme from "./Theme.svelte";

  export let segment;
</script>

<div id="top">
  <div id="nav">
    <Theme />
    <hr />
    <a class={`button ${segment === undefined ? "router-link-active" : ""}`} href=".">About</a>
    <a class={`button ${segment === "projects" ? "router-link-active" : ""}`} href="/projects">Projects</a>
    <a class={`button ${segment === "ilpc" ? "router-link-active" : ""}`} href="/ilpc">ILPC</a>
  </div>
  <hr />
  <a class="button" href="Marijan-Smetko-CV.pdf" target={BLANK}>My CV</a>
</div>

<style>
  a.router-link-active {
    color: rgb(218, 0, 0);
  }

  #top {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    font-weight: bold;
    position: sticky;
    top: 0px;
    padding: 20px;
    border-bottom: 1px solid rgb(218, 0, 0);
  }

  #nav {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    position: sticky;
  }

  @media screen and (min-width: 650px) {
    #top {
      height: 100%;
      padding-top: 100px;
      flex-direction: column;
      justify-content: start;
      border: none;
    }
    #nav {
      display: flex;
      flex-direction: column;
    }
  }
</style>
