import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Input from '../Input.vue';

describe('Input', () => {
    it('renders correctly with default props', () => {
        const wrapper = mount(Input, {
            props: {
                modelValue: 'test value',
            },
        });

        expect(wrapper.find('input').element.value).toBe('test value');
        expect(wrapper.classes()).toContain('flex');
        expect(wrapper.classes()).toContain('h-10');
    });

    it('renders with different types', () => {
        const types = ['text', 'email', 'password', 'number'] as const;
        
        types.forEach(type => {
            const wrapper = mount(Input, {
                props: { type, modelValue: 'test' },
            });
            
            expect(wrapper.find('input').attributes('type')).toBe(type);
        });
    });

    it('renders with placeholder', () => {
        const wrapper = mount(Input, {
            props: {
                placeholder: 'Enter your name',
                modelValue: '',
            },
        });

        expect(wrapper.find('input').attributes('placeholder')).toBe('Enter your name');
    });

    it('renders with label', () => {
        const wrapper = mount(Input, {
            props: {
                modelValue: '',
            },
            attrs: {
                'aria-label': 'Name',
            },
        });

        expect(wrapper.find('input').attributes('aria-label')).toBe('Name');
    });

    it('renders with required attribute', () => {
        const wrapper = mount(Input, {
            props: {
                modelValue: '',
            },
            attrs: {
                required: true,
            },
        });

        expect(wrapper.find('input').attributes('required')).toBeDefined();
    });

    it('renders with disabled attribute', () => {
        const wrapper = mount(Input, {
            props: {
                modelValue: '',
            },
            attrs: {
                disabled: true,
            },
        });

        expect(wrapper.find('input').attributes('disabled')).toBeDefined();
        expect(wrapper.classes()).toContain('disabled:opacity-50');
    });

    it('renders with readonly attribute', () => {
        const wrapper = mount(Input, {
            props: {
                modelValue: '',
            },
            attrs: {
                readonly: true,
            },
        });

        expect(wrapper.find('input').attributes('readonly')).toBeDefined();
    });

    it('renders with different sizes', () => {
        const sizes = ['sm', 'default', 'lg'] as const;
        
        sizes.forEach(size => {
            const wrapper = mount(Input, {
                props: { size, modelValue: '' },
            });
            
            expect(wrapper.classes()).toContain('h-10');
        });
    });

    it('renders with error state', () => {
        const wrapper = mount(Input, {
            props: {
                modelValue: '',
            },
            attrs: {
                'aria-invalid': 'true',
            },
        });

        expect(wrapper.find('input').attributes('aria-invalid')).toBe('true');
    });

    it('renders with success state', () => {
        const wrapper = mount(Input, {
            props: {
                modelValue: '',
            },
            attrs: {
                'aria-invalid': 'false',
            },
        });

        expect(wrapper.find('input').attributes('aria-invalid')).toBe('false');
    });

    it('emits update:modelValue when input changes', async () => {
        const wrapper = mount(Input, {
            props: {
                modelValue: '',
            },
        });

        await wrapper.find('input').setValue('new value');
        expect(wrapper.emitted('update:modelValue')).toEqual([['new value']]);
    });

    it('emits focus event when input is focused', async () => {
        const wrapper = mount(Input, {
            props: {
                modelValue: '',
            },
        });

        await wrapper.find('input').trigger('focus');
        expect(wrapper.emitted('focus')).toBeTruthy();
    });

    it('emits blur event when input loses focus', async () => {
        const wrapper = mount(Input, {
            props: {
                modelValue: '',
            },
        });

        await wrapper.find('input').trigger('blur');
        expect(wrapper.emitted('blur')).toBeTruthy();
    });

    it('renders with icon', () => {
        const wrapper = mount(Input, {
            props: {
                modelValue: '',
            },
            slots: {
                icon: '<span class="input-icon">🔍</span>',
            },
        });

        expect(wrapper.exists()).toBe(true);
    });

    it('renders with custom classes', () => {
        const wrapper = mount(Input, {
            props: {
                modelValue: '',
            },
            attrs: {
                class: 'custom-input-class',
            },
        });

        expect(wrapper.classes()).toContain('custom-input-class');
    });

    it('renders with maxlength attribute', () => {
        const wrapper = mount(Input, {
            props: {
                modelValue: '',
            },
            attrs: {
                maxlength: 10,
            },
        });

        expect(wrapper.find('input').attributes('maxlength')).toBe('10');
    });

    it('renders with minlength attribute', () => {
        const wrapper = mount(Input, {
            props: {
                modelValue: '',
            },
            attrs: {
                minlength: 3,
            },
        });

        expect(wrapper.find('input').attributes('minlength')).toBe('3');
    });
});
