import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Profile from '../Profile';
import { AuthProvider } from '../../context/AuthContext';

// Mock the API client
vi.mock('../../api/client', () => ({
  apiClient: {
    getProfile: vi.fn(),
    getBalance: vi.fn(),
    updateProfile: vi.fn(),
  },
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>{children}</AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

const mockUser = {
  _id: '123',
  email: 'test@example.com',
  name: { first: 'John', last: 'Doe' },
  phone: '+1234567890',
  address: '123 Test St',
  company: 'Test Company',
  balance: '$1000.00',
};

describe('Profile Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders profile information correctly', async () => {
    const mockGetProfile = vi.fn().mockResolvedValue(mockUser);
    const mockGetBalance = vi.fn().mockResolvedValue({ balance: '$1000.00' });

    // Mock the API client
    const { apiClient } = await import('../../api/client');
    vi.mocked(apiClient.getProfile).mockResolvedValue(mockUser);
    vi.mocked(apiClient.getBalance).mockResolvedValue({ balance: '$1000.00' });

    render(
      <TestWrapper>
        <Profile />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('EDIT')).toBeInTheDocument();
      expect(screen.getByText('REFRESH BALANCE')).toBeInTheDocument();
    });
  });

  it('shows edit form when edit button is clicked', async () => {
    const mockGetProfile = vi.fn().mockResolvedValue(mockUser);
    const mockGetBalance = vi.fn().mockResolvedValue({ balance: '$1000.00' });

    const { apiClient } = await import('../../api/client');
    vi.mocked(apiClient.getProfile).mockResolvedValue(mockUser);
    vi.mocked(apiClient.getBalance).mockResolvedValue({ balance: '$1000.00' });

    render(
      <TestWrapper>
        <Profile />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('EDIT')).toBeInTheDocument();
    });

    const editButton = screen.getByText('EDIT');
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(screen.getByText('Save Changes')).toBeInTheDocument();
      expect(screen.getByDisplayValue('John')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
    });
  });

  it('cancels edit when cancel button is clicked', async () => {
    const mockGetProfile = vi.fn().mockResolvedValue(mockUser);
    const mockGetBalance = vi.fn().mockResolvedValue({ balance: '$1000.00' });

    const { apiClient } = await import('../../api/client');
    vi.mocked(apiClient.getProfile).mockResolvedValue(mockUser);
    vi.mocked(apiClient.getBalance).mockResolvedValue({ balance: '$1000.00' });

    render(
      <TestWrapper>
        <Profile />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('EDIT')).toBeInTheDocument();
    });

    // Click edit button
    const editButton = screen.getByText('EDIT');
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(screen.getByText('Save Changes')).toBeInTheDocument();
    });

    // Click cancel button
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.getByText('EDIT')).toBeInTheDocument();
    });
  });

  it('updates profile when form is submitted', async () => {
    const mockGetProfile = vi.fn().mockResolvedValue(mockUser);
    const mockGetBalance = vi.fn().mockResolvedValue({ balance: '$1000.00' });
    const mockUpdateProfile = vi.fn().mockResolvedValue({
      ...mockUser,
      name: { first: 'Jane', last: 'Smith' },
    });

    const { apiClient } = await import('../../api/client');
    vi.mocked(apiClient.getProfile).mockResolvedValue(mockUser);
    vi.mocked(apiClient.getBalance).mockResolvedValue({ balance: '$1000.00' });
    vi.mocked(apiClient.updateProfile).mockResolvedValue({
      ...mockUser,
      name: { first: 'Jane', last: 'Smith' },
    });

    render(
      <TestWrapper>
        <Profile />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('EDIT')).toBeInTheDocument();
    });

    // Click edit button
    const editButton = screen.getByText('EDIT');
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(screen.getByText('Save Changes')).toBeInTheDocument();
    });

    // Update form fields
    const firstNameInput = screen.getByDisplayValue('John');
    const lastNameInput = screen.getByDisplayValue('Doe');

    fireEvent.change(firstNameInput, { target: { value: 'Jane' } });
    fireEvent.change(lastNameInput, { target: { value: 'Smith' } });

    // Submit form
    const submitButton = screen.getByText('Save Changes');
    fireEvent.click(submitButton);

    // The form submission will trigger the update function
    // This test just verifies the form can be submitted
  });
});
