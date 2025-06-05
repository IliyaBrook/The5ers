import type { Meta, StoryObj } from '@storybook/react';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button } from './Button';

const meta = {
  title: 'Example/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    backgroundColor: { control: 'color' },
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'link', 'text', 'danger'],
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
};

export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Link Button',
    href: '#',
  },
};

export const Text: Story = {
  args: {
    variant: 'text',
    children: 'Text Button',
  },
};

export const Danger: Story = {
  args: {
    variant: 'text',
    danger: true,
    children: 'Remove',
  },
};

export const WithIcon: Story = {
  args: {
    variant: 'primary',
    icon: <PlusOutlined />,
    children: 'Add to Portfolio',
  },
};

export const LinkWithIcon: Story = {
  args: {
    variant: 'link',
    icon: <SearchOutlined />,
    children: 'Search',
  },
};

export const Large: Story = {
  args: {
    variant: 'primary',
    size: 'large',
    children: 'Large Button',
  },
};

export const Small: Story = {
  args: {
    variant: 'secondary',
    size: 'small',
    children: 'Small Button',
  },
};

export const Disabled: Story = {
  args: {
    variant: 'primary',
    disabled: true,
    children: 'Disabled Button',
  },
};
