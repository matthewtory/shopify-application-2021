import React, { useState } from 'react';
import { PiccaPhotoListing } from 'data/types';
import { Alert, Button, Modal, ModalBody, ModalFooter, ModalHeader, Spinner } from 'reactstrap';
import { Redirect } from 'react-router-dom';
import piccaRepository from 'data/repository';

export type PurchaseButtonProps = {
    listing: PiccaPhotoListing,
    className?: string
}

const PurchaseButton: React.ComponentType<PurchaseButtonProps> = (props) => {
    const {
        listing,
        className
    } = props;

    const [isOpen, setOpen] = useState(false);
    const [isPurchasing, setPurchasing] = useState(false);
    const [didPurchase, setDidPurchase] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const makePurchase = async () => {
        if (!isPurchasing) {
            setPurchasing(true);

            try {
                await piccaRepository.purchaseListing(listing.id);
            } catch (e) {
                setError(e.message);
            }

            setPurchasing(false);
            setDidPurchase(true);
        }
    };

    if (didPurchase) {
        return <Redirect to={'/me'} />;
    }

    const soldOut = listing.type === 'limited' && !listing.runStock;

    return <>
        <Button color={'primary'} disabled={soldOut} className={className} onClick={() => setOpen(true)}>
            {soldOut ? 'Sold Out' : 'Buy Now'}
        </Button>
        <Modal isOpen={isOpen} toggle={() => {
            if (!isPurchasing) {
                setOpen(!isOpen);
            }
        }}>
            <ModalHeader>
                Confirm your purchase
            </ModalHeader>
            <ModalBody>
                {error && <Alert>{error}</Alert>}
                {listing.type === 'limited' && listing.runStock && listing.runSize && <p>
                    You are purchasing
                    number <b>{listing.runSize - listing.runStock + 1}</b> of <b>{listing.runSize}</b> of this run
                </p>}
                <i className={'text-muted'}>This is where a checkout flow would go, or similar</i>
            </ModalBody>
            <ModalFooter>
                <Button color={'secondary'} outline onClick={() => setOpen(false)}>Cancel</Button>
                <Button disabled={isPurchasing || soldOut} color={'primary'} onClick={() => makePurchase()}>
                    {isPurchasing ? <Spinner size={'sm'} color={'white'} /> : 'Confirm'}
                </Button>
            </ModalFooter>
        </Modal>
    </>;
};

export default PurchaseButton;