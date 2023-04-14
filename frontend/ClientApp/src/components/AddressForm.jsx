import React from 'react';
import { AddressElement } from '@stripe/react-stripe-js';

const AddressForm = () => {
    return (
        <form>
            <h3>Shipping</h3>
            <AddressElement options={{
                mode: 'shipping',
                allowedCountries: ['US'],
                blockPoBox: true,
                fields: {
                    phone: 'always',
                },
                validation: {
                    phone: {
                        required: 'never',
                    },
                },
            }} />
        </form>
    );
};

export default AddressForm;