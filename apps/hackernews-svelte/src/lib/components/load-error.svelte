<script lang="ts">
  let { what }: { what: string } = $props()
</script>

<p class="status" role="alert">
  Couldn't load {what}. Hacker News may be slow right now;
  <button class="link-button" type="button" onclick={() => location.reload()}>try again</button>.
</p>
