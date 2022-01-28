<script>
  import { BLANK } from "./utils.js";
  export let url, title, data;
</script>

<div class="section">
  <h3>
    {#if url}
      <a href={url} target={BLANK}>{title}</a>
    {:else}
      {title}
    {/if}
  </h3>
  <div>
    {#each data as paragraph}
      <p>
        {@html paragraph}
      </p>
    {/each}
  </div>
</div>

<style>
  .section {
    padding: 20px 0;
    margin: 10px 0;
    padding: 10px 5px;
    padding-left: 15px;
    opacity: 1;
  }

  .section h3 {
    padding: 5px;
    border-bottom: 1px groove black;
    margin-bottom: 10px;
    width: max-content;
  }

  .section h3:hover {
    border-color: rgb(218, 0, 0);
  }

  .section div {
    padding-left: 5px;
  }
</style>
