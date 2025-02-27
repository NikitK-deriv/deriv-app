import React from 'react';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import {
    DesktopWrapper,
    Div100vhContainer,
    FadeWrapper,
    Loading,
    MobileWrapper,
    PageOverlay,
    SelectNative,
    VerticalTab,
} from '@deriv/components';
import { getSelectedRoute } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import { RudderStack, getRudderstackConfig } from '@deriv/analytics';
import { TRoute } from 'Types';
import 'Sass/app/modules/reports.scss';

type TList = {
    value: React.ComponentType | typeof Redirect;
    default?: boolean;
    label: string;
    icon?: string;
    path?: string;
};

type TReports = {
    history: RouteComponentProps['history'];
    location: RouteComponentProps['location'];
    routes: TRoute[];
};

const Reports = observer(({ history, location, routes }: TReports) => {
    const { client, common, ui } = useStore();

    const { is_logged_in, is_logging_in, setVisibilityRealityCheck } = client;
    const { is_from_derivgo, routeBackInApp } = common;
    const { is_reports_visible, setReportsTabIndex, reports_route_tab_index, toggleReports } = ui;
    const { action_names, event_names, form_names, form_sources } = getRudderstackConfig();

    React.useEffect(() => {
        RudderStack.track(event_names.reports, {
            action: action_names.open,
            form_name: form_names.default,
            subform_name: history.location.pathname.split('/')[2],
            form_source: form_sources.deriv_trader,
        });
        toggleReports(true);
        return () => {
            setVisibilityRealityCheck(1);
            toggleReports(false);
            RudderStack.track(event_names.reports, {
                action: action_names.close,
                form_name: form_names.default,
                subform_name: location.pathname.split('/')[2],
            });
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onClickClose = () => routeBackInApp(history);

    const handleRouteChange = (e: React.ChangeEvent<HTMLSelectElement>) => history.push(e.target.value);

    const menu_options = () => {
        const options: TList[] = [];

        routes.forEach(route => {
            options.push({
                default: route.default,
                icon: route.icon_component,
                label: route.getTitle(),
                value: route.component,
                path: route.path,
            });
        });

        return options;
    };

    const selected_route = getSelectedRoute({ routes, pathname: location.pathname });

    if (!is_logged_in && is_logging_in) {
        return <Loading is_fullscreen />;
    }
    return (
        <FadeWrapper is_visible={is_reports_visible} className='reports-page-wrapper' keyname='reports-page-wrapper'>
            <div className='reports'>
                <PageOverlay header={localize('Reports')} onClickClose={onClickClose} is_from_app={is_from_derivgo}>
                    <DesktopWrapper>
                        <VerticalTab
                            is_floating
                            current_path={location.pathname}
                            is_routed
                            is_full_width
                            setVerticalTabIndex={setReportsTabIndex}
                            vertical_tab_index={selected_route.default ? 0 : reports_route_tab_index}
                            list={menu_options()}
                        />
                    </DesktopWrapper>
                    <MobileWrapper>
                        <Div100vhContainer className='reports__mobile-wrapper' height_offset='80px'>
                            <SelectNative
                                className='reports__route-selection'
                                list_items={menu_options().map(option => ({
                                    text: option.label,
                                    value: option.path ?? '',
                                }))}
                                value={selected_route.path ?? ''}
                                should_show_empty_option={false}
                                onChange={handleRouteChange}
                                label={''}
                                hide_top_placeholder={false}
                            />
                            {selected_route?.component && (
                                <selected_route.component icon_component={selected_route.icon_component} />
                            )}
                        </Div100vhContainer>
                    </MobileWrapper>
                </PageOverlay>
            </div>
        </FadeWrapper>
    );
});

export default Reports;
