import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { number, object, string } from "yup";
import { useFormik } from "formik";
import Loader from "./loader/Loader";
import { useAuthContext } from "../context/AuthContext";

const AddIncident = ({ closeModal, fetchUserIncidents, incident }) => {
    const [isLoading, setIsLoading] = useState(false);
    const { privateInstance } = useAuthContext()

    const handleSubmit = async (values) => {
        setIsLoading(true);

        try {

            let body = {
                ...values,
                incident_id: incident?.incident_id
            }

            if (incident) {
                const res = await privateInstance.patch(`api/incident/${incident?.id}`, { ...body });
                if (res.data) {
                    closeModal()
                    fetchUserIncidents()
                }
            } else {
                const res = await privateInstance.post("api/incident", { ...values });
                if (res.data) {
                    closeModal()
                    fetchUserIncidents()
                }
            }
        } catch (e) {
            console.error(e)
        }
        finally {
            setIsLoading(false)
        }
    };

    const schema = object({
        reporter_name: string().required("reporter name is required"),
        details: string().required("details is required"),
        priority: string().required("priority is required"),
        reporter_type: string().required("reporter type is required")
    });

    const formik = useFormik({
        initialValues: {
            reporter_name: "",
            details: "",
            priority: "",
            reporter_type: "",
        },
        validationSchema: schema,
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit: handleSubmit,
    });


    useEffect(() => {   
        if(incident) {
            formik.setFieldValue("reporter_name", incident?.reporter_name)
            formik.setFieldValue("reporter_type", incident?.reporter_type)
            formik.setFieldValue("details", incident?.details)
            formik.setFieldValue("priority", incident?.priority)
        }

    },[incident])

    return (
        <div className="modal">
            <div className="modal-content modal-content-alt">
                <div className="modal-close-wrapper">
                    <h3 className="modal-content-title">Report Incident</h3>
                    <IoMdClose className="modal-close" onClick={closeModal} />
                </div>

                <div className="modal-body">
                    <form className="modal-form" onSubmit={formik.handleSubmit}>
                        <div className="modal-form-item">
                            <input
                                type="text"
                                className="form-input-alt"
                                name="reporter_name"
                                id="reporter_name"
                                placeholder="Enter reporter name"
                                value={formik.values.reporter_name}
                                onChange={formik.handleChange}
                            />
                            <p>{formik.errors.reporter_name || ""}</p>
                        </div>
                        <div className="modal-form-item">
                            <textarea
                                type="text"
                                className="form-input-alt"
                                name="details"
                                id="details"
                                placeholder="Enter details"
                                value={formik.values.details}
                                onChange={formik.handleChange}
                            />
                            <p>{formik.errors.details || ""}</p>
                        </div>
                        <div className="modal-form-item">
                            <select
                                name="priority"
                                id="priority"
                                className="form-input-alt form-alt-textarea"
                                value={formik.values.priority}
                                onChange={formik.handleChange}
                            >
                                <option value={""} selected disabled>Select Priority</option>
                                <option value={"low"} >Low</option>
                                <option value={"medium"} >Medium</option>
                                <option value={"high"} >High</option>
                            </select>
                            <p>{formik.errors.priority || ""}</p>
                        </div>
                        <div className="modal-form-item">
                            <select
                                name="reporter_type"
                                id="reporter_type"
                                className="form-input-alt form-alt-textarea"
                                value={formik.values.reporter_type}
                                onChange={formik.handleChange}
                            >
                                <option value={""} selected disabled>Select Type</option>
                                <option value={"individual"} >Individual</option>
                                <option value={"enterprise"} >Enterprise</option>
                                <option value={"government"} >Government</option>
                            </select>
                            <p>{formik.errors.reporter_type || ""}</p>
                        </div>

                        <button type="submit" className="modal-form-btn">
                            {isLoading ? <Loader /> : <>{"Submit"}</>}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddIncident;
