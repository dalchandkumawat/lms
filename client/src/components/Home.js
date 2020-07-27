import React,{useState, useEffect,useContext, Fragment} from 'react';
import {Link,useHistory} from 'react-router-dom';
import {UserContext} from '../App';
import M from 'materialize-css';
const Home = () => {
    const {state,dispatch}=useContext(UserContext);
    const [classes,setClasses]=useState([]);
    const [nameSorted,setNameSorted]=useState(false);
    const [subjectSorted,setSubjectSorted]=useState(false);
    const history=useHistory();
    useEffect(()=>{
        if(state!=null){
            fetch('/getclasses',{
                headers:{
                    "authorization":"Bearer "+localStorage.getItem("jwt")
                }
            }).then(res=>res.json())
            .then(result=>{
                if(result.error){
                    M.toast({html:result.error,classes:"#c62727 red darken-3"});
                }
                else{
                    setClasses(result.classes);
                }
            })
        }
    },[]);
    const classClicked=(toLink)=>{
        history.push(toLink)
    }
    const callSort=(sortBy)=>{
        if(sortBy=="name"){
            if(nameSorted){
                console.log(classes);
                setClasses(Array.from(classes.sort((a,b)=>a.name.toLowerCase().localeCompare(b.name.toLowerCase())).reverse()));
                setNameSorted(!nameSorted);
            }
            else{
                setClasses(Array.from(classes.sort((a,b)=>a.name.toLowerCase().localeCompare(b.name.toLowerCase()))));
                setNameSorted(!nameSorted);
            }
        }
        else{
            let tempClasses=Array.from(classes.sort((a,b)=>a.subject.toLowerCase().localeCompare(b.subject.toLowerCase())));
            if(subjectSorted){
                setClasses(tempClasses.reverse());
                setSubjectSorted(!subjectSorted);
            }
            else{
                setClasses(tempClasses);
                setSubjectSorted(!subjectSorted);
            }
        }
    }
    return (
        <div>
            <div className="row">
                <div className="col s12 text-center">
                    <h3 style={{ textAlign: "center" }}>Home</h3>
                </div>
            </div>
            {state?state.usertype!="Student"?
            <div className="row">
                <div className="col s10 rightAlign">
                    <Link to='/addclass'><button className="btn waves-effect waves-light float-right" name="action">Add Class
                        <i className="material-icons right">create</i>
                    </button></Link>
                </div>
            </div>
            :"":""}
            <div className="row">
                <div className="col m1"></div>
                <div className="col s12 m10">
                    <table className="highlight" style={{ cursor: "pointer" }}>
                        <thead>
                            <tr>
                                <th>Index</th>
                                <th onClick={()=>callSort("name")}>Name<span><i className="material-icons material-icons-edit right">arrow_drop_down</i></span></th>
                                {state?state.usertype=="Student"?
                                    <th>Instructor</th>
                                :null:null}
                                <th onClick={()=>callSort("subject")}>Subject<span><i className="material-icons material-icons-edit right">arrow_drop_down</i></span></th>
                                <th>Time</th>
                                <th>Days</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                classes.map((item,i)=>{
                                    if(item!=null){
                                        let toLink='/overview/'+item._id;
                                        return (
                                            <Fragment key={item._id}>
                                                <tr onClick={()=>classClicked(toLink)}>
                                                    <td>{i+1}</td>
                                                    <td>{item.name}</td>
                                                    {state?state.usertype=="Student"?
                                                        <td>{item.instructorname}</td>
                                                    :null:null}
                                                    <td>{item.subject}</td>
                                                    <td>{item.fromTime} to {item.toTime} </td>
                                                    <td>{item.daysOfClass.map(items=>{return items+" ";})}</td>
                                                </tr>
                                            </Fragment>                                   
                                        )
                                    }
                                })
                            }
                        </tbody>
                    </table>

                </div>
                <div className="col m1"></div>
            </div>
        </div>
    )
}
export default Home;
