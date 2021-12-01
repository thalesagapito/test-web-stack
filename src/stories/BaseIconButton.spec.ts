import { mount } from '@vue/test-utils'
import BaseIconButton from '../components/base/BaseIconButton.vue'

describe('Base IconButton', () => {
  it('should generate different html when receiving different icon props', async() => {
    const createIconButton = mount(BaseIconButton, { props: { icon: 'create' } })
    const editIconButton = mount(BaseIconButton, { props: { icon: 'edit' } })
    const deleteIconButton = mount(BaseIconButton, { props: { icon: 'delete' } })

    expect(createIconButton.html()).not.toEqual(editIconButton.html())
    expect(createIconButton.html()).not.toEqual(deleteIconButton.html())
    expect(editIconButton.html()).not.toEqual(deleteIconButton.html())
  })
})
