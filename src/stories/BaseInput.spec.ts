import { mount } from '@vue/test-utils'
import BaseInput from '../components/base/BaseInput.vue'

describe('Base Input', () => {
  it('should display label received through props', async() => {
    const label = 'my label'
    const input = mount(BaseInput, { props: { label } })

    expect(input.html().toLowerCase()).toContain(label)
  })

  it('should display placeholder received through props', async() => {
    const placeholder = 'my placeholder'
    const input = mount(BaseInput, { props: { placeholder } })

    expect(input.html().toLowerCase()).toContain(placeholder)
  })

  it('should emit update:model-value when typing in input', async() => {
    const label = 'my input'
    const textValue = 'text-123'

    const input = mount(BaseInput, { props: { label, type: 'primary' } })
    input.find('input').setValue(textValue)

    const [emittedValues] = input.emitted('update:modelValue') as string[][]

    expect(emittedValues[0]).toEqual(textValue)
  })
})
