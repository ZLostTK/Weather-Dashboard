<template>
  <div :class="cardVariants()">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { cva } from 'class-variance-authority';

const cardVariants = cva(
  "rounded-lg border bg-card text-card-foreground shadow-sm",
);
</script>