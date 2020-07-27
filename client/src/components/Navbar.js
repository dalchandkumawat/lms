import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { UserContext } from '../App';
const Navbar = () => {
    const { state, dispatch } = useContext(UserContext);
    const history = useHistory();
    return (
        <nav>
            <div className="nav-wrapper #ba68c8 purple lighten-2">
                <span className="brand-logo1" onClick={()=>history.push('/')} style={{cursor:"pointer",fontFamily:"'Alegreya', serif"}}>LMS</span>
                <ul id="nav-mobile" className="right">
                    {
                        state ? <><li><Link to='/profile'>Profile</Link></li><li>
                            <a
                                onClick={() => {
                                    localStorage.clear();
                                    dispatch({ type: "CLEAR" });
                                    history.push('/signin');
                                }}
                            >Logout
                            </a>
                            </li>
                            </> : ""
                    }
                    {
                        state ? "" : <><li><Link to='/signin'>Signin</Link></li><li><Link to='/signup'>Signup</Link></li></>
                    }
                </ul>
            </div>
        </nav>
    )
}
export default Navbar;