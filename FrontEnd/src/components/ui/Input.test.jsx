import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Input from './Input';

test('toggles password visibility', () => {
    const handleChange = jest.fn();
    render(<Input type="password" label="Password" onChange={handleChange} />);
    const input = screen.getByLabelText('Password');
    expect(input).toHaveAttribute('type', 'password');
    const toggleButton = screen.getByRole('button');
    fireEvent.click(toggleButton);
    expect(input).toHaveAttribute('type', 'text');
    fireEvent.click(toggleButton);
    expect(input).toHaveAttribute('type', 'password');
});
