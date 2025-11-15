<template>
  <div ref="wrapperRef" :class="wrapperClass">
    <button
      @click.capture="toggleSelectList"
      :class="buttonClass"
      aria-label="Select an option"
    >
      <span
        v-if="modelValue?.value"
        data-close
        @click.stop="clearSelectedOption"
        :class="closeClass"
      >
        <Icon icon="mdi:close" />
      </span>
      <span :class="buttonLabelClass">{{ selectedOption.label }}</span>
      <Icon :icon="chevronIconName" :class="iconClass" />
    </button>
    <Transition
      :enter-from-class="enterFromClass"
      :enter-active-class="enterActiveClass"
      :leave-to-class="leaveToClass"
      :leave-active-class="leaveActiveClass"
    >
      <div v-if="optionListOpen" :class="optionListClass">
        <template v-for="option in optionList" :key="option.value">
          <button
            v-if="option.value !== selectedOption.value"
            :class="optionItemClass"
            class="hover:bg-jm-gray dark:hover:bg-jm-blue"
            @click="selectOption(option)"
          >
            {{ option.label }}
          </button>
        </template>
      </div>
    </Transition>
  </div>
</template>
<script setup lang="ts">
import { onClickOutside } from "@vueuse/core";
import { computed, onMounted, ref, useTemplateRef } from "vue";
import { UiSelectOption } from "../../types/ui/select";
import { Icon } from "@iconify/vue";
import { tv } from "tailwind-variants";

// Props
const props = defineProps<{
  optionList: UiSelectOption[];
  modelValue?: UiSelectOption;
  defaultButtonLabel?: string;
}>();
// Emits
const emit = defineEmits<{
  (e: "update:modelValue", value?: UiSelectOption): void;
}>();

// Refs
const wrapperRef = useTemplateRef<HTMLElement>("wrapperRef");
const optionListOpen = ref(false);

// Computed
const selectedOption = computed<UiSelectOption>(() => {
  return (
    props.modelValue ?? {
      label: props.defaultButtonLabel ?? "Select an option",
      value: undefined,
    }
  );
});
const chevronIconName = computed(() => {
  return optionListOpen.value ? "mdi:chevron-up" : "mdi:chevron-down";
});

// Methods
const toggleSelectList = (event?: Event, state?: boolean) => {
  if ((event?.target as HTMLElement)?.closest?.("[data-close]")) {
    return;
  }
  optionListOpen.value = state ?? !optionListOpen.value;
};
const clearSelectedOption = (_event?: Event) => {
  emit("update:modelValue");
  toggleSelectList(undefined, false);
};
const selectOption = (option: UiSelectOption) => {
  emit("update:modelValue", option);
  toggleSelectList();
};

// Lifecycle Hooks
onMounted(() => {
  onClickOutside(wrapperRef, (_event: Event) =>
    toggleSelectList(_event, false)
  );
});

// Theme
const uiSelectTheme = tv(
  {
    base: "relative",
    slots: {
      button:
        "flex items-center gap-2 p-4 bg-jm-white text-jm-blue-darker dark:bg-jm-blue-lighter dark:text-jm-gray-lighter p-2 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-jm-blue-lighter dark:focus:ring-jm-gray-lighter hover:bg-jm-gray-lighter dark:hover:bg-jm-blue-darker transition-colors duration-200 w-full rounded-md cursor-pointer h-10",
      buttonLabel: "flex-auto flex justify-start",
      icon: "flex-none",
      close: "flex-none hover:bg-jm-gray-lighter dark:hover:bg-jm-blue-darker text-jm-blue-darker dark:text-jm-gray-lighter p-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-jm-blue-lighter dark:focus:ring-jm-gray-lighter hover:bg-jm-gray-lighter dark:hover:bg-jm-blue-darker transition-colors duration-200",
      optionList:
        "absolute top-full mt-2 left-0 w-full bg-jm-white text-jm-blue-darker dark:bg-jm-blue-lighter dark:text-jm-gray-lighter shadow-lg rounded-md flex flex-col gap-2 p-2",
      optionItem:
        "py-1 px-4 cursor-pointer flex items-center justify-start rounded-sm text-jm-blue-darker dark:text-jm-gray-lighter",
      transitionOut: "transition duration-300 ease-out",
      transitionIn: "transition duration-300 ease-in",
      transitionLeaveTo: "opacity-0 translate-y-10",
      transitionLeaveActive: "transition duration-300 ease-in",
      transitionEnterFrom: "opacity-0 translate-y-10",
      transitionEnterActive: "transition duration-300 ease-out",
      transitionEnterTo: "opacity-100 translate-y-0",
    },
  },
  { twMerge: true }
);
const theme = computed(() => uiSelectTheme());
const wrapperClass = computed(() => theme.value.base());
const buttonClass = computed(() => theme.value.button());
const buttonLabelClass = computed(() => theme.value.buttonLabel());
const closeClass = computed(() => theme.value.close());
const iconClass = computed(() => theme.value.icon());
const enterFromClass = computed(() => theme.value.transitionEnterFrom());
const enterActiveClass = computed(() => theme.value.transitionEnterActive());
const leaveToClass = computed(() => theme.value.transitionLeaveTo());
const leaveActiveClass = computed(() => theme.value.transitionLeaveActive());
const optionListClass = computed(() => theme.value.optionList());
const optionItemClass = computed(() => theme.value.optionItem());
</script>
