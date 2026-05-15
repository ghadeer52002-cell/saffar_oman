import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormGroup,
  Label,
  Row,
} from 'reactstrap';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../features/UserSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RegisterValidation } from '../validations/RegisterValidation';

import treeImg from '../assets/tree.jpeg';

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const message = useSelector((state) => state.user.message);
  const error = useSelector((state) => state.user.error);
  const user = useSelector((state) => state.user.user);
  const isSuccess = useSelector((state) => state.user.isSuccess);
  const isLoading = useSelector((state) => state.user.isLoading);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(RegisterValidation),
    mode: 'onSubmit',
  });

  useEffect(() => {
    if (message === 'registered' && isSuccess && user) {
      navigate('/home');
    }
  }, [message, isSuccess, user, navigate]);

  const onSubmit = (data) => {
    dispatch(registerUser(data));
  };

  return (
    <section
      style={{
        minHeight: '100vh',
        background: '#f4f7fb',
        overflow: 'hidden',
      }}
    >
      <Container fluid className="px-0">
        <Row className="gx-0" style={{ minHeight: '100vh' }}>
          <Col
            md={6}
            className="d-none d-md-flex"
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              padding: '45px',
              background: '#eef2f7',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '88%',
                borderRadius: '35px',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 20px 50px rgba(198, 121, 121, 0.08)',
                background: '#edf2f7',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: `url(${treeImg})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  opacity: 0.45,
                }}
              />

              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(to bottom right, rgba(255,255,255,0.58), rgba(255,255,255,0.36))',
                }}
              />

              <div
                style={{
                  position: 'relative',
                  zIndex: 2,
                  textAlign: 'center',
                }}
              >
                <h1
                  style={{
                    fontSize: '58px',
                    fontWeight: '900',
                    color: '#001f4d',
                    marginBottom: '18px',
                    letterSpacing: '1px',
                  }}
                >
                  Discover Oman
                </h1>

                <p
                  style={{
                    fontSize: '24px',
                    color: '#52627a',
                    margin: 0,
                  }}
                >
                  Create your travel account
                </p>
              </div>
            </div>
          </Col>

          <Col
            md={6}
            xs={12}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '35px',
            }}
          >
            <Card
              style={{
                width: '100%',
                maxWidth: '470px',
                border: 'none',
                borderRadius: '30px',
                padding: '24px',
                boxShadow: '0 18px 45px rgba(0,0,0,0.08)',
              }}
            >
              <CardBody>
                <div
                  style={{
                    letterSpacing: '6px',
                    fontSize: '14px',
                    color: '#526d8a',
                    marginBottom: '22px',
                  }}
                >
                  SAFFAR OMAN
                </div>

                <h2
                  style={{
                    fontSize: '42px',
                    fontWeight: '800',
                    color: '#07182f',
                    marginBottom: '10px',
                    lineHeight: '1.1',
                  }}
                >
                  Create your Account
                </h2>

                <p
                  style={{
                    fontSize: '18px',
                    color: '#607089',
                    marginBottom: '30px',
                  }}
                >
                  Register to start your journey
                </p>

                <Form onSubmit={handleSubmit(onSubmit)}>
                  {(error || message) && message !== 'registered' && (
                    <div
                      style={{
                        background: '#ffe8e8',
                        color: '#b42318',
                        padding: '12px 15px',
                        borderRadius: '12px',
                        marginBottom: '18px',
                      }}
                    >
                      {error || message}
                    </div>
                  )}

                  <FormGroup>
                    <Label
                      style={{
                        fontWeight: '600',
                        color: '#07182f',
                        marginBottom: '8px',
                      }}
                    >
                      Full Name
                    </Label>

                    <input
                      type="text"
                      placeholder="Enter your full name"
                      {...register('fullName')}
                      style={{
                        width: '100%',
                        height: '58px',
                        borderRadius: '18px',
                        border: errors.fullName
                          ? '2px solid #dc3545'
                          : '1px solid #d4dce7',
                        fontSize: '16px',
                        padding: '0 18px',
                        outline: 'none',
                      }}
                    />

                    <div
                      style={{
                        color: '#dc3545',
                        fontSize: '14px',
                        marginTop: '6px',
                      }}
                    >
                      {errors.fullName?.message}
                    </div>
                  </FormGroup>

                  <FormGroup>
                    <Label
                      style={{
                        fontWeight: '600',
                        color: '#07182f',
                        marginBottom: '8px',
                      }}
                    >
                      Email Address
                    </Label>

                    <input
                      type="email"
                      placeholder="Enter your email"
                      {...register('email')}
                      style={{
                        width: '100%',
                        height: '58px',
                        borderRadius: '18px',
                        border: errors.email
                          ? '2px solid #dc3545'
                          : '1px solid #d4dce7',
                        fontSize: '16px',
                        padding: '0 18px',
                        outline: 'none',
                      }}
                    />

                    <div
                      style={{
                        color: '#dc3545',
                        fontSize: '14px',
                        marginTop: '6px',
                      }}
                    >
                      {errors.email?.message}
                    </div>
                  </FormGroup>

                  <FormGroup>
                    <Label
                      style={{
                        fontWeight: '600',
                        color: '#07182f',
                        marginBottom: '8px',
                      }}
                    >
                      Phone Number
                    </Label>

                    <input
                      type="tel"
                      placeholder="Enter your phone number"
                      {...register('phone')}
                      style={{
                        width: '100%',
                        height: '58px',
                        borderRadius: '18px',
                        border: errors.phone
                          ? '2px solid #dc3545'
                          : '1px solid #d4dce7',
                        fontSize: '16px',
                        padding: '0 18px',
                        outline: 'none',
                      }}
                    />

                    <div
                      style={{
                        color: '#dc3545',
                        fontSize: '14px',
                        marginTop: '6px',
                      }}
                    >
                      {errors.phone?.message}
                    </div>
                  </FormGroup>

                  <FormGroup>
                    <Label
                      style={{
                        fontWeight: '600',
                        color: '#07182f',
                        marginBottom: '8px',
                      }}
                    >
                      Password
                    </Label>

                    <input
                      type="password"
                      placeholder="Enter your password"
                      {...register('password')}
                      style={{
                        width: '100%',
                        height: '58px',
                        borderRadius: '18px',
                        border: errors.password
                          ? '2px solid #dc3545'
                          : '1px solid #d4dce7',
                        fontSize: '16px',
                        padding: '0 18px',
                        outline: 'none',
                      }}
                    />

                    <div
                      style={{
                        color: '#dc3545',
                        fontSize: '14px',
                        marginTop: '6px',
                      }}
                    >
                      {errors.password?.message}
                    </div>
                  </FormGroup>

                  <FormGroup>
                    <Label
                      style={{
                        fontWeight: '600',
                        color: '#07182f',
                        marginBottom: '8px',
                      }}
                    >
                      Confirm Password
                    </Label>

                    <input
                      type="password"
                      placeholder="Confirm your password"
                      {...register('confirmPassword')}
                      style={{
                        width: '100%',
                        height: '58px',
                        borderRadius: '18px',
                        border: errors.confirmPassword
                          ? '2px solid #dc3545'
                          : '1px solid #d4dce7',
                        fontSize: '16px',
                        padding: '0 18px',
                        outline: 'none',
                      }}
                    />

                    <div
                      style={{
                        color: '#dc3545',
                        fontSize: '14px',
                        marginTop: '6px',
                      }}
                    >
                      {errors.confirmPassword?.message}
                    </div>
                  </FormGroup>

                  <FormGroup>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      style={{
                        width: '100%',
                        height: '60px',
                        borderRadius: '35px',
                        background:
                          'linear-gradient(135deg, #6b3f2f, #8b553d)',
                        border: 'none',
                        fontSize: '18px',
                        fontWeight: '700',
                        marginTop: '15px',
                      }}
                    >
                      {isLoading ? 'Creating Account...' : 'Register'}
                    </Button>
                  </FormGroup>

                  <FormGroup
                    style={{
                      textAlign: 'center',
                      marginTop: '22px',
                      color: '#52627a',
                    }}
                  >
                    Already have an account?{' '}

                    <Link
                      to="/"
                      style={{
                        color: '#6b3f2f',
                        fontWeight: '700',
                        textDecoration: 'none',
                      }}
                    >
                      Login
                    </Link>
                  </FormGroup>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default Register;