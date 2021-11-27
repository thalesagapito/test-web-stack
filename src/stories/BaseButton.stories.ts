import BaseButton from '../components/base/BaseButton.vue'

// More on default export: https://storybook.js.org/docs/vue/writing-stories/introduction#default-export
export default {
  title: 'Base/Button',
  component: BaseButton,
  argTypes: {
    onClick: {},
    type: {
      control: { type: 'select' },
      options: ['primary', 'secondary'],
    },
  },
}

const Template = args => ({
  components: { BaseButton },
  setup() {
    return { args }
  },
  template: '<base-button v-bind="args" />',
})

export const Primary = Template.bind({})
Primary.args = {
  type: 'primary',
  label: 'Button',
}

export const Secondary = Template.bind({})
Secondary.args = {
  type: 'secondary',
  label: 'Button',
}
