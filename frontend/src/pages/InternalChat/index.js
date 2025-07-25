import React, { useRef, useState, useEffect, useContext }  from 'react';
import { useHistory, useParams } from "react-router-dom";
import api from "../../services/api";
import { AuthContext } from "../../context/Auth/AuthContext";
import openSocket from "../../services/socket-io";

import { Badge, InputBase } from "@material-ui/core";

const InternalChat = () => {

  const [contact , setContacts] = useState([])
  const [loadUpload , setloadUpload] = useState(false)
  const { user } = useContext(AuthContext);
  const [selectedContact, setSelectedContact] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [msg, setMsg] = useState([]);
  const inputMsg = useRef(null);
  const divMsgEndRef = useRef(null);
  const socket = openSocket();
  const history = useHistory();
  const [groups, setGroup] = useState([]);

  socket.on("connect", () => {
    console.log("Conectado ao servidor Socket.IO");
  });

  useEffect(() => {
    if (divMsgEndRef.current) {
      divMsgEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [msg]);

  useEffect(() => {
    const fetchMsg = async () => {
      try {
        const loadMsg = await api.get("/ChatInternal", {
          params: { sent_user: user.id, receiving_user: selectedContact.id } 
        });

        setMsg([]);

        if(loadMsg.data.data.length > 0){
          setMsg(loadMsg.data.data)
        }

      }catch{
        console.log('Erro ao carregar mensagens');
      }
    }
    if(selectedContact){
      setSelectedGroup(null);
    }    
    fetchMsg()
    fetchUsers(); 
  }, [selectedContact]);


  useEffect(() => {
    const handleReceiveMessage = (data) => {
          const isForCurrentContact = data.receiving_user === user.id && data.sent_user === selectedContact?.id;
          const isForCurrentGroup = data.receiving_group && data.receiving_group === selectedGroup?.id;

          if (isForCurrentContact || isForCurrentGroup) {
            setMsg(prev => [...prev, data]);
          }
        };
      socket.on("receive_msg", handleReceiveMessage);
    return () => {
      socket.off("receive_msg", handleReceiveMessage);
    };
  }, [socket]);

  const uploadFiles = async (e) => {

    const files = e.target.files; 
    const file = files[0];
    setloadUpload(true)

    const msg = async (name, nameOriginal) =>{
      const data = new Date(Date.now()).toLocaleString().split(',');
      const dataH= data[1].split(":");
      const dataD= data[0].split("/");
      const dataMsg = `${dataH[0]}:${dataH[1]} ${dataD[0]}/${dataD[1]}`

      if(!selectedContact){
        const newGroupMsg = {
          message : `${process.env.REACT_APP_BACKEND_URL}/public/${name}`,
          sent_user : user.id,
          sent_name: user.name,
          receiving_group : selectedGroup.id,
          data : dataMsg,
          type_message : 'file',
          viewed : user.id,
          filename : nameOriginal,
          sent_name: user.name
        }

          setMsg((msgList) => [...msgList, newGroupMsg])
        socket.emit('chat', newGroupMsg);

        await api.post("/ChatInternal-group", newGroupMsg);
      }else{

        const newMsg = {
          message : `${process.env.REACT_APP_BACKEND_URL}/public/${name}`,
          sent_user : user.id,
          sent_name: user.name,
          receiving_user : selectedContact.id,
          data : dataMsg,
          type_message : 'file',
          viewed :0,
          filename : nameOriginal,
          sent_name: user.name
        }

        await api.post("/ChatInternal", newMsg);
  
        setMsg((msgList) => [...msgList, newMsg])
        socket.emit('chat', newMsg);
      }
  
    }
      
    const formData = new FormData();
    formData.append('file', file);
    formData.append("body", file.name);
    try{
      
      const response =  await api.post('/ChatInternal-file', formData);
      msg(response.data.file[0].filename,response.data.file[0].originalname )
      
      setloadUpload(false)

    }catch{
      console.log("não foi possivel enviar o arquivo");
    }
  }

  const SendMsg = async (event) => {

    history.push(`/internalchat/${selectedContact?.id ?? selectedGroup?.id}`);

    const data = new Date(Date.now()).toLocaleString().split(',');
    const dataH= data[1].split(":");
    const dataD= data[0].split("/");
    const dataMsg = `${dataH[0]}:${dataH[1]} ${dataD[0]}/${dataD[1]}`

    if(inputMsg.current.value){

      if(!selectedContact){
        const newGroupMsg = {
          message : inputMsg.current.value,
          sent_user : user.id,
          sent_name: user.name,
          receiving_group : selectedGroup.id,
          data : dataMsg,
          type_message : 'text',
          viewed :user.id,
          name: `Grupo: ${selectedGroup.name}`
        }

        setMsg((msgList) => [...msgList, newGroupMsg])
        socket.emit('chat', newGroupMsg);

        await api.post("/ChatInternal-group", newGroupMsg);
      }else{
        const newMsg = {
          message : inputMsg.current.value,
          sent_user : user.id,
          sent_name: user.name,
          receiving_user : selectedContact.id,
          data : dataMsg,
          type_message : 'text',
          viewed :0,
          name: user.name
        }
  
        setMsg((msgList) => [...msgList, newMsg])
        socket.emit('chat', newMsg);
  
        await api.post("/ChatInternal", newMsg);

      }


      inputMsg.current.value = "";
    }
  }

  const fetchUsers = async () => {
    try {
        const {data} = await api.get("/ChatInternal-unviewd", {
          params: { receiving_user: user.id, type: 1 } 
        });

        setContacts(data.data);
        setGroup(data.groups);
    } catch (err) {
      console.log(err);
    }
  };


  useEffect(() => {
      fetchUsers(); 
  }, []);



  useEffect(() => {

        const fetchMsgGroup = async () => {
      try {
        const loadMsg = await api.get("/ChatInternal-group", {
          params: { receiving_group: selectedGroup.id, sent_user: user.id } 
        });

        setMsg([]);       

        if(loadMsg.data.data.length > 0){
          setMsg(loadMsg.data.data)
        }

      }catch{
        console.log('Erro ao carregar mensagens');
      }
    }
    if(selectedGroup){
      setSelectedContact(null);
    }    

    fetchMsgGroup()
  }, [selectedGroup]);


  return (
    <div className="container mt-4" style={{height: '85vh'}}>
      <div className="card h-100">
        <div className="card-body">
          <div className='row h-100' >
            <div className='col-2 border-end'>
              <div className="row d-grid">
                <div className='d-flex justify-content-around w-100 mb-5 border-bottom'>
                  <h3>Contatos</h3>
                </div>
                <div className='justify-content-around d-grid w-100' style={{maxHeight: '40vh', overflowY: 'scroll'
                }}>
                  {contact.map((contacts) => {
                    if(contacts.id !== user.id)
                      return( 
                        <button 
                          type="button" 
                          className={`btn mt-2 ${selectedContact && selectedContact.id === contacts.id ? 'btn-danger' : 'btn-success'}`} 
                          onClick={() => setSelectedContact(contacts)}
                        >
                          <Badge badgeContent={contacts.viewed > 0 ? "!" : 0} color="error">
                            {contacts.name}
                          </Badge>
                        </button>)
                    }
                  )}
                </div>
              </div>
              <div className="row">
                <div className='d-flex justify-content-around w-100 mt-5 border-bottom'>
                  <h3>Grupos</h3>
                </div>
                 <div className='justify-content-around d-grid w-100 mt-2' style={{maxHeight: '40vh', overflowY: 'scroll'}}> 
                  {groups.map((g) => {
                    return (
                      <button 
                       type="button" 
                          className={`btn mt-2 ${selectedGroup && selectedGroup.id === g.id ? 'btn-danger' : 'btn-success'}`} 
                          onClick={() => setSelectedGroup(g)}
                      >
                        <Badge color="error" badgeContent={g.hasUnreadMessages > 0 ? "!" : 0}>
                          {g.name}
                        </Badge>
                      </button>
                    );
                  })}
                 </div>
              </div>                
            </div>
            <div className='col-10'>
                  {selectedContact || selectedGroup ?  (
                    <div className='container d-flex flex-column' style={{ height: '81vh' }}>
                      <div className='row'>
                        <h3 className='border-bottom d-flex justify-content-center m-2'>
                          {selectedContact?.name ? selectedContact.name : selectedGroup?.name}
                        </h3>
                      </div>
                      <div  className='row flex-grow-1' style={{ overflowY: 'auto', maxHeight: '68vh' }}>
                        <div className='d-flex flex-column w-100'>
                            {msg.map((item, index) =>(
                              (item?.receiving_user === user.id || item.sent_user != user.id) ?
                                  <div className='msg-left mb-2 text-left'>
                                    
                                    <div className='alert alert-primary w-' 
                                    role='alert'  style={{
                                        maxWidth: '80%',
                                        width: 'fit-content',
                                        wordBreak: 'break-word',
                                        whiteSpace: 'pre-wrap',
                                        padding: '0.5rem 1rem',
                                      }}>
                                      <p className='fw-bold'>{item.sent_name}:</p>
                                    {item.type_message === 'file' ? (
                                        <div>
                                          <div className='row'>
                                            <a target="_blank" href={item.message} ><button className='btn btn-info' style={{width: '-moz-available'}}>Ver Anexo</button></a>
                                          </div>
                                          <div className='row mt-2'>
                                           <label>{item.filename}</label>
                                          </div>
                                        </div>
                                      ):<pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: '0.9rem' }}>{item.message}</pre>  }
                                      <label style={{fontSize: '0.6rem', marginLeft: '0.5rem', marginTop: '0.2rem' }}>{item.data}</label>
                                    </div>
                                  </div>
                                    : 
                                  <div className='justify-content-end d-flex mb-2 text-right ml-auto' >
                                    <div className='alert alert-secondary' role='alert' style={{
                                        maxWidth: '80%',
                                        width: 'fit-content',
                                        wordBreak: 'break-word',
                                        whiteSpace: 'pre-wrap',
                                        padding: '0.5rem 1rem',
                                      }}>
                                      {item.type_message === 'file' ? (
                                        <div>
                                          <div className='row'>
                                            <a target="_blank" href={item.message} ><button className='btn btn-info' style={{width: '-moz-available'}}>Ver Anexo</button></a>
                                          </div>
                                          <div className='row mt-2'>
                                           <label>{item.filename}</label>
                                          </div>
                                        </div>
                                      ):<pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' , fontSize: '0.9rem' }}>{item.message}</pre>  }
                                    <label style={{fontSize: '0.7rem', marginLeft: '0.5rem', marginTop: '0.2rem'}}>{item.data}</label>
                                    </div>
                                  </div>
                            ))}
                            <div ref={divMsgEndRef} />
                        </div>
                      </div>
                        <div className='mt-auto'>
                          {!loadUpload ? (
                            <form onSubmit={SendMsg}>
                              <div className='input-group align-items-end'>
                                <textarea
                                  className='form-control'
                                  ref={inputMsg}
                                  rows={3}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                      e.preventDefault(); // Impede nova linha
                                      SendMsg(); // Chama função de envio
                                    }
                                  }}
                                />
                                <div className='input-group-append d-flex flex-column justify-content-end ms-2'>
                                  <button className='btn btn-outline-secondary mb-1' type='submit'>Enviar</button>
                                  <label className='btn btn-outline-secondary mb-0' htmlFor="upload-button">Anexo</label>
                                  <input
                                    type="file"
                                    id="upload-button"
                                    onChange={uploadFiles}
                                    style={{ display: 'none' }}
                                  />
                                </div>
                              </div>
                            </form>
                          ) : (
                            <label>Carregando Arquivo...</label>
                          )}
                        </div>
                   </div>
                ) :(
                  <div className='d-flex justify-content-center'>
                    Selecione um contato para iniciar uma conversa.
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
  </div>
  )
}



export default InternalChat;