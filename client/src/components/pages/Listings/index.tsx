import React, { useEffect } from 'react';
import { Alert, Button, Col, Container, Row } from 'reactstrap';
import PiccaCard from 'components/common/PiccaCard';
import classNames from 'classnames';
import { NavLink, Route, Switch, useRouteMatch } from 'react-router-dom';
import CreateListing from './CreateListing';
import { fetchListings } from 'data/store/listings/actions';
import { connect } from 'react-redux';
import { AppState } from 'data/store';
import { listingCardStyles } from 'components/common/ListingCard';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Listing from '../Listing';
import ListingsGrid from 'components/common/ListingsGrid';


const NewListingCard: React.ComponentType = () => {
    const classes = listingCardStyles();

    return <PiccaCard
        to={'/sell/create'}
        className={classNames(
            'border-primary d-flex align-items-center justify-content-center',
            classes.card)}>
        <FontAwesomeIcon icon={faPlus} size={'lg'} className={'text-primary mb-2'} />
        <h5 className={'text-primary'}>New Listing</h5>
    </PiccaCard>;
};

const mapState = (state: AppState) => {
    return {
        listings: state.listings.listings,
        error: state.listings.error
    };
};
const mapDispatch = {
    fetchListings
};

type DispatchProps = typeof mapDispatch
type StateProps = ReturnType<typeof mapState>

type OwnProps = DispatchProps & StateProps

const ListingsHome = connect(mapState, mapDispatch)((props: OwnProps) => {
    const {
        fetchListings,
        listings,
        error
    } = props;

    useEffect(() => {
        fetchListings();
    }, [fetchListings]);

    return (
        <>
            <div className={'d-flex align-items-start'}>
                <h2 className={'mb-4'}>Your Listings</h2>
                <NavLink to='/sell/create' className={'ml-auto'}>
                    <Button outline color={'primary'}>
                        <FontAwesomeIcon icon={faPlus} />&nbsp;Create a Listing
                    </Button>
                </NavLink>
            </div>
            {!!error && <Alert color={'danger'}>{error}</Alert>}
            {<ListingsGrid listings={listings} self />}
            {listings && listings.length === 0 && <Row>
                <Col xs={12} lg={4}>
                    <NewListingCard />
                </Col>
            </Row>}
        </>
    );
});

const Listings: React.ComponentType = () => {
    const match = useRouteMatch();

    return (
        <Container className={'mt-4'}>
            <Switch>
                <Route path={`${match.path}/create`}>
                    <CreateListing />
                </Route>
                <Route path={`${match.path}/:listingId`}>
                    <Listing fromPath={match.path} fromName={'Listings'} />
                </Route>
                <Route path={`${match.path}`}>
                    <ListingsHome />
                </Route>
            </Switch>
        </Container>
    );
};

export default Listings;