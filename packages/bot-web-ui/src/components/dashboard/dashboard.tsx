import React, { useEffect } from 'react';
import classNames from 'classnames';

import { updateWorkspaceName } from '@deriv/bot-skeleton';
import dbot from '@deriv/bot-skeleton/src/scratch/dbot';
import { initTrashCan } from '@deriv/bot-skeleton/src/scratch/hooks/trashcan';
import { api_base } from '@deriv/bot-skeleton/src/services/api/api-base';
import { DesktopWrapper, Dialog, MobileWrapper, Tabs } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';

import Chart from 'Components/chart';
import { DBOT_TABS, TAB_IDS } from 'Constants/bot-contents';
import { useDBotStore } from 'Stores/useDBotStore';

import RunPanel from '../run-panel';

import RunStrategy from './dashboard-component/run-strategy';
import { tour_list } from './dbot-tours/utils';
import DashboardComponent from './dashboard-component';
import StrategyNotification from './strategy-notification';
import Tutorial from './tutorial-tab';

const Dashboard = observer(() => {
    const { dashboard, load_modal, run_panel, quick_strategy, summary_card } = useDBotStore();
    const { active_tab, active_tour, setActiveTab, setWebSocketState, setActiveTour } = dashboard;
    const { onEntered, dashboard_strategies } = load_modal;
    const { is_dialog_open, is_drawer_open, dialog_options, onCancelButtonClick, onCloseDialog, onOkButtonClick } =
        run_panel;
    const { is_strategy_modal_open } = quick_strategy;
    const { clear } = summary_card;
    const { DASHBOARD, BOT_BUILDER } = DBOT_TABS;
    const is_mobile = isMobile();
    const init_render = React.useRef(true);
    const { ui } = useStore();
    const { url_hashed_values } = ui;
    const hash = ['dashboard', 'bot_builder', 'chart', 'tutorial'];

    let tab_value: number | string = active_tab;
    const GetHashedValue = (tab: number) => {
        tab_value = url_hashed_values?.split('#')[1];
        if (!tab_value) return tab;
        return Number(hash.indexOf(String(tab_value)));
    };
    const active_hash_tab = GetHashedValue(active_tab);

    const checkAndHandleConnection = () => {
        const api_status = api_base.getConnectionStatus();
        //added this check because after sleep mode all the store values refresh and is_running is false.
        const is_bot_running = document.getElementById('db-animation__stop-button') !== null;
        if (is_bot_running && (api_status === 'Closed' || api_status === 'Closing')) {
            dbot.terminateBot();
            clear();
            setWebSocketState(false);
        }
    };

    React.useEffect(() => {
        window.addEventListener('focus', checkAndHandleConnection);
    }, []);

    React.useEffect(() => {
        if (init_render.current) {
            setActiveTab(Number(active_hash_tab));
            if (is_mobile) handleTabChange(Number(active_hash_tab));
            init_render.current = false;
        } else {
            window.location.hash = hash[active_tab] || hash[0];
        }
        if (tour_list[active_tab] !== active_tour) {
            setActiveTour('');
        }
    }, [active_tab]);

    React.useEffect(() => {
        if (active_tab === BOT_BUILDER) {
            if (is_drawer_open) {
                initTrashCan(400, -748);
            } else {
                initTrashCan(20);
            }
            setTimeout(() => {
                window.dispatchEvent(new Event('resize')); // make the trash can work again after resize
            }, 500);
        }
    }, [active_tab, is_drawer_open]);

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (dashboard_strategies.length > 0) {
            // Needed to pass this to the Callback Queue as on tab changes
            // document title getting override by 'Bot | Deriv' only
            timer = setTimeout(() => {
                updateWorkspaceName();
            });
        }
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [dashboard_strategies, active_tab]);

    const handleTabChange = React.useCallback(
        (tab_index: number) => {
            setActiveTab(tab_index);
            const el_id = TAB_IDS[tab_index];
            if (el_id) {
                const el_tab = document.getElementById(el_id);
                el_tab?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'center',
                });
            }
        },
        [active_tab]
    );

    return (
        <React.Fragment>
            <div className='dashboard__main'>
                <div
                    className={classNames('dashboard__container', {
                        'dashboard__container--active': active_tour && active_tab === DASHBOARD && is_mobile,
                    })}
                >
                    <Tabs
                        active_index={active_tab}
                        className='dashboard__tabs'
                        onTabItemChange={onEntered}
                        onTabItemClick={handleTabChange}
                        top
                    >
                        <div icon='IcDashboardComponentTab' label={localize('Dashboard')} id='id-dbot-dashboard'>
                            <DashboardComponent handleTabChange={handleTabChange} />
                        </div>
                        <div icon='IcBotBuilderTabIcon' label={localize('Bot Builder')} id='id-bot-builder' />
                        <div icon='IcChartsTabDbot' label={localize('Charts')} id='id-charts'>
                            <Chart />
                        </div>
                        <div icon='IcTutorialsTabs' label={localize('Tutorials')} id='id-tutorials'>
                            <div className='tutorials-wrapper'>
                                <Tutorial />
                            </div>
                        </div>
                    </Tabs>
                </div>
            </div>
            <DesktopWrapper>
                <div className={'dashboard__run-strategy-wrapper'}>
                    <RunStrategy />
                    <RunPanel />
                </div>
            </DesktopWrapper>
            <MobileWrapper>{!is_strategy_modal_open && <RunPanel />}</MobileWrapper>
            <Dialog
                cancel_button_text={dialog_options.cancel_button_text || localize('Cancel')}
                className={'dc-dialog__wrapper--fixed'}
                confirm_button_text={dialog_options.ok_button_text || localize('OK')}
                has_close_icon
                is_mobile_full_width={false}
                is_visible={is_dialog_open}
                onCancel={onCancelButtonClick}
                onClose={onCloseDialog}
                onConfirm={onOkButtonClick || onCloseDialog}
                portal_element_id='modal_root'
                title={dialog_options.title}
            >
                {dialog_options.message}
            </Dialog>
            <StrategyNotification />
        </React.Fragment>
    );
});

export default Dashboard;
