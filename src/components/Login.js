import React, {useState} from 'react'
import { AUTH_TOKEN } from '../constants'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks';

const Login  = (props) => {
    const [login, setLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const [mutation] = useMutation(
        login ? LOGIN_MUTATION : SIGNUP_MUTATION,
        {
            onCompleted(data) { _confirm(data) }
        }
    );

    const _confirm = async data => {
        const { token } = login ? data.login : data.signup
        _saveUserData(token)
        props.history.push(`/`)
    }

    const _saveUserData = token => {
        localStorage.setItem(AUTH_TOKEN, token)
    }

    const onSubmit = (e) => {
        e.preventDefault();
        mutation({ variables: { email, password, name } });
    };

    return (
        <div>
            <h4 className="mv3">{login ? 'Login' : 'Sign Up'}</h4>
            <div className="flex flex-column">
                {!login && (
                    <input
                        value={name}
                        onChange={e => setName(e.target.value)}
                        type="text"
                        placeholder="Your name"
                        className="form-control mb-2"
                    />
                )}
                <input
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    type="text"
                    placeholder="Your email address"
                    className="form-control mb-2"
                />
                <input
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    type="password"
                    placeholder="Choose a safe password"
                    className="form-control"
                />
            </div>
            <div className="flex mt3">
                <div className="pointer mr2 btn btn-outline-primary btn-sm" onClick={onSubmit}>
                    {login ? 'login' : 'create account'}
                </div>
                <div
                    className="pointer btn btn-outline-success btn-sm"
                    onClick={() => setLogin(!login)}
                >
                    {login
                        ? 'need to create an account?'
                        : 'already have an account?'}
                </div>
            </div>
        </div>
    )
};

const SIGNUP_MUTATION = gql`
  mutation SignupMutation($email: String!, $password: String!, $name: String!) {
    signup(email: $email, password: $password, name: $name) {
      token
    }
  }
`;

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

export default Login;
