import { render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Icon } from '../index';

describe('Icon', () => {
  it('renders correctly', async () => {
    const { root } = render(<Icon name="settings" />);
    await waitFor(() => expect(root).toBeTruthy());
  });

  it('accepts name prop', () => {
    expect(() => render(<Icon name="settings" />)).not.toThrow();
  });

  it('accepts size prop', () => {
    expect(() => render(<Icon name="settings" size={32} />)).not.toThrow();
  });

  it('accepts color prop', () => {
    expect(() => render(<Icon name="settings" color="#FF0000" />)).not.toThrow();
  });

  it('accepts all standard icon names', () => {
    expect(() => render(<Icon name="home" />)).not.toThrow();
    expect(() => render(<Icon name="person" />)).not.toThrow();
    expect(() => render(<Icon name="menu" />)).not.toThrow();
    expect(() => render(<Icon name="close" />)).not.toThrow();
    expect(() => render(<Icon name="heart" />)).not.toThrow();
    expect(() => render(<Icon name="add-circle" />)).not.toThrow();
  });

  it('renders different icons without errors', async () => {
    const { rerender } = render(<Icon name="settings" />);
    await waitFor(() => {
      rerender(<Icon name="heart" />);
    });
    await waitFor(() => {
      rerender(<Icon name="home" />);
    });
    expect(true).toBeTruthy(); // Just verify no errors thrown
  });

  it('renders with different sizes without errors', async () => {
    const { rerender } = render(<Icon name="settings" size={16} />);
    await waitFor(() => {
      rerender(<Icon name="settings" size={24} />);
    });
    await waitFor(() => {
      rerender(<Icon name="settings" size={48} />);
    });
    expect(true).toBeTruthy(); // Just verify no errors thrown
  });

  it('renders with different colors without errors', async () => {
    const { rerender } = render(<Icon name="settings" color="#FF0000" />);
    await waitFor(() => {
      rerender(<Icon name="settings" color="#00FF00" />);
    });
    await waitFor(() => {
      rerender(<Icon name="settings" color="#0000FF" />);
    });
    expect(true).toBeTruthy(); // Just verify no errors thrown
  });
});
