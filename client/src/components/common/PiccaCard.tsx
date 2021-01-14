import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Card } from 'reactstrap';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';

type PiccaCardProps = {
    className?: string,
    to?: string
}

const styles = makeStyles({
    card: {
        boxShadow: '0 .5rem 1rem rgba(0,0,0,.1)',
        transition: 'ease 0.2s',
        '&:hover': {
            boxShadow: '0 .125rem .25rem rgba(0,0,0,.075)',
            transform: 'scale(0.975)'
        }
    },
    clickableCard: {
        cursor: 'pointer',
        textDecoration: 'none !important'
    }
});

const PiccaCard: React.ComponentType<PiccaCardProps> = (props) => {
    const {
        className,
        children,
        to
    } = props;

    const classes = styles();

    let card = <Card className={classNames(classes.card, className)}>
        {children}
    </Card>;

    if (to) {
        card = <NavLink to={to} className={classes.clickableCard}>
            {card}
        </NavLink>;
    }

    return card;
};

export default PiccaCard;

