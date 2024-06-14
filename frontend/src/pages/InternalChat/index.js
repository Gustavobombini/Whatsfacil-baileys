import React, { useRef, useState, useEffect, useContext }  from 'react';
import { useHistory, useParams } from "react-router-dom";
import { Input, colors, makeStyles } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import PersonIcon from '@material-ui/icons/Person';
import Button from "@material-ui/core/Button";
import api from "../../services/api";
import openSocket from "../../services/socket-io";
import { AuthContext } from "../../context/Auth/AuthContext";



const socket = openSocket();

socket.on("connect", () => {
  console.log("Conectado ao servidor Socket.IO");
});

const useStyles = makeStyles((theme) => ({
    chatPage: {
        display: 'flex',
        height: '90%',
      },
      contactList: {
        flex: '1',
        borderRight: `1px solid ${theme.palette.divider}`,
        padding: "30px",
        maxWidth: 250,
        minWidth: 200,
        overflowY: 'scroll',

      },
      chatWindow: {
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: "8px"
      },
      contactItem: {
        cursor: 'pointer',
        padding: theme.spacing(1),
        borderBottom: `1px solid ${theme.palette.divider}`,
        '&:hover': {
          backgroundColor: '#e1e1e1', // Cor de fundo ao passar o mouse
        },
      },
      chatHeader: {
        backgroundColor: '#075e54', // Cor de fundo do cabeçalho do chat
        color: '#fff', // Cor do texto do cabeçalho do chat
        padding: theme.spacing(2),
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },
      msgBody: {
        flex: '1',
        overflowY: 'auto', // Adicionar barra de rolagem quando necessário
        padding: theme.spacing(2),
        backgroundColor: '#e5ddd5', // Cor de fundo da área de mensagens
      },
      msgSend: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: theme.spacing(1),
        borderTop: `1px solid ${theme.palette.divider}`,
      },
      input: {
        flex: '1',
        border: 'none',
        outline: 'none',
        padding: theme.spacing(1),
        fontSize: '20px',
        backgroundColor: 'transparent',
        width: "90%",
        marginBottom: " 1%"
      },
      sendButton: {
        backgroundColor: '#e0e0e000', // Cor do botão de envio
        color: '#fff', // Cor do ícone de envio
        borderRadius: '50%',
        padding: theme.spacing(1),
        marginLeft: theme.spacing(1),
        cursor: 'pointer',

      },
      contactName: {
        height: "11%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "xx-large",
        backgroundColor: "#e5ddd5"
    
      },
      boxRight: {
        display: "flex", /* Para alinhar elementos internos */
        justifyContent: "right",
      },
      boxLeft: {
        display: "flex", /* Para alinhar elementos internos */
        justifyContent: "left",
      },
      selectedContact: {
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        height: "100vh"
      },
      msgsend: {
        backgroundColor: "#e5ddd5"
      },
      span: {
        backgroundColor: "white",
        maxWidth: "341px",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
        marginRight: "3%",
        borderRadius: "16px",
        padding: "7px",
        marginTop: "1%",
        overflowWrap: "break-word",
      },
      spanData: { 
        fontSize: "10px", // Defina o tamanho da fonte desejado.
        marginLeft: "auto", // Isso empurrará o conteúdo para a direita.
        display: "block", //
      },
      button: {
        backgroundColor: "#2E8B57",
        marginTop: "5%"
      },
      h2: {
        alignItems: "center",
        display: "flex",
        justifyContent: "center",
        fontFamily: "monospace",
      }
         
  }));

