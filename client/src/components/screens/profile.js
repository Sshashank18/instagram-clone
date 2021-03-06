import React,{useEffect, useState, useContext} from 'react';
import {UserContext} from '../../App';

const Profile = () => {

    const [mypics, setPics] = useState([]);

    const [image,setImage] = useState("");
    
    const {state, dispatch} = useContext(UserContext); 

    useEffect(()=>{
        fetch('/myposts',{
            headers:{
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
        .then(result => {
            setPics(result.myposts);
        })

    },[]);

    useEffect(()=>{
        if(image){
            const data = new FormData();
            data.append('file',image);
            data.append('upload_preset','instaClone');
            data.append('cloud_name','deucalion');
    
            fetch("https://api.cloudinary.com/v1_1/deucalion/image/upload",{              
                method:"post",
                body:data
            })    
            .then(res => res.json())
            .then(data => {
                fetch("/updatePic",{
                    method:"put",
                    headers:{
                        "Authorization":"Bearer " + localStorage.getItem("jwt"),
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        pic: data.url
                    })
                }).then(res => res.json())
                .then(result => {
                    localStorage.setItem("user",JSON.stringify({...state,pic: result.pic}));
                    dispatch({type:"UPDATEPIC",payload:result.pic});
                });
            })
            .catch(err => {
                console.log(err); 
            });
        }
    },[image]);

    const updatePic = ((file)=>{

        setImage(file);

    });

    return(
        <div style={{maxWidth:"550px", margin:"0px auto"}}>
            <div style={{
                 margin:"18px 0px",
                 borderBottom:"1px solid grey"
            }}>
            <div style={{
                display:"flex",
                justifyContent:"space-around",
               
            }}>
                <div>
                    <img
                        alt="Loading..."
                        style={{width:"160px",height:"160px",borderRadius:"80px"}}
                        src={state? state.pic: "Loading.."}/>
                </div>
                <div>
                    <h5>{state ? state.name:"Loading"}</h5>
                    <div style={{display:"flex",justifyContent:"space-between",width:"108%"}}>
                        <h6>{mypics.length} posts</h6>
                        <h6>{state?state.followers.length:"0"} followers</h6>
                        <h6>{state?state.following.length:"0"} following</h6>
                    </div>
                </div>
            </div>
            <div className="file-field input-field" style={{margin:"10px"}}>
                    <div className="btn #64b5f6 blue darken-1">
                        <span>Update Pic</span>
                        <input type="file" onChange={(e)=>updatePic(e.target.files[0])}/>
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text"/>
                    </div>
                </div>
            </div>
            
            <div className="gallery">
                {
                    mypics.map(item => {
                        return(
                            <img key={item._id} alt={item.title} className="item" src={item.photo} />
                        )
                    })
                }

            </div>
        </div>
    );
}

export default Profile;