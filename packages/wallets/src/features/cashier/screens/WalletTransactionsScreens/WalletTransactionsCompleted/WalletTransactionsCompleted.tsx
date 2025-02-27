import React, { useCallback, useEffect } from 'react';
import moment from 'moment';
import { useTransactions } from '@deriv/api';
import { TSocketRequestPayload } from '@deriv/api/types';
import { WalletTransactionsCompletedRow } from '../WalletTransactionsCompletedRow';
import { WalletTransactionsNoDataState } from '../WalletTransactionsNoDataState';
import { WalletTransactionsTable } from '../WalletTransactionsTable';
import './WalletTransactionsCompleted.scss';

type TFilter = NonNullable<TSocketRequestPayload<'statement'>['payload']>['action_type'];

type TProps = {
    filter?: TFilter;
};

const WalletTransactionsCompleted: React.FC<TProps> = ({ filter }) => {
    const { data, fetchNextPage, isFetching, setFilter } = useTransactions();

    const fetchMoreOnBottomReached = useCallback(
        (containerRefElement?: HTMLDivElement | null) => {
            if (containerRefElement) {
                const { clientHeight, scrollHeight, scrollTop } = containerRefElement;
                //once the user has scrolled within 300px of the bottom of the table, fetch more data if there is any
                if (scrollHeight - scrollTop - clientHeight < 300 && !isFetching) {
                    fetchNextPage();
                }
            }
        },
        [fetchNextPage, isFetching]
    );

    useEffect(() => {
        setFilter(filter);
    }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!data) return <WalletTransactionsNoDataState />;

    return (
        <div>
            <WalletTransactionsTable
                columns={[
                    {
                        accessorFn: row =>
                            row.transaction_time && moment.unix(row.transaction_time).format('DD MMM YYYY'),
                        accessorKey: 'date',
                        header: 'Date',
                    },
                ]}
                data={data}
                fetchMore={fetchMoreOnBottomReached}
                groupBy={['date']}
                rowGroupRender={transaction => (
                    <p className='wallets-transactions-completed__group-title'>
                        {transaction.transaction_time &&
                            moment.unix(transaction.transaction_time).format('DD MMM YYYY')}
                    </p>
                )}
                rowRender={transaction => <WalletTransactionsCompletedRow transaction={transaction} />}
            />
        </div>
    );
};

export default WalletTransactionsCompleted;
