import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { isDesktop, isMobile } from '@deriv/shared';
import IdvDocumentSubmit from '../idv-document-submit';
import { StoreProvider, mockStore } from '@deriv/stores';

const mock_store = mockStore({
    client: {
        getChangeableFields: jest.fn(() => []),
    },
});

jest.mock('react-router');
jest.mock('Assets/ic-document-submit-icon.svg', () => jest.fn(() => 'DocumentSubmitLogo'));
jest.mock('Helpers/utils', () => ({
    ...jest.requireActual('Helpers/utils'),
    getDocumentData: jest.fn((country_code, key) => {
        const data = {
            tc: {
                document_1: {
                    new_display_name: '',
                    example_format: '5436454364243',
                },
                document_2: {
                    new_display_name: '',
                    example_format: 'A-52431',
                },
            },
        };
        return data[country_code][key];
    }),
    getRegex: jest.fn(() => /5436454364243/i),
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isDesktop: jest.fn(() => true),
    isMobile: jest.fn(() => false),
    formatInput: jest.fn(() => '5436454364243'),
    WS: {
        send: jest.fn(() => Promise.resolve({ error: '' })),
        setSettings: jest.fn(() => Promise.resolve({ error: '' })),
        authorized: {
            storage: {
                getSettings: jest.fn(() => Promise.resolve({ error: '' })),
            },
        },
    },
    filterObjProperties: jest.fn(() => ({
        first_name: 'test',
        last_name: 'test',
        date_of_birth: '1970-01-01',
    })),
}));

describe('<IdvDocumentSubmit/>', () => {
    const mock_props = {
        handleBack: jest.fn(),
        handleViewComplete: jest.fn(),
        selected_country: {
            value: 'tc',
            identity: {
                services: {
                    idv: {
                        documents_supported: {
                            document_1: { display_name: 'Test document 1 name', format: '5436454364243' },
                            document_2: { display_name: 'Test document 2 name', format: 'A54321' },
                        },
                        has_visual_sample: 1,
                    },
                },
            },
        },
        is_from_external: false,
    };

    it('should render IdvDocumentSubmit component', () => {
        render(
            <StoreProvider store={mock_store}>
                <IdvDocumentSubmit {...mock_props} />
            </StoreProvider>
        );

        expect(screen.getByText(/Identity verification/i)).toBeInTheDocument();
        expect(screen.getByText(/details/i)).toBeInTheDocument();
        expect(screen.queryByText('New ID type name')).not.toBeInTheDocument();
        expect(screen.queryByText('Please select a document type.')).not.toBeInTheDocument();

        const inputs = screen.getAllByRole<HTMLTextAreaElement>('textbox');
        expect(inputs).toHaveLength(5);
        expect(inputs[0].name).toBe('document_type');
        expect(inputs[1].name).toBe('document_number');
    });

    it('should  trigger "go back" button, inputs and check document_type validation after rendering IdvDocumentSubmit component', async () => {
        render(
            <StoreProvider store={mock_store}>
                <IdvDocumentSubmit {...mock_props} />
            </StoreProvider>
        );

        const backBtn = screen.getByRole('button', { name: /go back/i });
        fireEvent.click(backBtn);
        expect(mock_props.handleBack).toHaveBeenCalledTimes(1);

        const document_type_input = screen.getByLabelText('Choose the document type');
        const document_number_input = screen.getByLabelText('Enter your document number');
        expect(document_number_input).toBeDisabled();
        expect(screen.queryByText('Test document 1 name')).not.toBeInTheDocument();
        expect(screen.queryByText('Test document 2 name')).not.toBeInTheDocument();

        fireEvent.click(document_type_input);
        expect(await screen.findByText('Test document 1 name')).toBeInTheDocument();
        expect(await screen.findByText('Test document 2 name')).toBeInTheDocument();
        expect(screen.queryByText('Please select a document type.')).not.toBeInTheDocument();

        fireEvent.blur(document_type_input);
        expect(await screen.findByText('Please select a document type.')).toBeInTheDocument();
        await waitFor(() => {
            expect(screen.queryByText('Test document 1 name')).not.toBeInTheDocument();
            expect(screen.queryByText('Test document 2 name')).not.toBeInTheDocument();
        });
    });

    it('should change inputs, check document_number validation and trigger "Verify" button after rendering IdvDocumentSubmit component', async () => {
        (isDesktop as jest.Mock).mockReturnValue(false);
        (isMobile as jest.Mock).mockReturnValue(true);

        render(
            <StoreProvider store={mock_store}>
                <IdvDocumentSubmit {...mock_props} />
            </StoreProvider>
        );

        const verifyBtn = screen.getByRole('button', { name: /verify/i });
        expect(verifyBtn).toBeDisabled();

        const confirmation_checkbox = screen.getByLabelText(/i confirm that the name and date of birth/i);

        const document_type_input = screen.getByRole<HTMLTextAreaElement>('combobox');
        expect(document_type_input.name).toBe('document_type');
        const document_number_input = screen.getByLabelText<HTMLTextAreaElement>('Enter your document number');
        expect(document_number_input.name).toBe('document_number');
        expect(document_number_input).toBeDisabled();

        fireEvent.change(document_type_input, { target: { value: 'Test document 2 name' } });
        expect(document_number_input).toBeEnabled();
        expect(screen.queryByText(/please enter the correct format/i)).not.toBeInTheDocument();

        fireEvent.blur(document_number_input);
        expect(await screen.findByText(/please enter your document number/i)).toBeInTheDocument();

        fireEvent.keyUp(document_number_input);
        fireEvent.change(document_number_input, { target: { value: 'A-32523' } });
        expect(await screen.findByText(/please enter the correct format/i)).toBeInTheDocument();

        fireEvent.change(document_number_input, { target: { value: 'A54321' } });
        await waitFor(() => {
            expect(screen.queryByText(/please enter the correct format/i)).not.toBeInTheDocument();
            expect(screen.queryByText(/please enter a valid ID number/i)).not.toBeInTheDocument();
            expect(confirmation_checkbox).toBeEnabled();
        });
        fireEvent.click(confirmation_checkbox);

        expect(verifyBtn).toBeEnabled();
        fireEvent.click(verifyBtn);
        await waitFor(() => {
            expect(mock_props.handleViewComplete).toHaveBeenCalledTimes(1);
        });
    });
});
