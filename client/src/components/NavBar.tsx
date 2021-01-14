import React, { useState } from 'react';
import { Collapse, Container, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { NavLink as RouterNavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const NavBar: React.ComponentType = () => {
    const [isOpen, setOpen] = useState(false);

    return <Navbar color={'light'} light expand={'sm'} className={'p-0'}>
        <Container>
            <NavbarBrand>
                <RouterNavLink to={'/'} component={NavLink} className={'pl-sm-0'}>
                    <b>Picca</b>&nbsp;&nbsp;<small className={'text-muted'}>
                    <small>
                        By Matthew Tory for Shopify 😁
                    </small>
                </small>
                </RouterNavLink>
            </NavbarBrand>
            <NavbarToggler onClick={() => setOpen(!isOpen)} />
            <Collapse isOpen={isOpen} navbar>
                <Nav className={'ml-auto'} navbar>
                    <NavItem>
                        <RouterNavLink to={'/browse'} component={NavLink}>Browse</RouterNavLink>
                    </NavItem>
                    <NavItem>
                        <RouterNavLink to={'/sell'} component={NavLink}>Sell</RouterNavLink>
                    </NavItem>
                    <NavItem>
                        <RouterNavLink to={'/me'} component={NavLink}>
                            <FontAwesomeIcon icon={faUser} className={'text-muted'} />
                        </RouterNavLink>
                    </NavItem>
                </Nav>
            </Collapse>
        </Container>
    </Navbar>;
};

export default NavBar;