import React, { useEffect, useState } from 'react';
import { Alert, Container } from 'reactstrap';
import { AppState } from 'data/store';
import { browseListings } from 'data/store/browse/actions';
import { connect } from 'react-redux';
import { BrowseListingsFilter } from 'data/repository';
import ListingsGrid from 'components/common/ListingsGrid';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import Listing from '../Listing';

const mapState = (state: AppState) => {
    return {
        listings: state.browse.listings,
        error: state.browse.error
    };
};

const mapDispatch = {
    browseListings
};

type StateProps = ReturnType<typeof mapState>
type DispatchProps = typeof mapDispatch
type OwnProps = StateProps & DispatchProps

const BrowseHome: React.ComponentType = connect(mapState, mapDispatch)((props: OwnProps) => {
    const {
        listings,
        error,
        browseListings
    } = props;

    const priceMin = useState('');
    const priceMax = useState('');
    const mode = useState<BrowseListingsFilter['mode']>('all');

    const makeFilter = (): BrowseListingsFilter => ({});

    const [filter, setFilter] = useState<BrowseListingsFilter>(makeFilter());

    useEffect(() => {
        browseListings({});
    }, [browseListings]);

    return <Container className={'mt-4'}>
        <h2 className={'mb-4'}>Browse</h2>
        {error && <Alert color={'danger'}>{error}</Alert>}
        <ListingsGrid listings={listings} />
    </Container>;
});

const Browse: React.ComponentType = () => {
    const match = useRouteMatch();

    return (
        <Container className={'mt-4'}>
            <Switch>
                <Route path={`${match.path}/:listingId`}>
                    <Listing fromPath={match.path} fromName={'Browse'} />
                </Route>
                <Route path={`${match.path}`}>
                    <BrowseHome />
                </Route>
            </Switch>
        </Container>
    );
};

export default Browse;