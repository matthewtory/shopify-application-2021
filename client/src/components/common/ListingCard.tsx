import React from 'react';
import { PiccaPhotoListing } from 'data/types';
import { CardImg, CardSubtitle, CardTitle } from 'reactstrap';
import classNames from 'classnames';
import PiccaCard from './PiccaCard';
import { makeStyles } from '@material-ui/styles';

export type ListingCardProps = {
    listing: PiccaPhotoListing,
    className?: string,
    self?: boolean
}

export const listingCardStyles = makeStyles({
    listingImage: {
        objectFit: 'cover',
        height: '70%',
        flexGrow: 1
    },
    card: {
        height: '350px',
        display: 'flex',
        flexDirection: 'column',
        width: '100%'
    }
});


const ListingCard: React.ComponentType<ListingCardProps> = (props) => {
    const { listing, className, self } = props;

    const classes = listingCardStyles();

    return (
        <PiccaCard className={classNames(classes.card, className)}
                   to={self ? `/sell/${listing.id}` : `/browse/${listing.id}`}>
            <CardImg top width={'100%'} src={listing.thumbUrl} className={classes.listingImage} />
            <div className={'px-3 py-2 d-flex align-items-center'}>
                <div className={'flex-grow-1'}>
                    <CardTitle className={'text-dark mb-2'}>{listing.title}</CardTitle>
                    <CardSubtitle className={'text-muted font-weight-light'}>{listing.author}</CardSubtitle>
                </div>
                <div className={'d-flex flex-column align-items-end'}>
                    <h5 className={'mb-0'}>${listing.price}</h5>
                    <small className={'text-muted'}>
                        {listing.type === 'unlimited' ? '' : `${listing.runSize} Prints`}
                    </small>
                </div>
            </div>
        </PiccaCard>
    );
};

export default ListingCard;