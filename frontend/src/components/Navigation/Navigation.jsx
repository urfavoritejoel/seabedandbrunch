import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
    const sessionUser = useSelector(state => state.session.user);

    return (
        <div className='navList'>
            <div>
                <NavLink to="/">
                    <img className='logo' src='https://static.vecteezy.com/system/resources/previews/020/577/134/original/water-drop-sign-in-pixel-art-style-vector.jpg' />
                </NavLink>
            </div>
            <h1>Seabed and Brunch</h1>
            <div>
            </div>
            {isLoaded && (
                <div>
                    <ProfileButton user={sessionUser} />
                </div>
            )}
        </div>
    );
}

export default Navigation;
