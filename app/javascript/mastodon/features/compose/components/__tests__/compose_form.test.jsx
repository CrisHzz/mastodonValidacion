import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { Map as ImmutableMap, List as ImmutableList } from 'immutable';
import ComposeForm from '../compose_form';

const mockIntl = {
  formatMessage: (message) => message.defaultMessage || message.id,
};

const defaultProps = {
  intl: mockIntl,
  text: '',
  suggestions: ImmutableList(),
  spoiler: false,
  privacy: 'public',
  spoilerText: '',
  focusDate: null,
  caretPosition: null,
  preselectDate: null,
  isSubmitting: false,
  isChangingUpload: false,
  isEditing: false,
  isUploading: false,
  onChange: vi.fn(),
  onSubmit: vi.fn(),
  onClearSuggestions: vi.fn(),
  onFetchSuggestions: vi.fn(),
  onSuggestionSelected: vi.fn(),
  onChangeSpoilerText: vi.fn(),
  onPaste: vi.fn(),
  onPickEmoji: vi.fn(),
  autoFocus: false,
  withoutNavigation: false,
  anyMedia: false,
  missingAltText: false,
  isInReply: false,
  singleColumn: false,
  lang: 'en',
  maxChars: 500,
  redirectOnSuccess: false,
};

const renderWithIntl = (component) => {
  return render(
    <IntlProvider locale="en" messages={{}}>
      {component}
    </IntlProvider>
  );
};

describe('ComposeForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('text input field', () => {
    it('calls onChange when text is entered', () => {
      const onChange = vi.fn();
      renderWithIntl(
        <ComposeForm {...defaultProps} onChange={onChange} />
      );

      const textarea = screen.getByPlaceholderText('What is on your mind?');
      fireEvent.change(textarea, { target: { value: 'New post text' } });

      expect(onChange).toHaveBeenCalledWith('New post text');
      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('displays current text value', () => {
      renderWithIntl(
        <ComposeForm {...defaultProps} text="Existing text" />
      );

      const textarea = screen.getByPlaceholderText('What is on your mind?');
      expect(textarea.value).toBe('Existing text');
    });

    it('updates when text prop changes', () => {
      const { rerender } = renderWithIntl(
        <ComposeForm {...defaultProps} text="Initial" />
      );

      const textarea = screen.getByPlaceholderText('What is on your mind?');
      expect(textarea.value).toBe('Initial');

      rerender(
        <IntlProvider locale="en" messages={{}}>
          <ComposeForm {...defaultProps} text="Updated" />
        </IntlProvider>
      );

      expect(textarea.value).toBe('Updated');
    });
  });

  describe('character counter', () => {
    it('displays character counter with correct remaining count', () => {
      renderWithIntl(
        <ComposeForm {...defaultProps} text="Hello" maxChars={500} />
      );

      expect(screen.getByText('495')).toBeInTheDocument();
    });

    it('updates counter when text changes', () => {
      const { rerender } = renderWithIntl(
        <ComposeForm {...defaultProps} text="" maxChars={500} />
      );

      expect(screen.getByText('500')).toBeInTheDocument();

      rerender(
        <IntlProvider locale="en" messages={{}}>
          <ComposeForm {...defaultProps} text="More text" maxChars={500} />
        </IntlProvider>
      );

      expect(screen.getByText('491')).toBeInTheDocument();
    });
  });

  describe('submit button state', () => {
    it('disables submit button when text is empty', () => {
      renderWithIntl(
        <ComposeForm {...defaultProps} text="" />
      );

      const submitButton = screen.getByRole('button', { name: /post/i });
      expect(submitButton).toBeDisabled();
    });

    it('enables submit button when text is provided', () => {
      renderWithIntl(
        <ComposeForm {...defaultProps} text="Some text" />
      );

      const submitButton = screen.getByRole('button', { name: /post/i });
      expect(submitButton).not.toBeDisabled();
    });

    it('disables submit button when isSubmitting is true', () => {
      renderWithIntl(
        <ComposeForm {...defaultProps} text="Some text" isSubmitting={true} />
      );

      const submitButton = screen.getByRole('button', { name: /post/i });
      expect(submitButton).toBeDisabled();
    });

    it('disables submit button when isUploading is true', () => {
      renderWithIntl(
        <ComposeForm {...defaultProps} text="Some text" isUploading={true} />
      );

      const submitButton = screen.getByRole('button', { name: /post/i });
      expect(submitButton).toBeDisabled();
    });

    it('disables submit button when text exceeds maxChars', () => {
      const longText = 'a'.repeat(501);
      renderWithIntl(
        <ComposeForm {...defaultProps} text={longText} maxChars={500} />
      );

      const submitButton = screen.getByRole('button', { name: /post/i });
      expect(submitButton).toBeDisabled();
    });
  });

  describe('form submission', () => {
    it('calls onSubmit when form is submitted with valid text', () => {
      const onSubmit = vi.fn();
      renderWithIntl(
        <ComposeForm {...defaultProps} text="Valid post" onSubmit={onSubmit} />
      );

      const form = screen.getByRole('form');
      fireEvent.submit(form);

      expect(onSubmit).toHaveBeenCalledWith({
        missingAltText: false,
        quoteToPrivate: false,
      });
    });

    it('does not call onSubmit when text is empty', () => {
      const onSubmit = vi.fn();
      renderWithIntl(
        <ComposeForm {...defaultProps} text="" onSubmit={onSubmit} />
      );

      const form = screen.getByRole('form');
      fireEvent.submit(form);

      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('does not call onSubmit when text exceeds maxChars', () => {
      const onSubmit = vi.fn();
      const longText = 'a'.repeat(501);
      renderWithIntl(
        <ComposeForm {...defaultProps} text={longText} maxChars={500} onSubmit={onSubmit} />
      );

      const form = screen.getByRole('form');
      fireEvent.submit(form);

      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('prevents default form submission behavior', () => {
      const onSubmit = vi.fn();
      renderWithIntl(
        <ComposeForm {...defaultProps} text="Valid post" onSubmit={onSubmit} />
      );

      const form = screen.getByRole('form');
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
      const preventDefaultSpy = vi.spyOn(submitEvent, 'preventDefault');

      fireEvent(form, submitEvent);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe('text manipulation', () => {
    it('handles text deletion correctly', () => {
      const onChange = vi.fn();
      renderWithIntl(
        <ComposeForm {...defaultProps} text="Initial text" onChange={onChange} />
      );

      const textarea = screen.getByPlaceholderText('What is on your mind?');
      fireEvent.change(textarea, { target: { value: '' } });

      expect(onChange).toHaveBeenCalledWith('');
    });

    it('handles text addition correctly', () => {
      const onChange = vi.fn();
      renderWithIntl(
        <ComposeForm {...defaultProps} text="Initial" onChange={onChange} />
      );

      const textarea = screen.getByPlaceholderText('What is on your mind?');
      fireEvent.change(textarea, { target: { value: 'Initial + more' } });

      expect(onChange).toHaveBeenCalledWith('Initial + more');
    });
  });
});

