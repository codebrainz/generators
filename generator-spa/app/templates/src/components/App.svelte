<script lang="ts">
  export let title: string = "The Application";
</script>

<h1>{title}</h1>
<h2>Is <span class="loaded">loaded</span>...</h2>

<style lang="scss">
  $color: salmon;
  h2 {
    color: teal;
    .loaded {
      color: $color;
    }
  }
</style>
