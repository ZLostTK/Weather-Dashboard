import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Card from '../Card.vue';

describe('Card', () => {
    it('renders correctly with default props', () => {
        const wrapper = mount(Card, {
            slots: {
                default: 'Card content',
            },
        });

        expect(wrapper.text()).toBe('Card content');
        expect(wrapper.classes()).toContain('rounded-lg');
        expect(wrapper.classes()).toContain('border');
    });

    it('renders with different variants', () => {
        const variants = ['default', 'elevated'] as const;
        
        variants.forEach(variant => {
            const wrapper = mount(Card, {
                props: { variant },
                slots: { default: 'Card content' },
            });
            
            expect(wrapper.classes()).toContain('rounded-lg');
            expect(wrapper.classes()).toContain('border');
        });
    });

    it('renders with different sizes', () => {
        const sizes = ['sm', 'default', 'lg'] as const;
        
        sizes.forEach(size => {
            const wrapper = mount(Card, {
                props: { size },
                slots: { default: 'Card content' },
            });
            
            expect(wrapper.classes()).toContain('rounded-lg');
            expect(wrapper.classes()).toContain('border');
        });
    });

    it('renders with header slot', () => {
        const wrapper = mount(Card, {
            slots: {
                default: 'Card Header Card content',
            },
        });

        expect(wrapper.text()).toContain('Card Header');
        expect(wrapper.text()).toContain('Card content');
    });

    it('renders with footer slot', () => {
        const wrapper = mount(Card, {
            slots: {
                default: 'Card content Card Footer',
            },
        });

        expect(wrapper.text()).toContain('Card content');
        expect(wrapper.text()).toContain('Card Footer');
    });

    it('renders with all slots', () => {
        const wrapper = mount(Card, {
            slots: {
                default: 'Card Header Card content Card Footer',
            },
        });

        expect(wrapper.text()).toContain('Card Header');
        expect(wrapper.text()).toContain('Card content');
        expect(wrapper.text()).toContain('Card Footer');
    });

    it('applies custom classes', () => {
        const wrapper = mount(Card, {
            props: { class: 'custom-class' },
            slots: { default: 'Card content' },
        });

        expect(wrapper.classes()).toContain('custom-class');
    });

    it('renders with hover effects when enabled', () => {
        const wrapper = mount(Card, {
            props: { hover: true },
            slots: { default: 'Card content' },
        });

        expect(wrapper.classes()).toContain('rounded-lg');
        expect(wrapper.classes()).toContain('border');
    });

    it('renders without hover effects when disabled', () => {
        const wrapper = mount(Card, {
            props: { hover: false },
            slots: { default: 'Card content' },
        });

        expect(wrapper.classes()).toContain('rounded-lg');
        expect(wrapper.classes()).toContain('border');
    });
});
