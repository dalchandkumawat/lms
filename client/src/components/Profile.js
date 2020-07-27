import React,{useContext} from 'react';
import {UserContext} from '../App';
const Profile = () => {
    const {state,dispatch}=useContext(UserContext);
    return (
        <div className="wrapper">
            <div className="content">
                <div className="row">
                    <div className="col s12 text-center">
                        <h3 style={{ textAlign: "center" }}>Profile</h3>
                    </div>
                </div>
                <table className="highlight">
                    <tbody>
                        <tr>
                            <td>Name</td>
                            <td>{state?state.name:""}</td>
                        </tr>
                        <tr>
                            <td>Email</td>
                            <td>{state?state.email:""}</td>
                        </tr>
                        <tr>
                            <td>Mobile Number</td>
                            <td>{state?state.phonenumber:""}</td>
                        </tr>
                        <tr>
                            <td>User Type</td>
                            <td>{state?state.usertype:""}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}
export default Profile;