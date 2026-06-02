import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import App from '../App.vue'

describe('App', () => {
  it('renders the app shell', () => {
    // Stub InventoryPage so the test does not require the Vue Query / PrimeVue plugins.
    const wrapper = mount(App, {
      global: { stubs: { InventoryPage: true } },
    })
    // Sidebar branding from the FarmaCo shell.
    expect(wrapper.text()).toContain('FarmaCo')
  })
})
