import React,{useEffect,useState} from 'react';
import {useHistory} from 'react-router-dom';
import M from 'materialize-css';
const Students = (props) => {
    const [students,setStudents]=useState([]);
    const history=useHistory();
    useEffect(()=>{
        fetch('/getStudents',{
            method:"get",
            headers:{
                "authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{            
            if(result.error){
                M.toast({html:result.error,classes:"#c62727 red darken-3"});
            }
            else{
                if(result){
                    setStudents(result.students);
                }
            }
        })
    },[])
    const addClick = () => {
        var items = document.getElementsByName('students');
        var selectedItems = "";
        for (var i = 0; i < items.length; i++) {
            if (items[i].type == 'checkbox' && items[i].checked == true)
                selectedItems += items[i].value + "\n";
        }
        alert(selectedItems);
    }
    return (
        <div>
            {students.map(item=>{   
                return (             
                    <div key={item._id}>
                        <label>
                            <input type="checkbox" className="filled-in" name="students" value={item._id}/>
                            <span>{item.name}</span>
                        </label>
                    </div>
                )
            })
            }
            
            <button className="btn waves-effect waves-light" onClick={()=>{
                const items = document.getElementsByName('students');
                let studentsArray = [];
                for (var i = 0; i < items.length; i++) {
                    if (items[i].type == 'checkbox' && items[i].checked == true)
                        studentsArray.push(items[i].value);
                }
                fetch('/addstudents',{
                    method:"post",
                    headers:{
                        "authorization":"Bearer "+localStorage.getItem("jwt"),
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify({
                        studentsArray,
                        profileId:props.profileId
                    })
                }).then(res=>res.json())
                .then(result=>{
                    if(result.error){
                        M.toast({html:result.error,classes:"#c62727 red darken-3"});
                    }
                    else{
                        M.toast({html:"Added students to class",classes:"#43a047 green darken-1"})
                        history.push('/')
                    }
                })
            }}>Add Students
                <i className="material-icons right">add</i>
            </button>
        </div>
    )
}
export default Students;