import React, { useState, useEffect } from "react";
import openSocket from "../../services/socket-io.js";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import { toast } from "react-toastify";

import Tooltip from "@material-ui/core/Tooltip";

import api from "../../services/api.js";
import { i18n } from "../../translate/i18n.js";
import toastError from "../../errors/toastError.js";

const useStyles = makeStyles(theme => ({
	root: {
		display: "flex",
		alignItems: "center",
		padding: theme.spacing(8, 8, 3),
	},

	paper: {
		padding: theme.spacing(2),
		display: "flex",
		alignItems: "center",
		marginBottom: 12,

	},

	settingOption: {
		marginLeft: "auto",
	},
	margin: {
		margin: theme.spacing(1),
	},

}));

const Settings = () => {
	const classes = useStyles();

	const [settings, setSettings] = useState([]);

	useEffect(() => {
		const fetchSession = async () => {
			try {
				const { data } = await api.get("/settings");
				setSettings(data);
			} catch (err) {
				toastError(err);
			}
		};
		fetchSession();
	}, []);

	useEffect(() => {
		const socket = openSocket();

		socket.on("settings", data => {
			if (data.action === "update") {
				setSettings(prevState => {
					const aux = [...prevState];
					const settingIndex = aux.findIndex(s => s.key === data.setting.key);
					aux[settingIndex].value = data.setting.value;
					return aux;
				});
			}
		});

		return () => {
			socket.disconnect();
		};
	}, []);

	const handleChangeSetting = async e => {
		const selectedValue = e.target.value;
		const settingKey = e.target.name;

		try {
			await api.put(`/settings/${settingKey}`, {
				value: selectedValue,
			});
			toast.success(i18n.t("settings.success"));
		} catch (err) {
			toastError(err);
		}
	};

	const getSettingValue = key => {
		const { value } = settings.find(s => s.key === key);
		return value;
	};

	return (
		<div className={classes.root}>
			<Container className={classes.container} >
				<Typography variant="body2" gutterBottom>
					{i18n.t("settings.title")}
				</Typography>
				<Paper className={classes.paper}>
					<Typography variant="body1">
						{i18n.t("settings.settings.userCreation.name")}
					</Typography>
					<Select
						margin="dense"
						variant="outlined"
						native
						id="userCreation-setting"
						name="userCreation"
						value={
							settings && settings.length > 0 && getSettingValue("userCreation")
						}
						className={classes.settingOption}
						onChange={handleChangeSetting}
					>
						<option value="enabled">
							{i18n.t("settings.settings.userCreation.options.enabled")}
						</option>
						<option value="disabled">
							{i18n.t("settings.settings.userCreation.options.disabled")}
						</option>
					</Select>
				</Paper>
							
				
				

				<Typography variant="body2" gutterBottom></Typography>
				<Paper className={classes.paper}>

					<Typography variant="body1">
						Ligação
					</Typography>
					<Select
						margin="dense"
						variant="outlined"
						native
						id="call-setting"
						name="call"
						value={
							settings && settings.length > 0 && getSettingValue("call")
						}
						className={classes.settingOption}
						onChange={handleChangeSetting}
					>
						<option value="enabled">
							Ativado
						</option>
						<option value="disabled">
							Desativado
						</option>
					</Select>
				</Paper>

				<Paper className={classes.paper}>
					<Typography variant="body1">
						Messagem de Grupo
					</Typography>
					<Select
						margin="dense"
						variant="outlined"
						native
						id="CheckMsgIsGroup-setting"
						name="CheckMsgIsGroup"
						value={
							settings && settings.length > 0 && getSettingValue("CheckMsgIsGroup")
						}
						className={classes.settingOption}
						onChange={handleChangeSetting}
					>
						<option value="enabled">
							Ativado
						</option>
						<option value="disabled">
							Desativado
						</option>
					</Select>
				</Paper>

				<Paper className={classes.paper}>
					<TextField
						id="api-token-setting"
						readonly
						label="Token Api"
						margin="dense"
						variant="outlined"
						fullWidth
						value={settings && settings.length > 0 && getSettingValue("userApiToken")}
					/>
				</Paper>

        {/* <Paper className={classes.paper}>
          <Typography variant="body1">
            Tipo do Chatbot
          </Typography>
          <Select
            margin="dense"
            variant="outlined"
            native
            id="chatBotType-setting"
            name="chatBotType"
            value={settings && settings.length > 0 && getSettingValue("chatBotType")}
            className={classes.settingOption}
            onChange={handleChangeSetting}
          >
            <option value="text">
              Texto
            </option>

             <option value="button">
              Botão
            </option>
			<option value="list">
              Lista
            </option> 
			<option value="typebot">
              Typebot
            </option>

          </Select>
        </Paper> */}

			</Container>
		</div>
	);
};

export default Settings;