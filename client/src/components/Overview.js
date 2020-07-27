import React,{useState,useContext,useEffect} from 'react';
import { useHistory} from 'react-router-dom';
import {UserContext} from '../App';
import Students from './Students';
import M from 'materialize-css';
const Overview = () => {
    const history=useHistory();
    const {state,dispatch}=useContext(UserContext);
    const profileId=history.location.pathname.substring(history.location.pathname.indexOf('/overview')+10);
    const [id,setId]=useState("");
    const [name,setName]=useState("");
    const [subject,setSubject]=useState("");
    const [instructorName,setInstructorName]=useState("");
    const [fromTime,setFromTime]=useState("");
    const [toTime,setToTime]=useState("");
    const [noOfStudents,setNoOfStudents]=useState(0);
    const [daysOfClass,setDaysOfClass]=useState([]);
    const [showStudents,setShowStudents]=useState(false);
    useEffect(()=>{
        fetch('/getclass/'+profileId,{
            method:"get",
            headers:{
                "authorization":"Bearer "+localStorage.getItem("jwt"),
                "Content-Type":"application/json"
            }
        }).then(res=>res.json())
        .then(result=>{
            if(result.error){
                M.toast({html:result.error,classes:"#c62727 red darken-3"});
            }
            else{
                result=result.class;
                setId(result.id);
                setName(result.name);
                setSubject(result.subject);
                setFromTime(result.fromTime);
                setToTime(result.toTime);
                setDaysOfClass(result.daysOfClass);
                setInstructorName(result.instructorname);
            }
        })
        fetch('/getCountOfStudents/'+profileId,{
            method:"get",
            headers:{
                "authorization":"Bearer "+localStorage.getItem("jwt"),
                "Content-Type":"application/json"
            }
        }).then(res=>res.json())
        .then(result=>{
            if(result.error)
                M.toast({html:result.error,classes:"#c62727 red darken-3"});
            else    
                setNoOfStudents(result.count);
        })
    },[]) 
    const deleteClick=()=>{
        fetch('/deleteclass/'+profileId,{
            method:"delete",
            headers:{
                "authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            if(result.error)
                M.toast({html:result.error,classes:"#c62727 red darken-3"});
            else{
                M.toast({html:result.message,classes:"#43a047 green darken-1"});
                history.push('/');
            }
        })
    }   
    const editClassClicked=()=>{
        history.push('/addclass/edit/'+profileId);
    }
    return (
        <div className="wrapper">
            <div className="content">
                <div className="row">
                    <div className="col s12 text-center">
                        <h3 style={{ textAlign: "center" }}>Overview</h3>
                    </div>
                </div>
                <table className="highlight">
                    <tbody>
                        <tr>
                            <td>ClassRoom Id</td>
                            <td>{id}</td>
                        </tr>
                        <tr>
                            <td>ClassRoom Name</td>
                            <td>{name}</td>
                        </tr>
                        {state?state.usertype=="Student"?
                        <tr>
                            <td>Instructor Name</td>
                            <td>{instructorName}</td>
                        </tr>
                        :null:null}
                        <tr>
                            <td>Subject</td>
                            <td>{subject}</td>
                        </tr>
                        <tr>
                            <td>Time of Class</td>
                            <td>{fromTime} to {toTime}</td>
                        </tr>
                        <tr>
                            <td>Days of Class</td>
                            <td>{daysOfClass?daysOfClass.map(items=>{return items+" ";}):null}</td>
                        </tr>
                        <tr>
                            <td>No. of Students</td>
                            <td>{noOfStudents}</td>
                        </tr>
                    </tbody>
                </table>
                {state?state.usertype!="Student"?
                <div className="row" style={{marginTop:"30px"}}>
                    <div className="col s4">
                        <button className="btn waves-effect waves-light" onClick={editClassClicked}>Edit Class
                            <i className="material-icons right">create</i>
                        </button>
                    </div>
                    <div className="col s4">
                        <button data-target="modal1" className="btn" onClick={()=>setShowStudents(true)}>Add Students<i className="material-icons right">add</i></button>
                    </div>
                    <div className="col s4 rightAlign">
                        <button className="btn waves-effect waves-light" onClick={deleteClick}>Delete
                            <i className="material-icons right">delete</i>
                        </button>
                    </div>
                </div>
                :"":""}
                {showStudents?<Students profileId={profileId}></Students>:null}
            </div>
        </div>
    )
}
export default Overview;