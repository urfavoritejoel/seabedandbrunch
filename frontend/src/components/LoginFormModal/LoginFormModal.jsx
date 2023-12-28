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

                if (data && data.message) {
                    setErrors({ credential: data.message });
                }
            });
    };

    return (
        <div>
            <h1 className='centered'>Log In</h1>
            <form onSubmit={handleSubmit}>
                <div className='formContainer'>
                    <input
                        placeholder='Username'
                        type="text"
                        value={credential}
                        onChange={(e) => {
                            setCredential(e.target.value);
                            setErrors({});
                        }
                        }
                        required
                    />
                    <input
                        placeholder='Password'
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {errors.credential && (
                        <p className='errors'>{errors.credential}</p>
                    )}
                    <button type="submit" disabled={credential.length < 4 || password.length < 6 ? true : false}>Log In</button>
                </div>
            </form>
            <p className='centered'>
                <button onClick={loginDemo} className='formButton'>Log in as Demo User</button>
            </p>
        </div>
    );
}

export default LoginFormModal;
