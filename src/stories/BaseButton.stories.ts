import BaseButton from '../components/base/BaseButton.vue'

export default {
  title: 'Base/Button',
  component: BaseButton,
  argTypes: {
    onClick: {},
    type: {
      control: { type: 'radio' },
      options: ['primary', 'secondary'],
    },
    loading: {
      type: 'boolean',
    },
    disabled: {
      type: 'boolean',
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
