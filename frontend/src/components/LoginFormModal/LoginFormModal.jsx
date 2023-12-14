import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
    const dispatch = useDispatch();
    const [credential, setCredential] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        return dispatch(sessionActions.loginThunk({ credential, password }))
            .then(closeModal)
            .catch(async (res) => {
                const data = await res.json();
                console.log(data);
                if (data && data.message) {
                    setErrors({ credential: data.message });
                }
            });
    };

    const loginDemo = () => {
        return dispatch(sessionActions.loginThunk({ credential: 'demoUser', password: 'password' }))
            .then(closeModal)
            .catch(async (res) => {
                const data = await res.json();
                console.log(data);
                if (data && data.message) {
                    setErrors({ credential: data.message });
                }
            });
    };

    return (
        <>
            <h1>Log In</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Username or Email
                    <input
                        type="text"
                        value={credential}
                        onChange={(e) => {
                            setCredential(e.target.value);
                            setErrors({});
                        }
                        }
                        required
                    />
                </label>
                <label>
                    Password
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                {errors.credential && (
                    <p className='errors'>{errors.credential}</p>
                )}
                <button type="submit" disabled={credential.length < 4 || password.length < 6 ? true : false}>Log In</button>
            </form>
            <p>
                <button onClick={loginDemo}>Log in as Demo User</button>
            </p>
        </>
    );
}

export default LoginFormModal;
