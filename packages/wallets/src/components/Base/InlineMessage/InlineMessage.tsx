import React, { useMemo } from 'react';
import useDevice from '../../../hooks/useDevice';
import AlertAnnounce from '../../../public/images/alert-annouce.svg';
import AlertDanger from '../../../public/images/alert-danger.svg';
import AlertInfo from '../../../public/images/alert-info.svg';
import Warning from '../../../public/images/warning.svg';
import './InlineMessage.scss';

const typeIconMapper = {
    announcement: AlertAnnounce,
    error: AlertDanger,
    information: AlertInfo,
    warning: Warning,
};

type TProps = RequireAtLeastOne<{ children: React.ReactNode; message: React.ReactNode; title: React.ReactNode }> & {
    size?: 'lg' | 'md' | 'sm' | 'xs';
    type?: keyof typeof typeIconMapper;
};

const InlineMessage: React.FC<TProps> = ({ children, message, size = 'xs', title, type = 'warning' }) => {
    const { isMobile } = useDevice();
    const Icon = typeIconMapper[type];
    const iconSize = size === 'lg' && !isMobile ? 24 : 16;

    const sizeToFontSizeMapper: Record<string, string> = useMemo(
        () => ({
            lg: isMobile ? '14px' : '16px',
            md: isMobile ? '12px' : '14px',
            sm: isMobile ? '10px' : '12px',
            xs: isMobile ? '8px' : '10px',
        }),
        [isMobile]
    );

    const fontSize = sizeToFontSizeMapper[size];

    return (
        <div className={`wallets-inline-message wallets-inline-message__${type} wallets-inline-message__${size} `}>
            <Icon className={`wallets-inline-message__icon__${size}`} height={iconSize} width={iconSize} />
            <span className={`wallets-inline-message__messages inline-message__messages__${size}`} style={{ fontSize }}>
                {title && <strong>{title}</strong>}
                {message && <span>{message}</span>}
                {children}
            </span>
        </div>
    );
};

export default InlineMessage;
