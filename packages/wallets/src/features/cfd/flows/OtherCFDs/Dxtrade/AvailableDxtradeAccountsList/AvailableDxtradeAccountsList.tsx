import React from 'react';
import { TradingAccountCard } from '../../../../../../components';
import { WalletButton, WalletText } from '../../../../../../components/Base';
import { useModal } from '../../../../../../components/ModalProvider';
import DerivX from '../../../../../../public/images/derivx.svg';
import { DxtradeEnterPasswordModal } from '../../../../modals';
import './AvailableDxtradeAccountsList.scss';

const AvailableDxtradeAccountsList: React.FC = () => {
    const { show } = useModal();

    return (
        <TradingAccountCard
            leading={() => (
                <div className='wallets-available-dxtrade__icon'>
                    <DerivX />
                </div>
            )}
            trailing={() => (
                <WalletButton color='primary-light' onClick={() => show(<DxtradeEnterPasswordModal />)} text='Get' />
            )}
        >
            <div className='wallets-available-dxtrade__details'>
                <p className='wallets-available-dxtrade__details-title'>
                    <WalletText size='sm' weight='bold'>
                        Deriv X
                    </WalletText>
                </p>
                <WalletText size='xs'>
                    This account offers CFDs on a highly customisable CFD trading platform.
                </WalletText>
            </div>
        </TradingAccountCard>
    );
};

export default AvailableDxtradeAccountsList;
