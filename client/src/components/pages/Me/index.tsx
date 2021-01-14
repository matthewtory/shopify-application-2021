import React, { useEffect, useState } from 'react';
import { Alert, Col, Container, Row, Spinner } from 'reactstrap';
import { AppState } from 'data/store';
import { connect } from 'react-redux';
import { PiccaPhotoListing, PiccaPhotoPurchase } from 'data/types';
import piccaRepository from 'data/repository';
import { makeStyles } from '@material-ui/styles';
import classNames from 'classnames';

type PurchaseTileProps = {
    purchase: PiccaPhotoPurchase,
    className?: string
}

const tileStyles = makeStyles({
    image: {
        height: '200px',
        width: '100%',
        objectFit: 'cover'
    }
});

const PurchaseTile: React.ComponentType<PurchaseTileProps> = (props) => {
    const {
        purchase,
        className
    } = props;

    const classes = tileStyles();

    return <Row noGutters className={classNames(className, 'border shadow-sm d-flex')}>
        <Col xs={12} lg={3}>
            <img src={purchase.thumbUrl} className={classes.image} />
        </Col>
        <Col>
            <Row className={'py-4 px-3'}>
                <Col xs={12} lg={8}>
                    <h3>{purchase.title}</h3>
                    <h6 className={'text-secondary'}>{purchase.author}</h6>
                    {purchase.description}
                </Col>
                {purchase.type === 'limited' && <Col xs={12} lg={4} className={'d-flex justify-content-end'}>
                    <h2>
                        {purchase.runNumber} <small
                        className={'text-muted'}><small>of {purchase.runSize}</small></small>
                    </h2>
                </Col>}
            </Row>
        </Col>
    </Row>;
};

const mapState = (state: AppState) => {
    return {
        uid: state.auth.user?.uid
    };
};

type StateProps = ReturnType<typeof mapState>

type OwnProps = StateProps

const Me: React.ComponentType = connect(mapState)((props: OwnProps) => {
    const {
        uid
    } = props;

    const [purchases, setPurchases] = useState<PiccaPhotoPurchase[] | null>(null);

    useEffect(() => {
        const fetchPurchases = async () => uid && setPurchases(await piccaRepository.getPurchases(uid));

        fetchPurchases();
    }, [uid, setPurchases]);

    let child: JSX.Element;
    if (uid) {
        child = <>
            <h2 className={'mb-4'}>Purchases</h2>
            {purchases?.map(p => <PurchaseTile key={p.id} purchase={p} className={'my-3'} />)}
            <div className={'d-flex align-items-center justify-content-center'}>
                {purchases?.length === 0 && <i className={'text-muted'}>You have no purchases</i>}
                {purchases == null && <Spinner color={'primary'} />}
            </div>
        </>;
    } else {
        child = <Alert color={'danger'}>
            You must be signed in to view this paage
        </Alert>;
    }

    return <Container className={'mt-4'}>
        {child}
    </Container>;
});

export default Me;