import { TJurisdictionCardItems } from './props.types';

export const getJurisdictionBviContents = (): TJurisdictionCardItems => ({
    contents: {
        financial: [
            {
                description: 'Forex, Stocks, Stock indices, Commodities, and Cryptocurrencies',
                key: 'assets',
                title: 'Assets',
                titleIndicators: {
                    displayText: '170+',
                    displayTextSkinColor: 'red-light',
                    type: 'displayText',
                },
            },
            {
                clickableDescription: [
                    {
                        text: 'Dynamic Leverage', // onClick: toggleDynamicLeverage,
                        type: 'link',
                    },
                ],
                key: 'leverage',
                title: 'Leverage',
                titleIndicators: {
                    displayText: '1:1000',
                    displayTextSkinColor: 'yellow-light',
                    type: 'displayText',
                },
            },
            {
                key: 'spreadsFrom',
                title: 'Spreads from',
                titleIndicators: {
                    displayText: '0.5 pips',
                    displayTextSkinColor: 'violet-dark',
                    type: 'displayText',
                },
            },
            {
                clickableDescription: [
                    {
                        text: 'Learn more',
                        type: 'link',
                    },
                    {
                        text: 'about verifications needed.',
                        type: 'text',
                    },
                ],
                key: 'verifications',
                title: 'Verifications',
                titleIndicators: {
                    type: 'displayIcons',
                },
            },
            {
                description: 'British Virgin Islands Financial Services Commission (License no. SIBA/L/18/1114)',
                key: 'regulator',
                title: 'Regulator/EDR',
            },
        ],
        synthetic: [
            {
                description: 'Synthetics, Baskets and Derived FX',
                key: 'assets',
                title: 'Assets',
                titleIndicators: {
                    displayText: '40+',
                    displayTextSkinColor: 'red-darker',
                    type: 'displayText',
                },
            },
            {
                key: 'leverage',
                title: 'Leverage',
                titleIndicators: {
                    displayText: '1:1000',
                    displayTextSkinColor: 'yellow-light',
                    type: 'displayText',
                },
            },
            {
                clickableDescription: [
                    {
                        text: 'Learn more',
                        type: 'link',
                    },
                    {
                        text: 'about verifications needed.',
                        type: 'text',
                    },
                ],
                key: 'verifications',
                title: 'Verifications',
                titleIndicators: {
                    type: 'displayIcons',
                },
            },
            {
                description: 'British Virgin Islands Financial Services Commission (License no. SIBA/L/18/1114)',
                key: 'regulator',
                title: 'Regulator/EDR',
            },
        ],
    },
    header: 'British Virgin Islands',
    isOverHeaderAvailable: false,
    verificationDocs: {
        financial: ['documentNumber', 'nameAndAddress'],
        synthetic: ['documentNumber', 'nameAndAddress'],
    },
});
