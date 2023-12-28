import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as sessionActions from '../../store/session';
import './SignupForm.css';

function SignupFormModal() {
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === confirmPassword) {
            setErrors({});
            return dispatch(
                sessionActions.signupThunk({
                    email,
                    username,
                    firstName,
                    lastName,
                    password
                })
            )
                .then(closeModal)
                .catch(async (res) => {
                    const data = await res.json();
                    if (data?.errors) {
                        setErrors(data.errors);
                    }
                });
        }
        return setErrors({
            confirmPassword: "Confirm Password field must be the same as the Password field"
        });
    };

    let canSubmit =
        !email.length ||
        !username.length ||
        !firstName.length ||
        !lastName.length ||
        !password.length ||
        !confirmPassword.length ||
        username.length < 4 ||
        password.length < 6;

    return (
        <>
            <h1 className='centered'>Sign Up</h1>
            <form onSubmit={handleSubmit} className='formContainer'>
                <label>
                    Email
                </label>
                <input
                    type="text"
                    name='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                {errors.email && <p>{errors.email}</p>}
                <label>
                    Username
                </label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                {errors.username && <p>{errors.username}</p>}
                <label>
                    First Name
                </label>
                <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                />
                {errors.firstName && <p>{errors.firstName}</p>}
                <label>
                    Last Name
                </label>
                <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                />
                {errors.lastName && <p>{errors.lastName}</p>}
                <label>
                    Password
                </label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {errors.password && <p>{errors.password}</p>}
                <label>
                    Confirm Password
                </label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                {errors.confirmPassword && (
                    <p>{errors.confirmPassword}</p>
                )}
                <p className='centered'>
                    <button type="submit" disabled={canSubmit}>Sign Up</button>
                </p>
            </form>
        </>
    );
}

export default SignupFormModal;
