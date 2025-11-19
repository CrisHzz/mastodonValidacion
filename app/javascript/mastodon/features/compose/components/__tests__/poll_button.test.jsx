import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import PollButton from '../poll_button';

const mockIntl = {
  formatMessage: (message) => message.defaultMessage || message.id,
};

const defaultProps = {
  intl: mockIntl,
  onClick: vi.fn(),
  active: false,
  disabled: false,
};

const renderWithIntl = (component) => {
  return render(
    <IntlProvider locale="en" messages={{}}>
      {component}
    </IntlProvider>
  );
};

describe('PollButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders the poll button', () => {
      renderWithIntl(<PollButton {...defaultProps} />);

      const button = screen.getByRole('button');
      expect(button).toBeDefined();
    });

    it('displays add poll message when inactive', () => {
      renderWithIntl(<PollButton {...defaultProps} active={false} />);

      const button = screen.getByRole('button');
      expect(button.getAttribute('title')).toBe('Add a poll');
    });

    it('displays remove poll message when active', () => {
      renderWithIntl(<PollButton {...defaultProps} active={true} />);

      const button = screen.getByRole('button');
      expect(button.getAttribute('title')).toBe('Remove poll');
    });

    it('applies active class when active prop is true', () => {
      const { container } = renderWithIntl(
        <PollButton {...defaultProps} active={true} />
      );

      const iconButton = container.querySelector('.compose-form__poll-button-icon.active');
      expect(iconButton).toBeDefined();
    });

    it('does not apply active class when active prop is false', () => {
      const { container } = renderWithIntl(
        <PollButton {...defaultProps} active={false} />
      );

      const iconButton = container.querySelector('.compose-form__poll-button-icon.active');
      expect(iconButton).toBeNull();
    });
  });

  describe('interaction', () => {
    it('calls onClick handler when button is clicked', () => {
      const onClick = vi.fn();
      renderWithIntl(<PollButton {...defaultProps} onClick={onClick} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(onClick).toHaveBeenCalledTimes(1);
      expect(onClick).toHaveBeenCalledWith();
    });

    it('calls onClick handler multiple times when clicked multiple times', () => {
      const onClick = vi.fn();
      renderWithIntl(<PollButton {...defaultProps} onClick={onClick} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      expect(onClick).toHaveBeenCalledTimes(3);
    });

    it('does not call onClick when button is disabled', () => {
      const onClick = vi.fn();
      renderWithIntl(<PollButton {...defaultProps} onClick={onClick} disabled={true} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('disabled state', () => {
    it('disables button when disabled prop is true', () => {
      renderWithIntl(<PollButton {...defaultProps} disabled={true} />);

      const button = screen.getByRole('button');
      expect(button.hasAttribute('disabled')).toBe(true);
    });

    it('enables button when disabled prop is false', () => {
      renderWithIntl(<PollButton {...defaultProps} disabled={false} />);

      const button = screen.getByRole('button');
      expect(button.hasAttribute('disabled')).toBe(false);
    });
  });

  describe('state changes', () => {
    it('updates title when active prop changes from false to true', () => {
      const { rerender } = renderWithIntl(
        <PollButton {...defaultProps} active={false} />
      );

      let button = screen.getByRole('button');
      expect(button.getAttribute('title')).toBe('Add a poll');

      rerender(
        <IntlProvider locale="en" messages={{}}>
          <PollButton {...defaultProps} active={true} />
        </IntlProvider>
      );

      button = screen.getByRole('button');
      expect(button.getAttribute('title')).toBe('Remove poll');
    });

    it('updates active class when active prop changes', () => {
      const { container, rerender } = renderWithIntl(
        <PollButton {...defaultProps} active={false} />
      );

      let iconButton = container.querySelector('.compose-form__poll-button-icon.active');
      expect(iconButton).toBeNull();

      rerender(
        <IntlProvider locale="en" messages={{}}>
          <PollButton {...defaultProps} active={true} />
        </IntlProvider>
      );

      iconButton = container.querySelector('.compose-form__poll-button-icon.active');
      expect(iconButton).toBeDefined();
    });
  });
});

