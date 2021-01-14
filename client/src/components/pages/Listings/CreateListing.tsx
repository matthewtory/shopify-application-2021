import React, { useCallback, useState } from 'react';
import {
    Alert,
    Breadcrumb,
    BreadcrumbItem,
    Button,
    Col, FormFeedback,
    FormGroup,
    Input, InputGroup, InputGroupAddon,
    Label,
    ListGroup,
    ListGroupItem, Spinner,
    UncontrolledTooltip
} from 'reactstrap';
import { NavLink, Redirect } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { makeStyles } from '@material-ui/styles';
import classNames from 'classnames';
import { NewPiccaPhotoListing, PiccaPhotoListing } from 'data/types';
import { AppState } from 'data/store';
import { createListing } from 'data/store/newListing/actions';
import { connect } from 'react-redux';
import { faInfoCircle, faQuestionCircle, faTrash, faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const styles = makeStyles({
    filePicker: {
        cursor: 'pointer'
    },
    imagePreview: {
        objectFit: 'contain',
        maxHeight: '500px'
    }
});

const mapState = (state: AppState) => {
    return {
        ...state.newListing
    };
};

const mapDispatch = {
    createListing
};

type StateProps = ReturnType<typeof mapState>
type DispatchProps = typeof mapDispatch

type OwnProps = StateProps & DispatchProps

const CreateListing = connect(mapState, mapDispatch)((props: OwnProps) => {
    const {
        loading,
        error,
        newListingId,
        createListing
    } = props;

    const classes = styles();

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageType, setImageType] = useState<PiccaPhotoListing['type']>('unlimited');

    const [imageTitle, setImageTitle] = useState('');
    const [imageAuthor, setImageAuthor] = useState('');
    const [imagePrice, setImagePrice] = useState('');
    const [imageRunSize, setImageRunSize] = useState('');
    const [imageDescription, setImageDescription] = useState('');

    const [imageFileError, setImageFileError] = useState<string | undefined>(undefined);
    const [imageNameError, setImageNameError] = useState<string | undefined>(undefined);
    const [imageAuthorError, setImageAuthorError] = useState<string | undefined>(undefined);
    const [imagePriceError, setImagePriceError] = useState<string | undefined>(undefined);
    const [imageRunSizeError, setImageRunSizeError] = useState<string | undefined>(undefined);
    const [imageDescriptionError, setImageDescriptionError] = useState<string | undefined>(undefined);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setImageFile(acceptedFiles[0]);
        }
    }, [setImageFile]);

    const { getRootProps, getInputProps, isDragActive, isDragReject, isDragAccept } = useDropzone({
        onDrop,
        maxFiles: 1,
        accept: 'image/*'
    });

    const doCreateListing = useCallback(() => {
        const title = imageTitle;
        const author = imageAuthor;
        const price = imagePrice;
        const runSize = imageRunSize;

        let hasError = false;
        if (!title?.length) {
            setImageNameError('Please provide an image title');
            hasError = true;
        } else {
            setImageNameError(undefined);
        }

        if (!author?.length) {
            setImageAuthorError('Please provide a photographer');
            hasError = true;
        } else {
            setImageAuthorError(undefined);
        }

        const priceAsNumber = parseFloat(price ?? '');
        if (isNaN(priceAsNumber) || priceAsNumber <= 0) {
            setImagePriceError('Price must be greater than zero');
            hasError = true;
        } else {
            setImagePriceError(undefined);
        }

        let runSizeAsNumber: number | undefined;
        if (imageType === 'limited') {
            runSizeAsNumber = parseInt(runSize ?? '');
            if (isNaN(runSizeAsNumber) || runSizeAsNumber <= 0) {
                setImageRunSizeError('Please provide a valid run size');
            } else {
                setImageRunSizeError(undefined);
            }
        } else {
            setImageRunSizeError(undefined);
        }

        if (!imageFile) {
            setImageFileError('Please provide a photograph');
        } else {
            setImageFileError(undefined);
        }

        if (!hasError && imageFile && author && title) {
            const newListing: NewPiccaPhotoListing = {
                type: imageType,
                imageFile: imageFile,
                author: author,
                price: priceAsNumber,
                title: title,
                runSize: runSizeAsNumber,
                description: imageDescription
            };
            createListing(newListing);
        }

    }, [
        createListing,
        imageFile,
        imageType,
        imageTitle,
        imageAuthor,
        imageRunSize,
        imagePrice,
        imageDescription
    ]);

    if (newListingId) {
        return <Redirect to={`/sell/${newListingId}`} />;
    } else if (loading) {
        return <div className={'mt-5 d-flex align-items-center flex-column'}>
            <Spinner color={'primary'} className={'mb-3'} />
            <span className={'text-muted'}>Creating listing... This may take a while</span>
        </div>;
    }

    return <div className={'mb-5'}>
        <Breadcrumb>
            <BreadcrumbItem>
                <NavLink to={'/sell'}>Listings</NavLink>
            </BreadcrumbItem>
            <BreadcrumbItem active>Create Listing</BreadcrumbItem>
        </Breadcrumb>
        <h2>New Listing</h2>
        {imageFile == null ? (
            <>
                <div {...getRootProps()} className={classNames(
                    'p-5 border d-flex align-items-center justify-content-center',
                    classes.filePicker,
                    {
                        'alert-success': isDragAccept,
                        'alert-danger': isDragReject,
                        'border-danger': !!imageFileError
                    }
                )}>
                    <input {...getInputProps()} />
                    {
                        <>
                            <FontAwesomeIcon icon={faUpload} className={'text-secondary mr-2'} />
                            <h5 className={'mb-0 text-secondary'}>
                                {isDragActive ? (
                                    isDragReject ? 'Only images please!' : 'Drop here'
                                ) : 'Upload your photo'}
                            </h5>
                        </>
                    }
                </div>
                <FormFeedback invalid className={classNames({
                    'd-block': !!imageFileError
                })}>{imageFileError}</FormFeedback>
            </>
        ) : (
            <div className={'px-3 pb-3 pt-3 bg-light border'}>
                <Button className={'mb-3'} outline color={'secondary'} size={'sm'} onClick={() => setImageFile(null)}>
                    <FontAwesomeIcon icon={faTrash} /> Upload another
                </Button>
                <img className={classNames(
                    'w-100',
                    classes.imagePreview
                )} src={URL.createObjectURL(imageFile)} />
            </div>
        )}
        <FormGroup row className={'mt-3'}>
            <Label for={'photoTitle'} sm={2}><b>Title</b></Label>
            <Col sm={10} lg={4}>
                <Input
                    type={'text'}
                    id={'photoTitle'}
                    value={imageTitle}
                    invalid={!!imageNameError}
                    onChange={(e) => {
                        setImageTitle(e.target.value);
                        if (imageNameError) {
                            setImageNameError(undefined);
                        }
                    }} />
                <FormFeedback invalid>{imageNameError}</FormFeedback>
            </Col>
        </FormGroup>
        <FormGroup row className={'mt-3'}>
            <Label for={'photoAuthor'} sm={2}><b>Photographer</b></Label>
            <Col sm={10} lg={4}>
                <Input
                    type={'text'}
                    id={'photoAuthor'}
                    value={imageAuthor}
                    invalid={!!imageAuthorError}
                    onChange={(e) => {
                        setImageAuthor(e.target.value);
                        if (imageAuthorError) {
                            setImageAuthorError(undefined);
                        }
                    }} />
                <FormFeedback invalid>{imageAuthorError}</FormFeedback>
            </Col>
        </FormGroup>
        <FormGroup row className={'mt-3'}>
            <Label for={'photoDescription'} sm={2}><b>Description</b></Label>
            <Col sm={10} lg={4}>
                <Input
                    type={'textarea'}
                    id={'photoDescription'}
                    value={imageDescription}
                    invalid={!!imageDescriptionError}
                    onChange={(e) => {
                        setImageDescription(e.target.value);
                        if (imageDescriptionError) {
                            setImageDescriptionError(undefined);
                        }
                    }} />
                <FormFeedback invalid>{imageDescriptionError}</FormFeedback>
            </Col>
        </FormGroup>
        <FormGroup row className={'mt-3'}>
            <Label for={'photoPrice'} sm={2}><b>Price</b></Label>
            <Col sm={5} lg={2}>
                <InputGroup>
                    <InputGroupAddon addonType="prepend">$</InputGroupAddon>
                    <Input
                        type={'number'}
                        id={'photoPrice'}
                        value={imagePrice}
                        invalid={!!imagePriceError}
                        onChange={(e) => {
                            setImagePrice(e.target.value);
                            if (imagePriceError) {
                                setImagePriceError(undefined);
                            }
                        }} />
                </InputGroup>
                <FormFeedback invalid className={classNames({
                    'd-block': !!imagePriceError
                })}>{imagePriceError}</FormFeedback>
            </Col>
        </FormGroup>
        <FormGroup row className={'mt-3'}>
            <UncontrolledTooltip placement={'right'} target={'photoTypeInfo'}>
                You can choose to offer a limited number of photos, or an unlimited amount
            </UncontrolledTooltip>
            <Label sm={2}>
                <b>Type</b>
                &nbsp;
                <span id={'photoTypeInfo'}>
                    <FontAwesomeIcon icon={faQuestionCircle} size={'sm'} />
                </span>
            </Label>
            <Col sm={10} lg={10}>
                <ListGroup horizontal>
                    <ListGroupItem action active={imageType === 'unlimited'} onClick={() => setImageType('unlimited')}>
                        Unlimited
                    </ListGroupItem>
                    <ListGroupItem action active={imageType === 'limited'} onClick={() => setImageType('limited')}>
                        Limited Run
                    </ListGroupItem>
                </ListGroup>
            </Col>
        </FormGroup>
        {imageType === 'limited' && <Alert color={'info'}>
            <FontAwesomeIcon icon={faInfoCircle} />&nbsp;&nbsp;By offering a limited run of photos, you agree not to
            sell
            this work outside
            of <i>Picca</i> for monetary value
        </Alert>}
        {imageType === 'limited' && <FormGroup row className={'mt-3'}>
            <Label sm={2}>Run Size</Label>
            <Col sm={5} lg={2}>
                <Input
                    min={1}
                    max={1000}
                    type={'number'}
                    id={'photoRunSize'}
                    value={imageRunSize}
                    invalid={!!imageRunSizeError}
                    onChange={(e) => {
                        setImageRunSize(e.target.value);
                        if (imageRunSizeError) {
                            setImageRunSizeError(undefined);
                        }
                    }} />
                <FormFeedback invalid>{imageRunSizeError}</FormFeedback>
            </Col>
        </FormGroup>}
        <div className={'d-flex justify-content-center mt-5'} onClick={() => doCreateListing()}>
            <Button color={'primary'}>
                Create Listing
            </Button>
        </div>
    </div>;
});

export default CreateListing;