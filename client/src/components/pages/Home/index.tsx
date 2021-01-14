import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Row } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { PiccaPhotoListing } from 'data/types';
import piccaRepository from 'data/repository';
import ListingsGrid from 'components/common/ListingsGrid';

const Home: React.ComponentType = () => {

    const [featured, setFeatured] = useState<PiccaPhotoListing[] | null>(null);

    const fetchFeatured = async () => {
        const results = await piccaRepository.getFeaturedListings();

        setFeatured(results);
    };

    useEffect(() => {
        fetchFeatured();
    }, []);

    return <Container className={'mt-2'}>
        <h1 className={'mb-2'}>Welcome to Picca</h1>
        <h5 className={'text-muted mb-4'}>Connecting photographers with photograph lovers</h5>
        <h6>Featured</h6>
        <ListingsGrid listings={featured} />
        <div className={'d-flex align-items-center flex-wrap mt-3'}>
            <NavLink to={'/browse'}>
                <Button color={'primary'} className={'my-2 p-3 mr-3'}>
                    <h6 className={'mb-0'}>Browse Photos and Prints</h6>
                </Button>
            </NavLink>
            <NavLink to={'/sell'}>
                <Button outline color={'primary'} className={'my-2 p-3'}>
                    <h6 className={'mb-0 font-weight-normal'}>List your own</h6>
                </Button>
            </NavLink>
        </div>
    </Container>;
};

export default Home;