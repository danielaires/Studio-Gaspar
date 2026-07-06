import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function Layout({ children }) {

    return (

        <div className="d-flex">

            <Sidebar />

                <div className="main-area flex-grow-1">

                    <Navbar />

                    <div className="container mt-4">

                        {children}

                    </div>

                </div>

        </div>

    );

}

export default Layout;