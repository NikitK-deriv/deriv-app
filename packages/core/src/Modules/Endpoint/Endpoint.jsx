import React from 'react';
import { Field, Form, Formik } from 'formik';
import { Button, Input, Checkbox, Text } from '@deriv/components';
import {
    getDebugServiceWorker,
    getAppId,
    getSocketURL,
    PlatformContext,
    isMobile,
    website_domain,
    TRADE_FEATURE_FLAGS,
} from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';

const FeatureFlagsSection = observer(() => {
    const { feature_flags } = useStore();
    const visible_feature_flags = Object.entries(feature_flags.data ?? {})?.reduce(
        (flags, [key, value]) => {
            const is_production = location.hostname === website_domain;
            if (!is_production || !TRADE_FEATURE_FLAGS.includes(key)) {
                flags[key] = value;
            }
            return flags;
        },
        {} // hiding flags for trade types in production
    );
    if (!feature_flags.data) return null;

    return (
        <div style={{ marginTop: '4rem' }}>
            <Text as='h1' weight='bold' color='prominent'>
                Feature flags
            </Text>
            {Object.keys(visible_feature_flags).map(flag => (
                <div key={flag} style={{ marginTop: '1.6rem' }}>
                    <Checkbox
                        label={flag}
                        value={visible_feature_flags[flag]}
                        onChange={e => feature_flags.update(old => ({ ...old, [flag]: e.target.checked }))}
                    />
                </div>
            ))}
        </div>
    );
});

const InputField = props => {
    return (
        <Field name={props.name}>
            {({ field, form: { errors, touched } }) => (
                <React.Fragment>
                    <Input
                        type='text'
                        autoComplete='off'
                        maxLength='30'
                        error={touched[field.name] && errors[field.name]}
                        {...field}
                        {...props}
                    />
                </React.Fragment>
            )}
        </Field>
    );
};

// doesn't need localization as it's for internal use
const Endpoint = () => {
    const platform_store = React.useContext(PlatformContext);

    return (
        <Formik
            initialValues={{
                app_id: getAppId(),
                server: getSocketURL(),
                is_appstore_enabled: platform_store.is_appstore,
                is_debug_service_worker_enabled: !!getDebugServiceWorker(),
            }}
            validate={values => {
                const errors = {};

                if (!values.app_id) {
                    errors.app_id = 'App ID is required.';
                } else if (!/^\d+$/.test(values.app_id)) {
                    errors.app_id = 'Please enter a valid app ID.';
                }

                if (!values.server) {
                    errors.server = 'Server is required.';
                } else if (!/^[\w|\-|.]+$/.test(values.server)) {
                    errors.server = 'Please enter a valid server.';
                }
                return errors;
            }}
            onSubmit={values => {
                localStorage.setItem('config.app_id', values.app_id);
                localStorage.setItem('config.server_url', values.server);
                localStorage.setItem(platform_store.DERIV_APPSTORE_KEY, values.is_appstore_enabled);
                localStorage.setItem('debug_service_worker', values.is_debug_service_worker_enabled ? 1 : 0);
                platform_store.setIsAppStore(values.is_appstore_enabled);
                sessionStorage.removeItem('config.platform');
                location.reload();
            }}
        >
            {({ errors, isSubmitting, touched, values, handleChange, setFieldTouched }) => (
                <Form style={{ width: '30vw', minWidth: '300px', margin: isMobile() ? 'auto' : '20vh auto' }}>
                    <div
                        style={{
                            marginBottom: '1.6rem',
                        }}
                    >
                        <Text as='h1' weight='bold' color='prominent'>
                            Change API endpoint
                        </Text>
                    </div>

                    <InputField name='server' label='Server' hint='e.g. frontend.binaryws.com' />
                    <InputField
                        name='app_id'
                        label='OAuth App ID'
                        hint={
                            <React.Fragment>
                                Register an{' '}
                                <a
                                    href='https://developers.binary.com/applications/'
                                    target='_blank'
                                    rel='noopener noreferrer'
                                >
                                    app ID
                                </a>{' '}
                                to use the above server for logging in.
                            </React.Fragment>
                        }
                    />
                    <Field name='is_appstore_enabled'>
                        {({ field }) => (
                            <div style={{ marginTop: '4.5rem', marginBottom: '1.6rem' }}>
                                <Checkbox
                                    {...field}
                                    label='Enable Appstore'
                                    value={values.is_appstore_enabled}
                                    onChange={e => {
                                        handleChange(e);
                                        setFieldTouched('is_appstore_enabled', true);
                                    }}
                                />
                            </div>
                        )}
                    </Field>
                    <Field name='is_debug_service_worker_enabled'>
                        {({ field }) => (
                            <div style={{ marginTop: '4.5rem', marginBottom: '1.6rem' }}>
                                <Checkbox
                                    {...field}
                                    label='Enable Service Worker registration for this URL'
                                    value={values.is_debug_service_worker_enabled}
                                    onChange={e => {
                                        handleChange(e);
                                        setFieldTouched('is_debug_service_worker_enabled', true);
                                    }}
                                />
                            </div>
                        )}
                    </Field>
                    <Button
                        type='submit'
                        is_disabled={
                            !!(
                                (!touched.server &&
                                    !touched.app_id &&
                                    !touched.is_appstore_enabled &&
                                    !touched.is_debug_service_worker_enabled) ||
                                !values.server ||
                                !values.app_id ||
                                errors.server ||
                                errors.app_id ||
                                isSubmitting
                            )
                        }
                        text='Submit'
                        primary
                    />
                    <span style={{ marginLeft: '1.6rem' }} />
                    <Button
                        type='button'
                        onClick={() => {
                            localStorage.removeItem('config.app_id');
                            localStorage.removeItem('config.server_url');
                            location.reload();
                        }}
                        text='Reset to original settings'
                        secondary
                    />
                    <FeatureFlagsSection />
                </Form>
            )}
        </Formik>
    );
};

export default Endpoint;
