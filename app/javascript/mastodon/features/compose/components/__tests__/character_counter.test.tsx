import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CharacterCounter } from '../character_counter';

describe('CharacterCounter', () => {
  it('displays remaining characters when text is within limit', () => {
    const max = 500;
    const text = 'Hello world';

    render(<CharacterCounter text={text} max={max} />);

    const counter = screen.getByText('489');
    expect(counter).toBeDefined();
    expect(counter.className).toBe('character-counter');
  });

  it('displays negative count when text exceeds limit', () => {
    const max = 10;
    const text = 'This is a very long text that exceeds the limit';

    render(<CharacterCounter text={text} max={max} />);

    const counter = screen.getByText(/-?\d+/);
    expect(counter).toBeDefined();
    expect(counter.className).toContain('character-counter--over');
  });

  it('updates count when text changes', () => {
    const max = 500;
    const { rerender } = render(<CharacterCounter text="" max={max} />);

    expect(screen.getByText('500')).toBeDefined();

    rerender(<CharacterCounter text="New text" max={max} />);

    expect(screen.getByText('492')).toBeInTheDocument();
  });

  it('handles empty text correctly', () => {
    const max = 500;

    render(<CharacterCounter text="" max={max} />);

    expect(screen.getByText('500')).toBeDefined();
  });

  it('handles text at exact limit', () => {
    const max = 10;
    const text = '1234567890';

    render(<CharacterCounter text={text} max={max} />);

    const counter = screen.getByText('0');
    expect(counter).toBeDefined();
    expect(counter.className).toBe('character-counter');
  });
});

