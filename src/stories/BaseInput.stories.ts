import { StoryFn } from '@storybook/vue3'
import BaseInput from '../components/base/BaseInput.vue'

export default {
  title: 'Base/Input',
  component: BaseInput,
}

const Template: StoryFn = args => ({
  components: { BaseInput },
  setup: () => ({ args }),
  template: '<base-input v-bind="args" />',
})

export const Base = Template.bind({})
Base.args = {
  label: 'My input',
  placeholder: 'my input placeholder',
}
