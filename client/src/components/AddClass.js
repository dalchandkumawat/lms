import React,{useState,useContext, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import {UserContext} from '../App';
import M from 'materialize-css';
const AddClass=()=>{
    const history=useHistory();
    const [id,setId]=useState("");
    const [name,setName]=useState("");
    const [subject,setSubject]=useState("");
    const [fromTime,setFromTime]=useState("");
    const [toTime,setToTime]=useState("");
    const [daysOfClass,setDaysOfClass]=useState([]);
    const [daysChange,setDaysChange]=useState("");
    const isEdit=history.location.pathname.indexOf('edit')!=-1;
    const [classActive,setClassActive]=useState("");
    const addClick=()=>{   
        const path=isEdit?"/editclass":"/addclass";  
        fetch(path,{
            method:"post",
            headers:{
                "authorization":"Bearer "+localStorage.getItem("jwt"),
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                id,name,subject,fromTime,toTime,daysOfClass
            })
        }).then(res=>res.json())
        .then(result=>{
            if(result.error)
                M.toast({html:result.error,classes:"#c62727 red darken-3"});
            else{
                M.toast({html:isEdit?"Class Edited":"Class added",classes:"#43a047 green darken-1"});
                history.push('/');
            }
        })
    }
    useEffect(()=>{
        setDaysOfClass(daysChange.split(",").map(item => item.trim()));
    },[daysChange])
    const handleDaysChange=(e)=>{
        setDaysChange(e.target.value);       
    }
    useEffect(()=>{
        if(isEdit){
            const classId=history.location.pathname.substring(history.location.pathname.indexOf('edit')+5);
            fetch('/getclass/'+classId,{
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
                    setDaysChange(result.daysOfClass.map(item=>item+" ")+"");
                    setClassActive("active");
                }
            })
        }
    },[])
    return(
        <div className="wrapper">
            <div className="content">
            <form className="col s12">
                        <div className="row">
                            <div className="col s12 text-center">
                                <h3 style={{ textAlign: "center" }}>{isEdit?"Edit class":"Add Class"}</h3>
                            </div>
                        </div>
                        <div className="row">
                            <div className="input-field col s6">
                                <input id="id" type="text" value={id} className="validate" onChange={(e) => setId(e.target.value)} disabled={isEdit}></input>
                                <label className={classActive} htmlFor="id">Id</label>
                            </div>
                            <div className="input-field col s6">
                                <input id="name" type="text" value={name} className="validate" onChange={(e) => setName(e.target.value)}></input>
                                <label className={classActive} htmlFor="name">Name</label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="input-field col s6">
                                <input id="subject" type="text" value={subject} className="validate" onChange={(e) => setSubject(e.target.value)}></input>
                                <label className={classActive} htmlFor="subject">Subject</label>
                            </div>
                            <div className="input-field col s6">
                                <input id="fromTime" type="text" value={fromTime} onChange={(e) => setFromTime(e.target.value)}></input>
                                <label className={classActive} htmlFor="fromTime">From Time</label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="input-field col s6">
                                <input id="toTime" type="text" value={toTime} onChange={(e) => setToTime(e.target.value)}></input>
                                <label className={classActive} htmlFor="toTime">To Time</label>
                            </div>
                            <div className="input-field col s6">
                                <input id="daysChange" type="text" value={daysChange} onChange={handleDaysChange}></input>
                                <label className={classActive} htmlFor="daysChange">Days of Class</label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="input-field col s12 rightAlign">
                                <button className="btn waves-effect waves-light" type="button" onClick={addClick}>{isEdit?"Edit":"Add Class"}
                                    <i className="material-icons right">create</i>
                                </button>
                            </div>
                        </div>
                    </form>
            </div>
        </div>
    )
}
export default AddClass;