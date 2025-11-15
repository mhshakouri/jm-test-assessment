<template>
  <button
    @click.capture="toggleColorScheme"
    class="flex cursor-pointer items-center gap-2 rounded-md bg-jm-white p-2 py-4 text-jm-blue-darker transition-colors duration-200 hover:bg-jm-gray-lighter focus:ring-2 focus:ring-jm-blue-lighter focus:outline-none dark:bg-jm-blue-lighter dark:text-jm-gray-lighter dark:hover:bg-jm-blue-darker dark:focus:ring-jm-gray-lighter"
  >
    <!-- NOTE: :ssr="true" to render the icon on the server, there's a hint to avoid using it since it creates a mismatch between the client and the server, but since it's just a difference in viewBox attribute, it must not be a huge issue -->
    <Icon :icon="themeIcon" :ssr="true" data-allow-mismatch/>
    <span aria-label="Toggle color scheme" class="text-small font-light"
      >{{ theme === "light" ? "Dark" : "Light" }} mode</span
    >
  </button>
</template>
<script lang="ts" setup>
import { Icon } from "@iconify/vue";
import { useColorSchemeToggler } from "../composables/useColorSchemeToggler";

const { toggleColorScheme, themeIcon, theme } = useColorSchemeToggler();
</script>
