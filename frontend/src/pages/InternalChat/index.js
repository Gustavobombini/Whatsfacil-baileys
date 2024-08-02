import React, { useRef, useState, useEffect, useContext }  from 'react';
import { useHistory, useParams } from "react-router-dom";
import api from "../../services/api";
import { AuthContext } from "../../context/Auth/AuthContext";
import openSocket from "../../services/socket-io";
import { toast } from 'react-toastify';

const InternalChat = () => {

  const [contact , setContacts] = useState([])
  const [loadUpload , setloadUpload] = useState(false)
  const { user } = useContext(AuthContext);
  const [selectedContact, setSelectedContact] = useState(null);
  const [msg, setMsg] = useState([]);
  const inputMsg = useRef(null);
  const divMsgEndRef = useRef(null);
  const socket = openSocket();
  const history = useHistory();

  socket.on("connect", () => {
    console.log("Conectado ao servidor Socket.IO");
  });


  useEffect(() => {
    // Rolagem automática para o final da lista de mensagens
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
          loadMsg.data.data.map( item => {
            console.log(item);
            setMsg((msgList) => [...msgList, item])
          })
        }

        console.log(loadMsg);

      }catch{
        console.log('Erro ao carregar mensagens');
      }

    }


    fetchMsg()
  }, [selectedContact]);


  useEffect(() => {
    const handleReceiveMessage = (data) => {
      if(data.receiving_user === user.id && data.sent_user === selectedContact.id){
        setMsg((msgList) => [...msgList, data])
      }
     console.log(data);
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

      const newMsg = {
        message : `${process.env.REACT_APP_BACKEND_URL}/public/${name}`,
        sent_user : user.id,
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
      
    const formData = new FormData();
    formData.append('file', file);
    formData.append("body", file.name);
    try{
      
      const response =  await api.post('/ChatInternal-file', formData);
      console.log(response.data.file[0]);
      msg(response.data.file[0].filename,response.data.file[0].originalname )
      
      setloadUpload(false)

    }catch{
      console.log("não foi possivel enviar o arquivo");
    }
  }

  const SendMsg = async (event) => {
    event.preventDefault(); 

    history.push(`/internalchat/${selectedContact.id}`);

    const data = new Date(Date.now()).toLocaleString().split(',');
    const dataH= data[1].split(":");
    const dataD= data[0].split("/");
    const dataMsg = `${dataH[0]}:${dataH[1]} ${dataD[0]}/${dataD[1]}`

    if(inputMsg.current.value){

      const newMsg = {
        message : inputMsg.current.value,
        sent_user : user.id,
        receiving_user : selectedContact.id,
        data : dataMsg,
        type_message : 'text',
        viewed :0,
        sent_name: user.name
      }

      setMsg((msgList) => [...msgList, newMsg])
      socket.emit('chat', newMsg);

      await api.post("/ChatInternal", newMsg);

      inputMsg.current.value = "";
    }
  }

  useEffect(() => {
    const fetchUsers = async () => {
        try {
          const { data } = await api.get("/users/");
          setContacts(data.users)
        } catch (err) {
          console.log(err);
        }
      };
      fetchUsers(); 
  }, []);

  console.log(contact);

  return (
    <div className="container mt-4" style={{height: '85vh'}}>
      <div className="card h-100">
        <div className="card-body">
          <div className='row h-100' >
            <div className='col-2 border-end'>
                <div className='d-flex justify-content-around w-100 mb-5 border-bottom'>
                  <h3>Contatos</h3>
                </div>
                <div className='justify-content-around d-grid w-100' style={{maxHeight: '66vh', overflowY: 'scroll'
                }}>
                  {contact.map((contacts) => {
                    if(contacts.id !== user.id)
                      return <button type="button" className={`btn mt-2 ${selectedContact && selectedContact.id === contacts.id   ? 'btn-danger' : 'btn-success'}`} onClick={() => setSelectedContact(contacts)}>{contacts.name}</button>
                   
                  })}
                </div>
            </div>
            <div className='col-10'>
                  {selectedContact ? (
                    <div className='container d-flex flex-column' style={{ height: '81vh' }}>
                      <div className='row'>
                        <h3 className='border-bottom d-flex justify-content-center m-2'>
                          {selectedContact.name}
                        </h3>
                      </div>

                      <div  className='row flex-grow-1' style={{ overflowY: 'auto', maxHeight: '68vh' }}>
                        <div className='d-flex flex-column w-100'>
                            {msg.map((item, index) =>(
                              item.receiving_user === user.id ?
                                  <div className='msg-left mb-2 text-left'>
                                    <div className='alert alert-primary w-' role='alert' style={{width: 'max-content' , maxWidth: '-moz-available'}}>
                                    {item.type_message === 'file' ? (
                                        <div>
                                          <div className='row'>
                                            <a target="_blank" href={item.message} ><button className='btn btn-info' style={{width: '-moz-available'}}>Ver Anexo</button></a>
                                          </div>
                                          <div className='row mt-2'>
                                           <label>{item.filename}</label>
                                          </div>
                                        </div>
                                      ):item.message }    
                                    </div>
                                  </div>
                                    : 
                                  <div className='justify-content-end d-flex mb-2 text-right ml-auto' >
                                    <div className='alert alert-secondary' role='alert' style={{width: 'max-content', maxWidth: '-moz-available'}}>
                                      {item.type_message === 'file' ? (
                                        <div>
                                          <div className='row'>
                                            <a target="_blank" href={item.message} ><button className='btn btn-info' style={{width: '-moz-available'}}>Ver Anexo</button></a>
                                          </div>
                                          <div className='row mt-2'>
                                           <label>{item.filename}</label>
                                          </div>
                                        </div>
                                      ):item.message }    
                                    </div>
                                  </div>
                            ))}
                            <div ref={divMsgEndRef} />
                        </div>
                      </div>

                          <div className='mt-auto'>
                              {!loadUpload ?
                              <form onSubmit={SendMsg}>
                              <div className='input-group'>
                                <input type='text' className='form-control' ref={inputMsg} />
                                <div className='input-group-append'>
                                  <button className='btn btn-outline-secondary' type='submit'>Enviar</button>
                                  <label className='btn btn-outline-secondary' htmlFor="upload-button">Anexo</label>
                                  <input
                                    type="file"
                                    id="upload-button"
                                    onChange={uploadFiles}
                                    style={{display: 'none'}}
                                  />
                                </div>
                              </div>
                            </form>
                            :   
                            <label>Carregando Arquivo...</label>
                          }
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