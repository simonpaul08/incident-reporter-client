import { useState } from 'react'
import Header from '../components/Header'
import { FaFile, FaSearch, FaUserPlus } from 'react-icons/fa'

const Dashboard = () => {

    const [searchBook, setSearchBook] = useState("")

    return (

        <div className="dashboard-content-wrapper">
            {/* {isRequest && <FullScreenLoader />} */}
            <Header />
            <div className="dashboard-content">
                <div className="add-book-wrapper">
                    <div className='add-admin-wrapper'>
                        <button type="button" className="add-admin" >
                            <FaFile color="#fff" className="add-admin-icon" /> Report Incident
                        </button>
                    </div>
                    <div className="search-wrapper">
                        <form className="search-form">
                            <input
                                type="text"
                                name="search"
                                className="search-form-input"
                                placeholder="Search Book"
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
                                    <th>Return Date</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* {isLoading && registry?.length === 0 && <Loader />}
                                {registry?.map(r => {

                                    const issueDate = new Date(r?.issueDate).toLocaleDateString();
                                    const returnDate = r?.returnDate ? new Date(r?.returnDate).toLocaleDateString() : "NA";

                                    return (
                                        <tr key={r?.issueId}>
                                            <td>{r?.issueId}</td>
                                            <td>{r?.BookInventory?.title}</td>
                                            <td>{issueDate}</td>
                                            <td>{returnDate}</td>
                                            <td>{r?.issueStatus}</td>
                                            <td>{r?.issueStatus === "returned" ? "returned" : <button className='search-btn return-btn' onClick={() => handleReturnBook(r?.isbn)}>Return</button>}</td>
                                        </tr>
                                    )
                                })} */}

                            </tbody>
                        </table>
                    </div>
                </>
            </div>
        </div>
    )
}

export default Dashboard