import { useEffect, useState } from 'react'
import Header from '../components/Header'
import { FaFile, FaSearch } from 'react-icons/fa'
import { useAuthContext } from '../context/AuthContext'
import AddIncident from '../components/AddIncident'
import Loader from '../components/loader/Loader'
import { FaPencil } from 'react-icons/fa6'
import UpdateIncident from '../components/UpdateIncident'
import { toast, Toaster } from 'sonner'

const Dashboard = () => {

    const [searchIncident, setSearchIncident] = useState("")
    const [incidents, setIncidents] = useState([])
    const [isModal, setIsModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [selectedIncident, setSelectedIncident] = useState(null)


    const { privateInstance } = useAuthContext();

    // fetch user incidents
    const fetchUserIncidents = async () => {
        setIsLoading(true)
        try {
            const res = await privateInstance.get("api/incident")
            if (res.data) {
                setIncidents(res.data?.incidents ?? [])
            }
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    const openModal = () => setIsModal(true)
    const closeModal = () => setIsModal(false)

    const closeUpdateModal = () => {
        setSelectedIncident(null)
        setIsUpdate(false)
    }


    // handle edit incident                                                 
    const handleEditIncident = (incident) => {
        setSelectedIncident(incident)
        setIsUpdate(true)
    }

    // handle search book
    const handleSearchIncident = async (e) => {

        e.preventDefault();

        if(searchIncident === "") {
            fetchUserIncidents()
            return
        }

        setIsLoading(true)
        setIncidents([])
        try {
            const res = await privateInstance.get(`api/incident/search?query=${searchIncident}`);
            if(res.data) {
               setIncidents(res.data?.incident ?? [])
            }
        } catch (error) {
            console.log(error)
            if (error?.response?.data?.message) {
                toast.error(error?.response?.data?.message);
            } else if (error?.message) {
                toast.error(error?.message);
            } else {
                toast.error("something went wrong");
            }
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchUserIncidents()
    }, [])

    return (

        <div className="dashboard-content-wrapper">
            {/* {isRequest && <FullScreenLoader />} */}
            <Toaster richColors position="top-center" duration={2000} />
            <Header />
            {isModal && <AddIncident closeModal={closeModal} fetchUserIncidents={fetchUserIncidents} />}
            {isUpdate && <UpdateIncident closeModal={closeUpdateModal} fetchUserIncidents={fetchUserIncidents} incident={selectedIncident} />}
            <div className="dashboard-content">
                <div className="add-book-wrapper">
                    <div className='add-admin-wrapper'>
                        <button type="button" className="add-admin" onClick={openModal}>
                            <FaFile color="#fff" className="add-admin-icon" /> Report Incident
                        </button>
                    </div>
                    <div className="search-wrapper">
                        <form className="search-form" onSubmit={handleSearchIncident}>
                            <input
                                type="text"
                                name="search"
                                className="search-form-input"
                                placeholder="Search Incident by ID"
                                value={searchIncident}
                                onChange={(e) => setSearchIncident(e.target.value)}
                            />
                            <button type="submit" className="search-btn">
                                <FaSearch className="search-icon" />
                            </button>
                        </form>
                    </div>
                </div>

                <>
                    <div className="issued-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Incident ID</th>
                                    <th>Details</th>
                                    <th>Reporter Name</th>
                                    <th>Priority</th>
                                    <th>Status</th>
                                    <th>Date Reported</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading && incidents?.length === 0 && <Loader />}
                                {incidents?.map(r => {

                                    const issueDate = new Date(r?.date_reported).toLocaleDateString();

                                    return (
                                        <tr key={r?.incident_id}>
                                            <td>{r?.incident_id}</td>
                                            <td>{r?.details}</td>
                                            <td>{r?.reporter_name}</td>
                                            <td>{r?.priority}</td>
                                            <td>{r?.status}</td>
                                            <td>{issueDate}</td>
                                            <td>
                                                {r?.status === "closed" ? "NA" :
                                                    <>
                                                        <FaPencil
                                                            className="table-action-icon"
                                                            color="#176B87"
                                                            title="Edit Incident"
                                                            onClick={() => handleEditIncident(r)}
                                                        />{" "}
                                                        {/* <FaTrash
                                                            className="table-action-icon"
                                                            color="#dc3545"
                                                            title="Reject Request"
                                                            onClick={() => handleRejectRequest(r?.reqId)}
                                                        /> */}
                                                    </>}
                                            </td>
                                        </tr>
                                    )
                                })}

                            </tbody>
                        </table>
                    </div>
                </>
            </div>
        </div>
    )
}

export default Dashboard