import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import MissionSection from './MissionSection';

vi.mock('../hooks/useMission', () => ({
  default: vi.fn(),
}));

import useMission from '../hooks/useMission';

function setupMock({ text = '', save = vi.fn() } = {}) {
  useMission.mockReturnValue({ text, save });
}

describe('MissionSection', () => {
  test('renders mission text in view mode when mission exists', () => {
    setupMock({ text: 'To live with integrity' });
    render(<MissionSection />);
    expect(screen.getByText('To live with integrity')).toBeInTheDocument();
  });

  test('renders placeholder when mission text is empty', () => {
    setupMock({ text: '' });
    render(<MissionSection />);
    expect(screen.getByText(/what is your personal mission/i)).toBeInTheDocument();
  });

  test('renders an Edit button in view mode', () => {
    setupMock();
    render(<MissionSection />);
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
  });

  test('clicking Edit shows a textarea with current text', () => {
    setupMock({ text: 'To live with integrity' });
    render(<MissionSection />);
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    expect(screen.getByRole('textbox').value).toBe('To live with integrity');
  });

  test('clicking Edit shows Save and Cancel buttons', () => {
    setupMock();
    render(<MissionSection />);
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  test('clicking Cancel returns to view mode without saving', () => {
    const save = vi.fn();
    setupMock({ text: 'Original', save });
    render(<MissionSection />);
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Changed' } });
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(save).not.toHaveBeenCalled();
    expect(screen.getByText('Original')).toBeInTheDocument();
  });

  test('clicking Save calls save with the new text', async () => {
    const save = vi.fn().mockResolvedValue({});
    setupMock({ text: 'Original', save });
    render(<MissionSection />);
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Updated mission' } });
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    await waitFor(() => expect(save).toHaveBeenCalledWith('Updated mission'));
  });

  test('returns to view mode after successful save', async () => {
    const save = vi.fn().mockResolvedValue({});
    setupMock({ text: 'Original', save });
    render(<MissionSection />);
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    await waitFor(() => expect(screen.queryByRole('textbox')).not.toBeInTheDocument());
  });
});
