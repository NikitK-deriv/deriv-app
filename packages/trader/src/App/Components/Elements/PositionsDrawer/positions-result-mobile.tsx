import classNames from 'classnames';
import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { Icon } from '@deriv/components';
import { localize } from '@deriv/translations';

type TPositionsResultMobile = {
    is_visible: boolean;
    result: 'won' | 'lost';
};

const PositionsResultMobile = ({ is_visible, result }: TPositionsResultMobile) => {
    const is_contract_won = result === 'won';
    return (
        <React.Fragment>
            <CSSTransition
                in={is_visible}
                timeout={250}
                classNames={{
                    enter: 'positions-modal-card__result--enter',
                    enterDone: 'positions-modal-card__result--enter-done',
                    exit: 'positions-modal-card__result--exit',
                }}
                unmountOnExit
            >
                <div className='positions-modal-card__caption-wrapper' data-testid='result_mobile'>
                    <span
                        className={classNames('positions-modal-card__caption', {
                            'positions-modal-card__caption--won': is_contract_won,
                            'positions-modal-card__caption--lost': !is_contract_won,
                        })}
                    >
                        {is_contract_won ? (
                            <React.Fragment>
                                {localize('Won')}
                                <Icon icon='IcCheckmarkCircle' className='positions-modal-card__icon' color='green' />
                            </React.Fragment>
                        ) : (
                            <React.Fragment>
                                {localize('Lost')}
                                <Icon icon='IcCrossCircle' className='positions-modal-card__icon' color='red' />
                            </React.Fragment>
                        )}
                    </span>
                </div>
            </CSSTransition>
        </React.Fragment>
    );
};

export default PositionsResultMobile;
