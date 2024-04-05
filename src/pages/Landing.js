import React, {useContext, useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import {CircularProgress} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import {AuthContext} from '../utils/AuthProvider'; // Ensure this path matches where AuthProvider is located
import {isValidEmail} from '../utils/fieldUtil';
import {FormField, LoginButton, Wrapper, Content, LoginCard, Logo} from '../styles/styledLanding';
import logo from '../assets/images/logochandan2.png';

const LoginForm = ({
                       email,
                       setEmail,
                       password,
                       setPassword,
                       handleSubmit,
                       submitted,
                       loading,
                       authError, // Rename this prop to match the error coming from AuthContext
                   }) => (
    <>
        <Typography component="h1" variant="h5">
            Sign In
        </Typography>
        <form onSubmit={handleSubmit}>
            <FormField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={submitted && (!isValidEmail(email) || authError)}
                helperText={submitted && ((!isValidEmail(email) ? 'Invalid Email' : ''))}
            />
            <FormField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="password"
                label="Password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            {submitted && authError && (
                <Typography color="error" style={{marginTop: 8}}>
                    {authError}
                </Typography>
            )}
            <LoginButton
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
            >
                {loading ? 'Logging in...' : 'Sign In'}
            </LoginButton>
        </form>
    </>
);

LoginForm.propTypes = {
    email: PropTypes.string.isRequired,
    setEmail: PropTypes.func.isRequired,
    password: PropTypes.string.isRequired,
    setPassword: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    submitted: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    authError: PropTypes.string, // Update the propType definition
};

const Landing = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const {
        signInWithEmailAndPassword,
        loading: authLoading,
        currentUser,
        initializationCompleted,
        error: authError
    } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitted(true);
        if (!isValidEmail(email)) {
            return; // The error handling for invalid email is already being done in LoginForm, so no need to duplicate here.
        }
        await signInWithEmailAndPassword(email, password);
    };

    useEffect(() => {
        if (initializationCompleted && currentUser) {
            navigate('/company');
        }
    }, [initializationCompleted, currentUser, navigate]);

    if (!initializationCompleted || authLoading) {
        return (
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
                <CircularProgress/>
            </div>
        );
    }

    return (
        <Wrapper>
            <Content>
                <LoginCard>
                    <CardContent>
                        <Logo src={logo} alt="Logo"/>
                        <LoginForm
                            email={email}
                            setEmail={setEmail}
                            password={password}
                            setPassword={setPassword}
                            handleSubmit={handleSubmit}
                            submitted={submitted}
                            loading={authLoading}
                            authError={authError} // Pass the error from AuthContext to LoginForm
                        />
                    </CardContent>
                </LoginCard>
            </Content>
        </Wrapper>
    );
};

export default Landing;
