<template>
  <button
    @click.capture="toggleColorScheme"
    class="flex cursor-pointer items-center gap-2 rounded-md bg-jm-white text-jm-blue-darker dark:bg-jm-blue-lighter dark:text-jm-gray-lighter py-3 px-2 focus:outline-none focus:ring-2 focus:ring-jm-blue-lighter dark:focus:ring-jm-gray-lighter hover:bg-jm-gray-lighter dark:hover:bg-jm-blue-darker transition-colors duration-200"
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
