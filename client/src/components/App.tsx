import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { HashRouter, Route, Switch } from 'react-router-dom';
import NavBar from './NavBar';
import Home from './pages/Home';
import Listings from './pages/Listings';
import { AppState } from 'data/store';
import { getCurrentUser } from 'data/store/auth/selectors';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import { Spinner } from 'reactstrap';
import Browse from './pages/Browse';
import Me from './pages/Me';

const styles = makeStyles({
    loadingWrapper: {
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
});

const mapState = (state: AppState) => {
    return {
        currentUser: getCurrentUser(state)
    };
};

type StateProps = ReturnType<typeof mapState>
type OwnProps = StateProps

const App = connect(mapState)((props: OwnProps) => {
    const {
        currentUser
    } = props;

    const classes = styles();

    if (!currentUser) {
        return <div className={classes.loadingWrapper}>
            <Spinner color={'primary'} />
        </div>;
    }

    return (
        <HashRouter>
            <NavBar />
            <Switch>
                <Route path={'/browse'} component={Browse} />
                <Route path={'/sell'} component={Listings} />
                <Route path={'/me'} component={Me} />
                <Route path={'/'} component={Home} />
            </Switch>
        </HashRouter>
    );
});

export default App;