const InternalChat = () => {

    const classes = useStyles();
    const [selectedContact, setSelectedContact] = useState(null);
    const [contact , setContacts] = useState([])
    const { user } = useContext(AuthContext);

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

    return (
        <div className={classes.chatPage}>
            <div className={classes.contactList}>
                <h2 className={classes.h2}>Contatos</h2>
                {contact.map((contacts) => {
                  if(contacts.id !== user.id)
                      return <Button key={contacts.id} className={classes.button} onClick={() => setSelectedContact(contacts)}>
                        {contacts.name}<PersonIcon />
                    </Button>
                      
                })}
                
            </div>

        <div className={classes.chatWindow}>
          {selectedContact ? (
            <ChatWindow contact={selectedContact} />
          ) : (
            <div className={classes.selectedContact}>Selecione um contato para iniciar uma conversa.</div>
          )}
        </div>
      </div>
    )
}

function ChatWindow({ contact }) {

    const classes = useStyles();
    const [inputValue, setValue] = useState('');
    const [msg, setMsg] = useState([]);
    const messagesRef = useRef();
    const { user } = useContext(AuthContext);
    const history = useHistory();

    const SendMsg = async (event) => {
      event.preventDefault(); 
      if(!inputValue.trim()) return
      history.push(`/internalchat/${contact.id}`);
      const data = new Date(Date.now()).toLocaleString().split(',');
      const dataH= data[1].split(":");
      const dataD= data[0].split("/");
      const datamsg = `${dataH[0]}:${dataH[1]} ${dataD[0]}/${dataD[1]}`

      const creatMessege = {
        inputValue : inputValue,
        de : user.id,
        para : contact.id,
        deName: user.name,
        data : datamsg
      }
      const newMsg = [...msg , creatMessege]
      socket.emit("chat",creatMessege)
      await api.post("/ChatInternal", creatMessege);
      setMsg(newMsg)
      setValue("")    
    }
    
    useEffect(() => {
      const handleReceiveMessage = (data) => {
        if(data.para === user.id && data.de === contact.id ){
          const newMsg = {
            inputValue : data.inputValue,
            de : data.de,
            para : data.para,
            data : data.data
          }
          
          setMsg((msgList) => [...msgList, newMsg])

        }
      };
      socket.on("receive_msg", handleReceiveMessage);
      return () => {
        socket.off("receive_msg", handleReceiveMessage);
      };
    }, [socket]);

    useEffect(() => {
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
      }, [msg]);

      useEffect(() => {
        const fetchMsg = async () => {
          
          try {
            const loadMsg = await api.get("/ChatInternal", {
              params: { de: user.id, para: contact.id } 
            });

            if(loadMsg.data.data.length > 0){
            
                loadMsg.data.data.map(item => {
              
                  const newMsg = {
                    inputValue : item.inputValue,
                    de : item.de,
                    para : item.para,
                    data : item.data
                  }
                  
                  setMsg((msgList) => [...msgList, newMsg])

              })
            }
            
          } catch (error) {
            console.log('Erro ao carregar mensagens:', error);
          }
        }
        messagesRef.current.innerHTML = "";
        setTimeout(() => {
          fetchMsg();
        }, 500);
        
      }, [contact]);

    return (
        <> 
            <div className={classes.contactName}>{contact.name}</div>
            
            <div className={classes.msgBody} ref={messagesRef}> 
            {msg.map((item, index) =>  
                (item.para === user.id ?
                   <div key={index} className={classes.boxLeft}>     
                              <span key={index} className={classes.span}>
                                {item.inputValue} 
                                <span className={classes.spanData}>{item.data}</span>
                              </span>  
                            </div>
                  : <div key={index} className={classes.boxRight}>   
                             <span key={index} className={classes.span}>
                                {item.inputValue} 
                                <span className={classes.spanData}>{item.data}</span>
                              </span>   
                          </div>   
               ))}
            </div>

        <div className={classes.msgsend}  > 
            <form onSubmit={SendMsg}>
                <input 
                        className={classes.input} 
                        type="text"
                        value={inputValue}
                        onChange={e => setValue(e.target.value)}
                        placeholder="Digite algo"
                    />
                     <Button type='submit' variant="contained" endIcon={<SendIcon />}></Button>
            </form>
        </div>
        
        </>
       
    );
  }

export default InternalChat;