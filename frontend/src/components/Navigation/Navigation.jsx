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
                    <img className='logo' src='https://static.vecteezy.com/system/resources/previews/020/577/134/original/water-drop-sign-in-pixel-art-style-vector.jpg' />
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
