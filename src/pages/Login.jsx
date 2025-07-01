import React, { useState } from 'react'
import Loader from '../components/loader/Loader'
import { Link, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik';
import { axiosPublic } from '../utils/axios';
import { useAuthContext } from '../context/AuthContext';
import { toast, Toaster } from 'sonner';
import { object, string } from 'yup';

const Login = () => {

    const [isLoading, setIsLoading] = useState(false);
    const { handleSetUser } = useAuthContext()
    const navigate = useNavigate()

    // form schema
    const formScehma = object().shape({
        email: string().required("email is required"),
        password: string().required("password is required"),
    });


    const handleSubmit = async (values) => {
        if (formik.errors) {
            formik.validateForm()
        }

        setIsLoading(true)

        try {
            const res = await axiosPublic.post("api/auth/login", { ...values });
            toast.success(res.data?.message);
            setTimeout(() => {
                handleSetUser(res.data?.user);
                navigate("/dashboard");
            }, 1000);
        } catch (error) {
            console.error(error)
            if (error?.response?.data?.message) {
                toast.error(error?.response?.data?.message);
            } else if (error?.message) {
                toast.error(error?.message);
            } else {
                toast.error("something went wrong");
            }
        } finally {
            setIsLoading(false);
        }
    }

    // initialize formik
    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: formScehma,
        onSubmit: handleSubmit,
        validateOnChange: false,
    });
    return (
        <>
            <Toaster richColors position="top-center" duration={2000} />
            <div className="auth">
                <div className="auth-container">
                    <div className="auth-content">

                        {/* left */}
                        <div className="auth-content-left">
                            <h1 className="auth-content-title auth-left-title">Incident Reporter</h1>
                            <p className="auth-content-para auth-left-para">
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sint totam sapiente maxime perspiciatis ab ratione perferendis cum quidem odit illum!
                            </p>
                        </div>

                        {/* right */}
                        <div className="auth-content-right">
                            <h1 className="auth-content-title">Register Here</h1>
                            <p className="auth-content-para">
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi, voluptates!
                            </p>
                            <form method='POST' className="auth-form" onSubmit={formik.handleSubmit}>


                                <div className="form-item">
                                    <input
                                        type="email"
                                        className="form-input"
                                        name="email"
                                        id="email"
                                        placeholder="Enter your email address"
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                    />
                                    <p>{formik.errors.email || ""}</p>
                                </div>


                                <div className="form-item">
                                    <input
                                        type="password"
                                        name='password'
                                        id='password'
                                        value={formik.values.password}
                                        onChange={formik.handleChange}
                                        className='form-input'
                                        placeholder='Enter password'
                                    />
                                    <p>{formik.errors.password || ""}</p>
                                </div>


                                <button type="submit" className="form-btn">
                                    {isLoading ? <Loader /> : "Login Now"}
                                </button>
                            </form>
                            <p className="form-redirect">
                                Don't have an account ? <Link to="/register">Register</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login