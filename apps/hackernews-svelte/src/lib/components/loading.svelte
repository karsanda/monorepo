<script lang="ts">
  let { label, lines = 6 }: { label: string; lines?: number } = $props()
</script>

<div class="status" role="status" aria-busy="true">
  <span class="visually-hidden">{label}</span>
  {#each { length: lines }, i (i)}
    <span class="skeleton" style:width="{60 + ((i * 37) % 35)}%"></span>
  {/each}
</div>
