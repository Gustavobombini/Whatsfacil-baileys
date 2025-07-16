import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles } from "@material-ui/core";

import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

import api from "../../services/api";

import { i18n } from "../../translate/i18n";
import ButtonWithSpinner from "../ButtonWithSpinner";
import { toast } from "react-toastify";



const AddUserModal = ({ modalOpen, onClose, ticketid, ticketWhatsappId }) => {
	
	const [loading, setLoading] = useState(false);
	const [users, setUsers] = useState([]);
	const [selectedUser, setSelectedUser] = useState(0);

	const handleClose = () => {
		onClose();
	};

	const handleSaveTicket = async e => {
		e.preventDefault();

		const value = {
			ticketid: ticketid,
			user: selectedUser
		}
		
		const result = await api.post("/tickets-addUser", value);
		alert(result.data);
		onClose();
	};

	const fetchUsers = async () => {
		try {
		  const { data } = await api.get("/users/");
		  setUsers(data.users)
		} catch (err) {
		  //console.log(err);
		}
	  };
	
	
	  useEffect(() => {
		  fetchUsers(); 
	  }, []);

	return (
		<Dialog open={modalOpen} onClose={handleClose} maxWidth="lg" scroll="paper">
			<form onSubmit={handleSaveTicket}>
				<DialogTitle id="form-dialog-title">
					Adicionar Usuario
				</DialogTitle>
				<DialogContent dividers>

				<InputLabel>Usuario</InputLabel>
					<Select
						value={selectedUser}
						onChange={(e) => setSelectedUser(e.target.value)}
						label={i18n.t("transferTicketModal.fieldConnectionPlaceholder")}
						style={{width: "100%"}}
					>
						<MenuItem value={0} >Selecione</MenuItem>
					{users.map((user) => (
						<MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>
					))}
					</Select>
					
				</DialogContent>
				<DialogActions>
					<Button
						onClick={handleClose}
						color="secondary"
						disabled={loading}
						variant="outlined"
					>
						{i18n.t("transferTicketModal.buttons.cancel")}
					</Button>
					<ButtonWithSpinner
						variant="contained"
						type="submit"
						color="primary"
						loading={loading}
					>
						Adicionar
					</ButtonWithSpinner>
				</DialogActions>
			</form>
		</Dialog>
	);
};

export default AddUserModal;