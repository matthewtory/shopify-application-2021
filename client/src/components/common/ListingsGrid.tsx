import React from 'react';
import { PiccaPhotoListing } from 'data/types';
import { Col, Row } from 'reactstrap';
import ListingCard from './ListingCard';
import classNames from 'classnames';

type ListingsGridProps = {
    listings?: PiccaPhotoListing[] | null,
    self?: boolean
}

const ListingsGrid: React.ComponentType<ListingsGridProps> = (props) => {
    const {
        listings,
        self
    } = props;

    const mapListing = (listing: PiccaPhotoListing) => <Col key={listing.id} xs={12} lg={4}>
        <ListingCard self={self} listing={listing} className={classNames('my-2')} />
    </Col>;

    const listingRows: JSX.Element[] = [];
    if (listings) {
        for (let i = 0; i < Math.ceil(listings.length / 3); i++) {
            listingRows.push(<Row key={i}>
                {listings.slice(i * 3, i * 3 + 3).map(mapListing)}
            </Row>);
        }
    }
    return <>
        {listingRows}
    </>;
};

export default ListingsGrid;