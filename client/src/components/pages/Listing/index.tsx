import React, { useCallback, useEffect, useState } from 'react';
import { AppState } from 'data/store';
import { NavLink, Redirect, RouteComponentProps, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { getCurrentUser } from 'data/store/auth/selectors';
import { fetchListing } from 'data/store/listing/actions';
import { Alert, Breadcrumb, BreadcrumbItem, Button, Col, Row, Spinner } from 'reactstrap';
import { makeStyles } from '@material-ui/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import listingsRepository from 'data/repository';
import PurchaseButton from './PurchaseButton';

type ListingRouteProps = RouteComponentProps<{ listingId: string }>

const styles = makeStyles({
    image: {
        width: '100%',
        maxHeight: '500px',
        objectFit: 'contain'
    }
});

const mapState = (state: AppState, props: ListingRouteProps) => {
    const { listingId } = props.match.params;

    return {
        currentUser: getCurrentUser(state),
        listing: state.listing.listing,
        error: state.listing.error,
        listingId
    };
};

const mapDispatch = {
    fetchListing
};

export type ListingProps = {
    fromPath: string,
    fromName: string
}
type StateProps = ReturnType<typeof mapState>
type DispatchProps = typeof mapDispatch
type OwnProps = StateProps & DispatchProps & ListingProps

const Listing: React.ComponentType<ListingProps> = withRouter(
    connect(mapState, mapDispatch)(
        (props: OwnProps) => {
            const {
                listing,
                currentUser,
                error,
                listingId,
                fetchListing,
                fromPath,
                fromName
            } = props;

            const classes = styles();

            const [isDeleting, setDeleting] = useState(false);
            const [didDelete, setDidDelete] = useState(false);

            const doDelete = async () => {
                if (!isDeleting) {
                    setDeleting(true);
                    await listingsRepository.deleteListing(listingId);
                    setDidDelete(true);
                }
            };

            useEffect(() => {
                fetchListing(listingId);
            }, [fetchListing, listingId]);

            if (didDelete) {
                return <Redirect to={fromPath} />;
            }

            let child: JSX.Element;

            if (error) {
                child = <Alert color={'danger'}>
                    {error}
                </Alert>;
            } else if (listing === undefined) {
                child = <div className={'d-flex align-items-center justify-content-center'}>
                    <Spinner color={'primary'} />
                </div>;
            } else {
                const isOwner = currentUser?.uid === listing.uid;

                child = <>
                    <Breadcrumb>
                        <BreadcrumbItem>
                            <NavLink to={fromPath}>{fromName}</NavLink>
                        </BreadcrumbItem>
                        <BreadcrumbItem active>{listing.title}</BreadcrumbItem>
                    </Breadcrumb>
                    {isOwner && <div className={'d-flex justify-content-end'}>

                    </div>}
                    <div className={'p-3 bg-light mb-4 mt-3'}>
                        <img src={listing.fullUrl} className={classes.image} />
                    </div>
                    <Row>
                        <Col xs={12} lg={8}>
                            <h2>{listing.title}</h2>
                            <h6 className={'text-muted'}>By {listing.author}</h6>
                            <p>{listing.description}</p>
                        </Col>
                        <Col xs={12} lg={4}>
                            <div className={'bg-light p-3'}>
                                <h3>${listing.price}</h3>
                                <p className={'text-muted'}>
                                    {listing.type === 'unlimited' ? 'Unlimited prints' : `Only ${listing.runSize} prints will be sold. There's ${listing.runStock ?? 0} left!`}
                                </p>

                                {!isOwner && <PurchaseButton listing={listing} className={'w-100'} />}
                                {isOwner && <>
                                    <Button
                                        disabled={isDeleting}
                                        color={'danger'}
                                        outline
                                        className={'w-100'}
                                        onClick={() => doDelete()}>
                                        {!isDeleting ? <>
                                            <FontAwesomeIcon icon={faTrash} className={'mr-2'} />
                                            Delete Listing
                                        </> : <Spinner size={'sm'} color={'white'} />}
                                    </Button>
                                </>}
                            </div>
                        </Col>
                    </Row>
                </>;
            }

            return <div className={'mt-2'}>
                {child}
            </div>;
        }
    )
);

export default Listing;