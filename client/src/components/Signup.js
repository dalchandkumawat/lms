import React, { useState,useContext } from 'react';
import {useHistory} from 'react-router-dom';
import {UserContext} from '../App';
import M from 'materialize-css';
const Signup = () => {
    const {state,dispatch}=useContext(UserContext);
    const history=useHistory();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [usertype, setUserType] = useState("");
    const [phonenumber, setPhoneNumber] = useState("");
    const [otp, setOtp] = useState("");
    const [showOtp, setShowOtp] = useState(false);
    const getOtpClick=()=>{
        fetch("/signup",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name,email,usertype,phonenumber
            })
        }).then(res=>res.json())
        .then(result=>{
            if(result.error){
                M.toast({html:result.error,classes:"#c62727 red darken-3"});
            }
            else{
                setShowOtp(true);
            }
        })
    }
    const signupClick=()=>{
        fetch('/verifyotp',{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                phonenumber,otp
            })
        }).then(res=>res.json())
        .then(result=>{
            if(result.error){
                M.toast({html:result.error,classes:"#c62727 red darken-3"});
            }
            else{                
                localStorage.setItem('jwt',result.token);
                localStorage.setItem('user',JSON.stringify(result.user));
                dispatch({type:"USER",payload:result.user});
                M.toast({html:"Signup successful",classes:"#43a047 green darken-1"})
                history.push('/');
            }
        })
    }
    return (
        <div className="wrapper">
            <div className="content authcontent">
                <div className="row">
                    <form className="col s12">
                        <div className="row">
                            <div className="col s12 text-center">
                                <h3 style={{ textAlign: "center" }}>Signup</h3>
                            </div>
                        </div>
                        <div className="row">
                            <div className="input-field col s12">
                                <input id="name" type="text" value={name} className="validate" onChange={(e) => setName(e.target.value)}></input>
                                <label htmlFor="name">Name</label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="input-field col s12">
                                <input id="email" type="email" value={email} className="validate" onChange={(e) => setEmail(e.target.value)}></input>
                                <label htmlFor="email">Email</label>
                            </div>
                        </div>
                        <div className="row" style={{marginBottom:"3rem"}}>
                            <div className="input-field col s6 input-field-with-margin-bottom">
                                <label>
                                    <input name="usertype" type="radio" onChange={(e)=>setUserType("Student")} checked={usertype=='Student'}/>
                                    <span>Student</span>
                                </label>
                            </div>
                            <div className="input-field col s6 input-field-with-margin-bottom">
                                <label>
                                    <input name="usertype" type="radio" onChange={(e)=>setUserType("Teacher")} checked={usertype=='Teacher'}/>
                                    <span>Teacher</span>
                                </label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="input-field col s12">
                                <input id="phonenumber" type="text" value={phonenumber} className="validate" onChange={(e) => setPhoneNumber(e.target.value)}></input>
                                <label htmlFor="phonenumber">Mobile Number</label>
                            </div>
                        </div>
                        {!showOtp?
                        <div className="row">
                            <div className="input-field col s12 rightAlign">
                                <button className="btn waves-effect waves-light" type="button" disabled={phonenumber.length<10 || name.length==0 || usertype==""} onClick={getOtpClick}>Get OTP
                                    <i className="material-icons right">mail</i>
                                </button>
                            </div>
                        </div>
                        :null}                        
                        {showOtp?
                        <>
                        <div className="row">
                            <div className="input-field col s12">
                                <input id="otp" type="text" value={otp} onChange={(e) => setOtp(e.target.value)}></input>
                                <label htmlFor="otp">Enter 6 digit OTP</label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="input-field col s12 rightAlign">
                                <button className="btn waves-effect waves-light" type="button" onClick={signupClick} disabled={otp.length!=6} name="action">Sign UP
                                    <i className="material-icons right">lock</i>
                                </button>
                            </div>
                        </div>                        
                        </>:null}
                    </form>
                </div>
            </div>
        </div>
    )
}
export default Signup;