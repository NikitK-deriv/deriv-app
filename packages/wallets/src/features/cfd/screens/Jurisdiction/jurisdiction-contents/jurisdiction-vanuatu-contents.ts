import { TJurisdictionCardItems } from './props.types';

export const getJurisdictionVanuatuContents = (): TJurisdictionCardItems => ({
    contents: {
        financial: [
            {
                description: 'Forex, Stock indices, Commodities and Cryptocurrencies',
                key: 'assets',
                title: 'Assets',
                titleIndicators: {
                    displayText: '90+',
                    displayTextSkinColor: 'red-dark',
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
                description: 'Vanuatu Financial Services Commission',
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
                description: 'Vanuatu Financial Services Commission',
                key: 'regulator',
                title: 'Regulator/EDR',
            },
        ],
    },
    header: 'Vanuatu',
    isOverHeaderAvailable: false,
    verificationDocs: {
        financial: ['documentNumber', 'nameAndAddress'],
        synthetic: ['documentNumber', 'nameAndAddress'],
    },
});
