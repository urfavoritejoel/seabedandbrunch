import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import LoginFormModal from '../LoginFormModal/LoginFormModal';
import SignupFormModal from '../SignupFormModal/SignupFormModal';
import { useNavigate } from 'react-router-dom';

function ProfileButton({ user }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();

    const toggleMenu = (e) => {
        e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
        setShowMenu(!showMenu);
    };

    useEffect(() => {
        if (!showMenu) return;

        const closeMenu = (e) => {
            if (!ulRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener('click', closeMenu);

        return () => document.removeEventListener("click", closeMenu);
    }, [showMenu]);

    const logout = (e) => {
        e.preventDefault();
        dispatch(sessionActions.logoutThunk());
        setShowMenu(false);
        navigate('/');
    };

    const manage = (e) => {
        e.preventDefault();
        setShowMenu(false);
        navigate('/manage')
    }

    const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

    return (
        <>
            <button onClick={toggleMenu}>
                <i className="fas fa-user-circle" />
            </button>
            <div>
                <ul className={ulClassName} ref={ulRef}>
                    {user ? (
                        <>
                            <li>Hello, {user.firstName}</li>
                            <li>{user.email}</li>
                            <li>
                                <button onClick={manage}>Manage Spots</button>
                            </li>
                            <li>
                                <button onClick={logout}>Log Out</button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <OpenModalButton
                                    buttonText="Log In"
                                    modalComponent={<LoginFormModal />}
                                />
                            </li>
                            <li>
                                <OpenModalButton
                                    buttonText="Sign Up"
                                    modalComponent={<SignupFormModal />}
                                />
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </>
    );
}

export default ProfileButton;
