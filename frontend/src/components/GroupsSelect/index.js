import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Chip from "@material-ui/core/Chip";
import toastError from "../../errors/toastError";
import api from "../../services/api";
import { i18n } from "../../translate/i18n";

const useStyles = makeStyles(theme => ({
	chips: {
		display: "flex",
		flexWrap: "wrap",
	},
	chip: {
		margin: 2,
	},
}));

const GroupsSelect = ({ selectedGroupIds, onChange }) => {
	const classes = useStyles();
	const [groups, setGroups] = useState([]);

	useEffect(() => {
		(async () => {
			try {
				const { data } = await api.get("/users-groups");
				setGroups(data);
			} catch (err) {
				toastError(err);
			}
		})();
	}, []);

	const handleChange = e => {
		onChange(e.target.value);
	};

	return (
		<div style={{ marginTop: 6 }}>
			<FormControl fullWidth margin="dense" variant="outlined">
				<InputLabel>Grupos</InputLabel>
				<Select
					multiple
					labelWidth={60}
					value={selectedGroupIds}
					onChange={handleChange}
					MenuProps={{
						anchorOrigin: {
							vertical: "bottom",
							horizontal: "left",
						},
						transformOrigin: {
							vertical: "top",
							horizontal: "left",
						},
						getContentAnchorEl: null,
					}}
					renderValue={selected => (
						<div className={classes.chips}>
							{selected?.length > 0 &&
								selected.map(id => {
									const group = groups.find(q => q.id === id);
									return group ? (
										<Chip
											key={id}
											variant="outlined"
											label={group.name}
											className={classes.chip}
										/>
									) : null;
								})}
						</div>
					)}
				>
					{groups.map(group => (
						<MenuItem key={group.id} value={group.id}>
							{group.name}
						</MenuItem>
					))}
				</Select>
			</FormControl>
		</div>
	);
};

export default GroupsSelect;
