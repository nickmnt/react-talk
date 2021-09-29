import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Button, Container, Dropdown, Icon, Image, Menu } from 'semantic-ui-react';
import { useStore } from '../stores/store';

export default function NavBar() {
    const {userStore: {user, logout}} = useStore();

    return (

        <Menu inverted fixed='top'>
            <Container>
                <Menu.Item as={NavLink} to='/' exact header>
                    <img src="/assets/logo.png" alt="logo" className="navbar__logo"/>
                    Reactivities
                </Menu.Item>
                <Menu.Item as={NavLink} to='/activities' name="Activities"/>
                <Menu.Item as={NavLink} to='/errors' name="Errors"/>
                <Menu.Item>
                    <Button as={NavLink} to='/createActivity' positive content="Create Activity" />
                </Menu.Item>
                <Menu.Menu position='right' >
                    <Menu.Item>
                        <Icon name='paper plane outline' size='large' />
                    </Menu.Item>
                    <Menu.Item>
                        <Image src={user?.image || '/assets/user.png'} avatar space='right' style={{marginRight: '.75rem'}}/>
                        <Dropdown pointing='top right' text={user?.displayName} >
                            <Dropdown.Menu>
                            <Dropdown.Item as={Link} to={`/profiles/${user?.username}`} text='My Profile' icon='user' />
                            <Dropdown.Item onClick={logout} text='Logout' icon='power' />    
                            </Dropdown.Menu>           
                        </Dropdown>
                    </Menu.Item>
                </Menu.Menu>
            </Container>
        </Menu>
    )
}
