import React, { useContext, useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import ListItem from "@material-ui/core/ListItem";
import { Badge } from "@material-ui/core";
import DashboardOutlinedIcon from "@material-ui/icons/DashboardOutlined";
import WhatsAppIcon from "@material-ui/icons/WhatsApp";
import SyncAltIcon from "@material-ui/icons/SyncAlt";
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import PeopleAltOutlinedIcon from "@material-ui/icons/PeopleAltOutlined";
import ContactPhoneOutlinedIcon from "@material-ui/icons/ContactPhoneOutlined";
import AccountTreeOutlinedIcon from "@material-ui/icons/AccountTreeOutlined";
import QuestionAnswerOutlinedIcon from "@material-ui/icons/QuestionAnswerOutlined";
import BarCharIcon from "@material-ui/icons//BarChart"
import { i18n } from "../translate/i18n";
import { WhatsAppsContext } from "../context/WhatsApp/WhatsAppsContext";
import { AuthContext } from "../context/Auth/AuthContext";
import { Can } from "../components/Can";
import api from "../services/api";

function ListItemLink(props) {
  const { icon, primary, to, className } = props;

  const renderLink = React.useMemo(
    () =>
      React.forwardRef((itemProps, ref) => (
        <RouterLink to={to} ref={ref} {...itemProps} />
      )),
    [to]
  );

  return (
   
      <ListItem button component={renderLink} className={className}>
        {icon ? <label>{icon}</label> : null}
        {primary}
      </ListItem>
   
  );
}

const MainListItems = (props) => {
  const { drawerClose } = props;
  const { whatsApps } = useContext(WhatsAppsContext);
  const { user } = useContext(AuthContext);
  const [connectionWarning, setConnectionWarning] = useState(false);
  const [chat, setchat] = useState([]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (whatsApps.length > 0) {
        const offlineWhats = whatsApps.filter((whats) => {
          return (
            whats.status === "qrcode" ||
            whats.status === "PAIRING" ||
            whats.status === "DISCONNECTED" ||
            whats.status === "TIMEOUT" ||
            whats.status === "OPENING"
          );
        });
        if (offlineWhats.length > 0) {
          setConnectionWarning(true);
        } else {
          setConnectionWarning(false);
        }
      }
    }, 2000);
    return () => clearTimeout(delayDebounceFn);
  }, [whatsApps]);

  let controller;

  setInterval(() => {
    if (controller) controller.abort();
    controller = new AbortController();
  
    const fetchUnreadMsg = async () => {
      try {
        const loadContact = await api.get("/ChatInternal-unviewd", {
          params: { receiving_user: user.id, type: 2 },
          signal: controller.signal,
        });
        setchat(loadContact.data.data.length);
        console.log(loadContact.data.data.length);
      } catch (error) {
        if (error.name !== 'AbortError') console.error("Request failed:", error);
      }
    };
    
    fetchUnreadMsg();
  }, 60000);

  if(user.profile === "custom"){
    console.log(user);
    const itens = user.access.split(',')
    return (
      <>
        <ListItemLink
          to="/"
          primary="WhatsFacil"
          icon={<DashboardOutlinedIcon />}
        />
      {itens.map((item, index) =>{
        if(item == 1){
          return (
            <ListItemLink
              to="/tickets"
              primary={i18n.t("mainDrawer.listItems.tickets")}
              icon={<WhatsAppIcon />}
            />
          )
        } 
        if(item == 2){
          return (
            <ListItemLink
            to="/internalchat"
            primary="Chat Interno"
            icon={
              <Badge badgeContent={chat > 0 ? "!" : 0} color="error">
              < ChatBubbleOutlineIcon/>
            </Badge>
            }
            
          />
          )
        } 
        if(item == 3){
          return (
              <ListItemLink
              to="/contacts"
              primary={i18n.t("mainDrawer.listItems.contacts")}
              icon={<ContactPhoneOutlinedIcon />}
          />
          )
        } 
        if(item == 4){
          return (
            <ListItemLink
            to="/quickAnswers"
            primary={i18n.t("mainDrawer.listItems.quickAnswers")}
            icon={<QuestionAnswerOutlinedIcon />}
          />
          )
        } 
        if(item == 5){
          return (
            <ListItemLink
            to="/queues"
            primary={i18n.t("mainDrawer.listItems.queues")}
            icon={<AccountTreeOutlinedIcon />}
          />
          )
        } 
        if(item == 6){
          return (
            <ListItemLink
            to="/connections"
            primary={i18n.t("mainDrawer.listItems.connections")}
            icon={
              <Badge badgeContent={connectionWarning ? "!" : 0} color="error">
                <SyncAltIcon />
              </Badge>
            }
          />
          )
        } 
        if(item == 10){
          return (
            <ListItemLink
                to="/users"
                primary={i18n.t("mainDrawer.listItems.users")}
                icon={<PeopleAltOutlinedIcon />}
              />
          )
        } 

        
      }
      )}






      </>
    )
    
      
    
  }else{
    return (
      <>
        <ListItemLink
            to="/"
            primary="WhatsFacil"
            icon={<DashboardOutlinedIcon />}
          />
          
          <ListItemLink
            to="/tickets"
            primary={i18n.t("mainDrawer.listItems.tickets")}
            icon={<WhatsAppIcon />}
          />
  
          <ListItemLink
            to="/internalchat"
            primary="Chat Interno"
            icon={
              <Badge badgeContent={chat > 0 ? "!" : 0} color="error">
                < ChatBubbleOutlineIcon/>
              </Badge>
            }
          />
  
          <ListItemLink
            to="/contacts"
            primary={i18n.t("mainDrawer.listItems.contacts")}
            icon={<ContactPhoneOutlinedIcon />}
          />
          <ListItemLink
            to="/quickAnswers"
            primary={i18n.t("mainDrawer.listItems.quickAnswers")}
            icon={<QuestionAnswerOutlinedIcon />}
          />
        
        <Can
          role={user.profile}
          perform="drawer-admin-items:view"
          yes={() => (
            <>
              <ListItemLink
                to="/users"
                primary={i18n.t("mainDrawer.listItems.users")}
                icon={<PeopleAltOutlinedIcon />}
              />
              <ListItemLink
                to="/queues"
                primary={i18n.t("mainDrawer.listItems.queues")}
                icon={<AccountTreeOutlinedIcon />}
              />
              <ListItemLink
                to="/connections"
                primary={i18n.t("mainDrawer.listItems.connections")}
                icon={
                  <Badge badgeContent={connectionWarning ? "!" : 0} color="error">
                    <SyncAltIcon />
                  </Badge>
                  }
                />
                <ListItemLink
                to="/infoAdmin"
                primary="Informações"
                icon={<BarCharIcon />}
              />
             
            </>
          )}
        />
     </>
    );
  }

  
};

export default MainListItems;
