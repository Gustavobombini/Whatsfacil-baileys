import React, { useRef, useState, useEffect, useContext }  from 'react';
import api from "../../services/api";

import Paper from "@material-ui/core/Paper"
import Container from "@material-ui/core/Container"
import Grid from "@material-ui/core/Grid"
import { makeStyles } from "@material-ui/core/styles"
import TextField from '@material-ui/core/TextField';
import Typography from "@material-ui/core/Typography";


const useStyles = makeStyles(theme => ({
	container: {
		paddingTop: theme.spacing(4),
		paddingBottom: theme.spacing(4),
	},
	fixedHeightPaper: {
		padding: theme.spacing(2),
		display: "flex",
		overflow: "auto",
		flexDirection: "column",
		height: 240,
	},
	customFixedHeightPaper: {
		padding: theme.spacing(2),
		display: "flex",
		overflow: "auto",
	},
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  PaperBox: {
    padding: theme.spacing(2),
		display: "flex",
		overflow: "auto",
		height: "100%",
    alignItems: "center",
    width: "fit-content",
  },
  PaperWhatsapp: {
    width: "fit-content",
    padding: theme.spacing(2),
    marginTop: "7%",
    maxWidth: "462px",
  },
  Typography: {
    padding: theme.spacing(1),
    display: "flex",
    alignItems: "center",
  }
}))



const InfoAdmin = () => {
  const classes = useStyles()

  const [dados, setDados] = useState([])
  const [queue, setQueue] = useState()
  const [nullqueue, setQueuenull] = useState()
  const [whats, setWhats] = useState()
  const [users, setusers] = useState()
  const [data1, setData1] = useState()
  const [data2, setData2] = useState()

  useEffect(() => {
    const fetchConversas = async () => {
      if(data1 && data2){
        const { data } = await api.get("/info", {
          params: { data1: data1, data2: data2 } 
        });
        //console.log(data);
        setDados(data.data)

        const prevqueue = []
        const prevnullqueue = []

        data.data.map((value)=> {
          if(value.queue){
            prevqueue.push(`${value.queue.name}`)
          }else{
            prevnullqueue.push(`ticket sem fila`)
          }
        })
        const contagem = {};
        
        const viewQueue = []
        prevqueue.forEach(item => {
          contagem[item] = (contagem[item] || 0) + 1;
        });
        for (const item in contagem) {
          viewQueue.push({name: item , value: contagem[item]})
        }  
        setQueue(viewQueue);
        setQueuenull(prevnullqueue);

        const prevuser = []

        data.data.map((value)=> {
          if(value.user){
            prevuser.push(`${value.user.name}`)
          }
        })

        const contagemuser = {};
        const viewuser = []
        prevuser.forEach(item => {
          contagemuser[item] = (contagemuser[item] || 0) + 1;
        });
        for (const item in contagemuser) {
          viewuser.push({name: item , value: contagemuser[item]})
        }  
        setusers(viewuser);

        
        const prevwhats = []

        data.data.map((value)=> {
          if(value.whatsapp){
            prevwhats.push(`${value.whatsapp.name}`)
          }
        })
        const contagemwhats = {};
        const viewwhats = []
        prevwhats.forEach(item => {
          contagemwhats[item] = (contagemwhats[item] || 0) + 1;
        });
        for (const item in contagemwhats) {
          viewwhats.push({name: item , value: contagemwhats[item]})
        }  
        setWhats(viewwhats);
        
      }
    };
    fetchConversas(); 

    
  }, [data1, data2]);




    return (
      <Container maxWidth="lg" className={classes.container}>
        <Typography component="h3" variant="h6" color="primary" paragraph className={classes.Typography}>
          Selecione as datas.
        </Typography>
      <Grid container spacing={3}>
        <Grid item  xs={5}>
          <Paper className={classes.customFixedHeightPaper} style={{ overflow: "hidden" }}>
              <Grid item>
                <TextField
                  id="date"
                  label="Data 1"
                  type="date"
                  className={classes.textField}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={(e) => {
                    setData1(e.target.value);
                  }}

                />
              </Grid>
              <Grid item>
                <TextField
                  id="date"
                  label="Data 2"
                  type="date"
                  className={classes.textField}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={(e) => {
                    setData2(e.target.value);
                    //console.log(e.target.value)
                  }}
                />
              </Grid>
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper className={classes.PaperBox} style={{width: "100%"}}>
          Total de conversas: {dados.length}
          </Paper>
        </Grid>
        
        
      </Grid>

        <Typography component="h3" variant="h6" color="primary" paragraph className={classes.Typography}>
          Whatsapp
        </Typography>
      <Grid container spacing={3} >
      
      {whats? whats.map((value) =>
            <Grid item >
            <Paper className={classes.PaperBox} >
              {value.name} : {value.value}
            </Paper>
          </Grid>
          ) : <Grid item >
          <Paper className={classes.PaperBox} >
            -
          </Paper>
        </Grid>}
      </Grid>

      <Typography component="h3" variant="h6" color="primary" paragraph className={classes.Typography}>
          Usuarios
        </Typography>
      <Grid container spacing={4} >
      {users? users.map((value) =>
            <Grid item >
            <Paper className={classes.PaperBox} >
              {value.name} : {value.value}
            </Paper>
          </Grid>
          ) :  <Grid item >
          <Paper className={classes.PaperBox} >
            -
          </Paper>
        </Grid>}
      </Grid>
      
       
      <Typography component="h3" variant="h6" color="primary" paragraph className={classes.Typography}>
          Filas
        </Typography>
      <Grid container spacing={4} >
          {
            queue? queue.map((value) =>
            <Grid item >
              <Paper className={classes.PaperBox} >
                {value.name} : {value.value}
              </Paper>
            </Grid>
          ) :
            <Grid item >
              <Paper className={classes.PaperBox} >
                -
              </Paper>
            </Grid>
          }
          {nullqueue? (
            <Grid item >
              <Paper className={classes.PaperBox} >
                Sem fila: {nullqueue.length}
              </Paper>
            </Grid>
          ) :
            <Grid item >
              <Paper className={classes.PaperBox} >
                -
              </Paper>
            </Grid>
          }
          

      
      </Grid>


    
    </Container>
    )
}



export default InfoAdmin;