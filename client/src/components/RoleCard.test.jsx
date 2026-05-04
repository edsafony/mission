import { render, screen, fireEvent } from '@testing-library/react';
import RoleCard from './RoleCard';

const role = { id: 1, name: 'Father', description: 'Family & parenting' };

describe('RoleCard', () => {
  test('renders role name and description', () => {
    render(<RoleCard role={role} onUpdate={() => {}} onDelete={() => {}} />);
    expect(screen.getByText('Father')).toBeInTheDocument();
    expect(screen.getByText('Family & parenting')).toBeInTheDocument();
  });

  test('renders Edit and Delete buttons', () => {
    render(<RoleCard role={role} onUpdate={() => {}} onDelete={() => {}} />);
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  test('clicking Edit shows inputs pre-filled with current values', () => {
    render(<RoleCard role={role} onUpdate={() => {}} onDelete={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));

    const nameInput = screen.getByDisplayValue('Father');
    const descInput = screen.getByDisplayValue('Family & parenting');
    expect(nameInput).toBeInTheDocument();
    expect(descInput).toBeInTheDocument();
    expect(screen.queryByText('Father')).not.toBeInTheDocument();
  });

  test('clicking Cancel hides inputs and restores displayed text', () => {
    render(<RoleCard role={role} onUpdate={() => {}} onDelete={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

    expect(screen.getByText('Father')).toBeInTheDocument();
    expect(screen.queryByDisplayValue('Father')).not.toBeInTheDocument();
  });

  test('clicking Save calls onUpdate with updated values', () => {
    const onUpdate = vi.fn();
    render(<RoleCard role={role} onUpdate={onUpdate} onDelete={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));

    fireEvent.change(screen.getByDisplayValue('Father'), { target: { value: 'Dad' } });
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    expect(onUpdate).toHaveBeenCalledWith(1, { name: 'Dad', description: 'Family & parenting' });
  });

  test('clicking Delete calls onDelete with role id', () => {
    const onDelete = vi.fn();
    render(<RoleCard role={role} onUpdate={() => {}} onDelete={onDelete} />);
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));

    expect(onDelete).toHaveBeenCalledWith(1);
  });

  test('renders null description gracefully', () => {
    render(<RoleCard role={{ id: 2, name: 'Professional', description: null }} onUpdate={() => {}} onDelete={() => {}} />);
    expect(screen.getByText('Professional')).toBeInTheDocument();
  });
});
