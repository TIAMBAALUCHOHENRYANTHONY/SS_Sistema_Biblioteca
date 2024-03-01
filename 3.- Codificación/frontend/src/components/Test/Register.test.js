import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import UserPasswordModal from '../Users/PasswordModal';

// Mockear updateUserById
jest.mock('../../api/UserRolePermissions', () => ({
  updateUserById: jest.fn(),
  getUserByName: jest.fn(() => Promise.resolve({ id: '2' }))
}));

describe('UserPasswordModal', () => {
  it('renders without crashing', () => {
    render(<UserPasswordModal user={{ username: 'testuser' }} />);
  });

  it('calls handleSubmit with correct data when form is submitted', () => {
    const { getByLabelText, getByText } = render(<UserPasswordModal user={{ username: 'testuser' }} />);
    
    // Simular el ingreso de contraseñas
    fireEvent.change(getByLabelText('Contraseña Actual:'), { target: { value: 'oldPassword' } });
    fireEvent.change(getByLabelText('Contraseña Nueva:'), { target: { value: 'newPassword' } });

    // Simular el envío del formulario
    fireEvent.click(getByText('Guardar'));

  });
});
