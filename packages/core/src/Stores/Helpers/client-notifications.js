import { isEmptyObject, State } from '@deriv/shared';

export const hasMissingRequiredField = (account_settings, client, isAccountOfType) => {
    if (!account_settings || isEmptyObject(account_settings)) return false;

    const { is_svg, landing_company_shortcode } = client;

    // TODO: [deriv-eu] refactor into its own function once more exceptions are added.
    let required_fields;
    if (is_svg) {
        required_fields = getSVGRequiredFields();
    } else {
        required_fields = getRequiredFields();
    }

    return required_fields.some(field => !account_settings[field]);

    function getSVGRequiredFields() {
        const necessary_withdrawal_fields =
            State.getResponse('landing_company.financial_company.requirements.withdrawal') || [];
        const necessary_signup_fields = State.getResponse('landing_company.financial_company.requirements.signup');

        const necessary_signup_fields_mapped = necessary_signup_fields
            ? necessary_signup_fields.map(field => (field === 'residence' ? 'country' : field))
            : [];

        return [...necessary_withdrawal_fields, ...necessary_signup_fields_mapped];
    }

    function getRequiredFields() {
        if (!isAccountOfType('financial')) return [];

        const { residence } = client;
        const required_settings_fields = [
            'account_opening_reason',
            'address_line_1',
            'address_city',
            'phone',
            'tax_identification_number',
            'tax_residence',
        ];

        const address_postcode_is_required = residence === 'gb' || landing_company_shortcode === 'iom';
        if (address_postcode_is_required) required_settings_fields.push('address_postcode');

        return [...required_settings_fields];
    }
};

export const getStatusValidations = status_arr => {
    return status_arr.reduce((validations, stats) => {
        validations[stats] = true;
        return validations;
    }, {});
};

export const getCashierValidations = cashier_arr => {
    return cashier_arr.reduce((validations, code) => {
        validations[code] = true;
        return validations;
    }, {});
};

// Notifications keys will not be added to localStorage and will appear again after user logout/login
export const excluded_notifications = ['contract_sold', 'has_changed_two_fa'];

export const maintenance_notifications = ['system_maintenance', 'site_maintenance'];

export const priority_toast_messages = [
    'svg',
    'need_fa',
    'p2p_daily_limit_increase',
    'authenticate',
    'wallets_migrated',
    'wallets_failed',
    'notify_financial_assessment',
    'additional_kyc_info',
    'svg_needs_poi_poa',
    'svg_needs_poa',
    'svg_needs_poi',
    'poi_failed',
    'poa_failed',
    'svg_poi_expired',
    'mt5_notification',
    ...maintenance_notifications,
];
