import { useEffect, useState } from 'react'
import Header from '../components/Header'
import { FaFile, FaSearch } from 'react-icons/fa'
import { useAuthContext } from '../context/AuthContext'
import AddIncident from '../components/AddIncident'
import Loader from '../components/loader/Loader'
import { FaPencil } from 'react-icons/fa6'

const Dashboard = () => {

    const [searchBook, setSearchBook] = useState("")
    const [incidents, setIncidents] = useState([])
    const [isModal, setIsModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
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
    const closeModal = () => {
        setSelectedIncident(null)
        setIsModal(false)
    }

    // handle edit incident                                                 
    const handleEditIncident = (incident) => {
        setSelectedIncident(incident)
        setIsModal(true)
    }

    useEffect(() => {
        fetchUserIncidents()
    }, [])

    return (

        <div className="dashboard-content-wrapper">
            {/* {isRequest && <FullScreenLoader />} */}
            <Header />
            {isModal && <AddIncident closeModal={closeModal} fetchUserIncidents={fetchUserIncidents} incident={selectedIncident}/>}
            <div className="dashboard-content">
                <div className="add-book-wrapper">
                    <div className='add-admin-wrapper'>
                        <button type="button" className="add-admin" onClick={openModal}>
                            <FaFile color="#fff" className="add-admin-icon" /> Report Incident
                        </button>
                    </div>
                    <div className="search-wrapper">
                        <form className="search-form">
                            <input
                                type="text"
                                name="search"
                                className="search-form-input"
                                placeholder="Search Incident by ID"
                                value={searchBook}
                                onChange={(e) => setSearchBook(e.target.value)}
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