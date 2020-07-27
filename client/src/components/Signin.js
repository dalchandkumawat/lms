import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { UserContext } from '../App';
import M from 'materialize-css';
const Signin = () => {
    const { state, dispatch } = useContext(UserContext);
    const history = useHistory();
    const [phonenumber, setPhoneNumber] = useState("");
    const [showOtp, setShowOtp] = useState(false);
    const [otp, setOtp] = useState("");
    const getOtpClick = () => {
        fetch('/signin', {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                phonenumber
            })
        }).then(res => res.json())
            .then(result => {
                if (result.error) {
                    M.toast({ html: result.error, classes: "#c62727 red darken-3" });
                }
                else {
                    setShowOtp(true);
                }
            })
    }
    const signinClick = () => {
        fetch('/verifyotp', {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                phonenumber, otp
            })
        }).then(res => res.json())
            .then(result => {
                if (result.error) {
                    M.toast({ html: result.error, classes: "#c62727 red darken-3" });
                }
                else {
                    localStorage.setItem('jwt', result.token);
                    localStorage.setItem('user', JSON.stringify(result.user));
                    dispatch({ type: "USER", payload: result.user });
                    M.toast({ html: "Signin successful", classes: "#43a047 green darken-1" })
                    history.push('/');
                }
            }).catch(err => console.log(err));
    }
    return (
        <div className="wrapper">
            <div className="content authcontent">
                <div className="row">
                    <form className="col s12">
                        <div className="row">
                            <div className="col s12 text-center">
                                <h3 style={{ textAlign: "center" }}>Signin</h3>
                            </div>
                        </div>
                        <div className="row">
                            <div className="input-field col s12">
                                <input id="phonenumber" type="text" value={phonenumber} onChange={(e) => setPhoneNumber(e.target.value)}></input>
                                <label htmlFor="phonenumber">Mobile Number</label>
                            </div>
                        </div>
                        {!showOtp ?
                            <div className="row">
                                <div className="input-field col s12 rightAlign">
                                    <button className="btn waves-effect waves-light" type="button" disabled={phonenumber.length<10} onClick={getOtpClick}>Get OTP
                            <i className="material-icons right">mail</i>
                                    </button>
                                </div>
                            </div>
                            : null}
                        {showOtp ? <>
                            <div className="row">
                                <div className="input-field col s12">
                                    <input id="otp" type="text" value={otp} onChange={(e) => setOtp(e.target.value)}></input>
                                    <label htmlFor="otp">Enter 6 digit OTP</label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field col s12 rightAlign">
                                    <button className="btn waves-effect waves-light" type="button" disabled={otp.length!=6} onClick={signinClick}>Sign IN
                                    <i className="material-icons right">lock</i>
                                    </button>
                                </div>
                            </div></>
                            : null}
                    </form>
                </div>
            </div>
        </div>
    )
}
export default Signin;