import { StoryFn } from '@storybook/vue3'
import BaseIconButton from '../components/base/BaseIconButton.vue'

export default {
  title: 'Base/IconButton',
  component: BaseIconButton,
  argTypes: {
    onClick: {},
    icon: {
      control: { type: 'radio' },
      options: ['create', 'edit', 'delete'],
    },
  },
}

const Template: StoryFn = args => ({
  components: { BaseIconButton },
  setup: () => ({ args }),
  template: '<base-icon-button v-bind="args" />',
})

export const Base = Template.bind({})
Base.args = {
  icon: 'create',
}
