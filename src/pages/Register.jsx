import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { object, string, ref } from 'yup';
import axios from 'axios';
import Loader from '../components/loader/Loader';
import { toast, Toaster } from 'sonner';
import { useAuthContext } from '../context/AuthContext';

const TYPE = {
    INDIVIDUAL: "individual",
    ENTERPRISE: "enterprise",
    GOVERNMENT: "government"
}

const Register = () => {

    const [isLoading, setIsLoading] = useState(false);

    const [countries, setCountries] = useState([])
    const [states, setStates] = useState([])
    const [cities, setCities] = useState([])

    const navigate = useNavigate()

    const { publicInstance } = useAuthContext();

    const schema = object({
        type: string().oneOf(["individual", "enterprise", "government"]).required("type is required"),
        firstName: string().required("first name is required"),
        lastName: string().required("last name is required"),
        email: string().email("invalid email").required("email field is required"),
        address: string().required("address is required"),
        country: string().required("country is required"),
        state: string().required("state is required"),
        city: string().required("city is required"),
        pincode: string().required("pincode is required"),
        countryCode: string().required("country code is required"),
        mobile: string().required("mobile number is required"),
        fax: string(),
        phone: string(),
        password: string()
            .min(6, "password must be of atleast 6 digits")
            .required("password is required"),
        confirmPassword:
            string()
                .oneOf([ref("password")], "passwords must match")
                .required("confirm Password is required"),
    });

    // handle submit
    const handleSubmit = async (values) => {
        if (formik.errors) {
            formik.validateForm()
        }

        setIsLoading(true)

        const { countryCode, ...rest } = values;

        try {
            const res = await publicInstance.post("api/auth/register", { ...rest });
            toast.success(res.data?.message);
            setTimeout(() => {
                navigate("/login");
            }, 800);
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

    // fetch states by country
    const fetchStates = async (country) => {
        try {
            const res = await axios.post("https://countriesnow.space/api/v0.1/countries/states", {
                country
            })
            if (res.data?.data) {
                const states = res.data?.data?.states?.map(state => state.name)
                setStates(states)
            }
        } catch (err) {
            console.error(err)
        }
    }

    // fetch cities by country and state
    const fetchCities = async (state) => {
        try {
            const res = await axios.post('https://countriesnow.space/api/v0.1/countries/state/cities', {
                country: formik.values.country,
                state,
            });
            if (res.data?.data) {
                setCities(res.data?.data)
            }
        } catch (err) {
            console.log(err)
        }
    }

    const formik = useFormik({
        initialValues: {
            type: TYPE.INDIVIDUAL,
            firstName: "",
            lastName: "",
            email: "",
            address: "",
            country: "",
            state: "",
            city: "",
            pincode: "",
            countryCode: "+91",
            mobile: "",
            fax: "",
            phone: "",
            password: "",
            confirmPassword: ""
        },
        validationSchema: schema,
        validateOnChange: false,
        onSubmit: handleSubmit
    });

    // handle change pin
    const handleChangePin = (e) => {
        formik.handleChange(e)
    }

    // handle select country 
    const handleSelectCountry = (e) => {
        formik.handleChange(e);
        fetchStates(e.target.value)
    }

    // handle select country 
    const handleSelectState = (e) => {
        formik.handleChange(e);
        fetchCities(e.target.value)
    }


    useEffect(() => {
        axios.get('https://countriesnow.space/api/v0.1/countries/positions').then(res => {
            const countryList = res.data.data.map((item) => item.name);
            setCountries(countryList);
        });
    }, []);


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
                                    <select
                                        name='type'
                                        id='type'
                                        value={formik.values.type}
                                        onChange={formik.handleChange}
                                        className='form-input form-select'
                                    >
                                        {Object.values(TYPE).map(item => {
                                            return (
                                                <option value={item}>{item.toUpperCase()}</option>
                                            )
                                        })}

                                    </select>
                                    <p>{formik.errors.type || ""}</p>
                                </div>

                                <div className="form-grid">
                                    <div className="form-item">
                                        <input
                                            type="text"
                                            className="form-input"
                                            name="firstName"
                                            id="firstName"
                                            placeholder="Enter first name"
                                            value={formik.values.firstName}
                                            onChange={formik.handleChange}
                                        />
                                        <p>{formik.errors.firstName || ""}</p>
                                    </div>
                                    <div className="form-item">
                                        <input
                                            type="text"
                                            className="form-input"
                                            name="lastName"
                                            id="lastName"
                                            placeholder="Enter last name"
                                            value={formik.values.lastName}
                                            onChange={formik.handleChange}
                                        />
                                        <p>{formik.errors.lastName || ""}</p>
                                    </div>
                                </div>

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
                                        type="text"
                                        className="form-input"
                                        name="address"
                                        id="address"
                                        placeholder="Enter your address"
                                        value={formik.values.address}
                                        onChange={formik.handleChange}
                                    />
                                    <p>{formik.errors.address || ""}</p>
                                </div>

                                <div className="form-grid">


                                    <div className="form-item">
                                        <select
                                            name='country'
                                            id='country'
                                            value={formik.values.country}
                                            onChange={handleSelectCountry}
                                            className='form-input form-select'
                                        >
                                            <option value={""} selected disabled>Select country</option>
                                            {countries?.map(c => {
                                                return (
                                                    <option key={c} value={c}>{c}</option>
                                                )
                                            })}
                                        </select>
                                        <p>{formik.errors.country || ""}</p>
                                    </div>
                                    <div className="form-item">
                                        <select
                                            name='state'
                                            id='state'
                                            value={formik.values.state}
                                            onChange={handleSelectState}
                                            className='form-input form-select'
                                        >
                                            <option value={""} selected disabled>Select state</option>
                                            {states?.map(c => {
                                                return (
                                                    <option key={c} value={c}>{c}</option>
                                                )
                                            })}
                                        </select>
                                        <p>{formik.errors.state || ""}</p>
                                    </div>
                                </div>

                                <div className="form-grid">

                                    <div className="form-item">
                                        <select
                                            name='city'
                                            id='city'
                                            value={formik.values.city}
                                            onChange={formik.handleChange}
                                            className='form-input form-select'
                                        >
                                            <option value={""} selected disabled>Select city</option>
                                            {cities?.map(c => {
                                                return <option key={c} value={c}>{c}</option>
                                            })}
                                        </select>
                                        <p>{formik.errors.city || ""}</p>
                                    </div>
                                    <div className="form-item">
                                        <input
                                            type="text"
                                            className="form-input"
                                            name="pincode"
                                            id="pincode"
                                            placeholder="Enter your pincode"
                                            value={formik.values.pincode}
                                            onChange={handleChangePin}
                                        />
                                        <p>{formik.errors.pincode || ""}</p>
                                    </div>

                                </div>

                                <div className="form-flex">
                                    <div className="form-item country-code">
                                        <select
                                            name="countryCode"
                                            id="countryCode"
                                            value={formik.values.countryCode}
                                            onChange={formik.handleChange}
                                            className='form-input form-select '
                                        >
                                            <option value={""} selected disabled></option>
                                            <option value={"+91"}>+91</option>
                                        </select>
                                    </div>
                                    <div className="form-item">
                                        <input
                                            type="text"
                                            name='mobile'
                                            id='mobile'
                                            value={formik.values.mobile}
                                            onChange={formik.handleChange}
                                            className='form-input'
                                            placeholder='Enter mobile number'
                                        />
                                        <p>{formik.errors.mobile || ""}</p>
                                    </div>
                                </div>

                                <div className="form-grid">

                                    <div className="form-item">
                                        <input
                                            type="text"
                                            name='fax'
                                            id='fax'
                                            value={formik.values.fax}
                                            onChange={formik.handleChange}
                                            className='form-input'
                                            placeholder='Enter Fax (optional)'
                                        />
                                        <p>{formik.errors.fax || ""}</p>
                                    </div>
                                    <div className="form-item">
                                        <input
                                            type="text"
                                            name='phone'
                                            id='phone'
                                            value={formik.values.phone}
                                            onChange={formik.handleChange}
                                            className='form-input'
                                            placeholder='Enter Phone (optional)'
                                        />
                                        <p>{formik.errors.phone || ""}</p>
                                    </div>
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

                                <div className="form-item">
                                    <input
                                        type="password"
                                        name='confirmPassword'
                                        id='confirmPassword'
                                        value={formik.values.confirmPassword}
                                        onChange={formik.handleChange}
                                        className='form-input'
                                        placeholder='Confirm password'
                                    />
                                    <p>{formik.errors.confirmPassword || ""}</p>
                                </div>


                                <button type="submit" className="form-btn">
                                    {isLoading ? <Loader /> : "Register Now"}
                                </button>
                            </form>
                            <p className="form-redirect">
                                Already have an account ? <Link to="/login">Login</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Register