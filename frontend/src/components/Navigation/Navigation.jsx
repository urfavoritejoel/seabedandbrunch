import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import { useNavigate } from 'react-router-dom';

function Navigation({ isLoaded }) {
    const navigate = useNavigate();
    const sessionUser = useSelector(state => state.session.user);

    return (
        <div className='navList'>
            <div className=''>
                <NavLink to="/">
                    <img className='logo' src='https://i.ibb.co/1dMXPRr/logo.png' />

                    <h1>Seabed and Brunch</h1>
                </NavLink>
            </div>
            <div>
            </div>
            {isLoaded && (
                <div className='navRight'>
                    {sessionUser &&
                        <button onClick={() => navigate('/new')}>Create New Spot</button>}
                    <ProfileButton user={sessionUser} />
                </div>
            )}
        </div>
    );
}

export default Navigation;
