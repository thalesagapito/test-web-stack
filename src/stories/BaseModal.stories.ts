import { ref } from 'vue'
import { StoryFn } from '@storybook/vue3'
import BaseModal from '../components/base/BaseModal.vue'

export default {
  title: 'Base/Modal',
  component: BaseModal,
  argTypes: {
    isOpen: {
      control: null,
    },
    default: {
      control: { type: 'text' },
    },
  },
}

const Template: StoryFn = args => ({
  components: { BaseModal },
  setup() {
    const isOpen = ref(false)
    return { args, isOpen }
  },
  template: `
  <button @click="isOpen = true">click me</button>
  <base-modal :title="args.title" v-model:isOpen="isOpen">
    <div class="p-8 flex justify-center items-center">
      {{ args['default'] }}
    </div>
  </base-modal>
  `,
})

export const Base = Template.bind({})
Base.args = {
  title: 'My modal',
  default: 'slot inside the modal',
}
