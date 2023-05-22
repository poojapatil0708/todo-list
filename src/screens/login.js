import { useDispatch } from "react-redux";
import { Formik } from "formik";
import Input from "../components/input";
import * as Yup from 'yup';
import axios from "axios";
import { Link } from "react-router-dom";
import { setUser } from "../redux/user-reducer";
import { toast } from "react-toastify";
import constants from "../constants";
import { useState } from "react";
import Loader from "../components/loader";

const LogIn = () => {

    const initialValues = { email: '', password: '' }
    const [isLoading, setIsLoding] = useState(false)
    const dispatch = useDispatch();

    const validationSchema = () => Yup.object().shape({
        email: Yup.string().email('Invalid Email').required('Email is required'),
        password: Yup.string().required('password is required').min(4, 'Password should be min 4 characters').max(16, 'Password should be max 16 characters')
    })

    const onSubmit = (values) => {
        setIsLoding(true)
        axios({ method: 'POST', url: `${constants.base_url_production}/login`, data: values })
            .then(response => {
                setIsLoding(false);
                dispatch(setUser(response.data))
            })
            .catch(err => {
                setIsLoding(false);
                toast.error(err.response?.data?.message || 'Somthing went wrong')
            })
    }

    return (
        <div>
            <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema} >
                {({ values, setFieldValue, handleSubmit, errors }) => {
                    return (
                        <div className="d-flex flex-column align-items-center justify-content-center h-100">
                            <div className="card p-4 col-md-5 col-11">
                                <h3>Login</h3>
                                <Input type='text' placeholder='Enter Email Id' error={errors.email} onChange={(e) => setFieldValue('email', e)} value={values.email} />
                                <Input error={errors.password} type='password' placeholder='Password' onChange={(e) => setFieldValue('password', e)} value={values.password} />
                                {!isLoading ? 
                                    <button type="submit" className="btn btn-primary" onClick={handleSubmit}>Login</button>
                                    :
                                    <Loader/>}
                            </div>
                            <div className="d-flex justify-content-center mt-2">
                                <div className="mx-1 text-dark">Dont have account?</div>
                                <Link className="text-primary" style={{ textDecoration: 'none' }} to='/signup'>Create account</Link>
                            </div>
                        </div>
                    )
                }}
            </Formik>
        </div>
    );
}

export default LogIn;