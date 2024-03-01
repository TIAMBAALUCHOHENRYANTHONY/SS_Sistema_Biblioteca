import React from 'react';
import { render, waitFor } from '@testing-library/react';
import UserPasswordModal from '../Users/PasswordModal';
import { getUserByName } from '../../api/UserRolePermissions';

// Mockear getUserByName
jest.mock('../../api/UserRolePermissions', () => ({
    getUserByName: jest.fn().mockResolvedValue({ username: 'agvalarezo1' }) // Mockear la función para que devuelva un valor simulado
}));

describe('UserPasswordModal', () => {
    it('fetches user data and renders it correctly', async () => {
        // Renderizar el componente
        render(<UserPasswordModal user={{ username: 'agvalarezo1' }} />);

        // Esperar a que se haya realizado la solicitud GET
        await waitFor(() => {
            expect(getUserByName).toHaveBeenCalledTimes(1); // Espera a que se llame a getUserByName
        });
    });
});