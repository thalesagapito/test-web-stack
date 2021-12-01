import { mount } from '@vue/test-utils'
import BaseButton from '../components/base/BaseButton.vue'

describe('Base Button', () => {
  it('should display label received through props', async() => {
    const label = 'my label'
    const button = mount(BaseButton, { props: { label } })

    expect(button.html().toLowerCase()).toContain(label)
  })

  it('should generate different html when receiving different type props', async() => {
    const label = 'button'
    const primaryButton = mount(BaseButton, { props: { label, type: 'primary' } })
    const secondaryButton = mount(BaseButton, { props: { label, type: 'secondary' } })

    expect(primaryButton.html()).not.toEqual(secondaryButton.html())
  })

  it('should generate different html when receiving different loading props', async() => {
    const label = 'button'
    const loadingButton = mount(BaseButton, { props: { label, loading: true } })
    const notLoadingButton = mount(BaseButton, { props: { label, loading: false } })

    expect(loadingButton.html()).not.toEqual(notLoadingButton.html())
  })

  it('should not emit clicks when receiving disabled prop', async() => {
    const label = 'button'

    const disabledButton = mount(BaseButton, { props: { label, disabled: true } })
    disabledButton.trigger('click')
    expect(disabledButton.emitted('click')).toBeFalsy()

    const nonDisabledButton = mount(BaseButton, { props: { label, disabled: false } })
    nonDisabledButton.trigger('click')
    expect(nonDisabledButton.emitted('click')).toBeTruthy()
  })
})
