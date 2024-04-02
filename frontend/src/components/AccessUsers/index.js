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


const AccessUsers = ({ selectedAccess, onChange }) => {
    const [valoresSelecionados, setValoresSelecionados] = useState([]);
    
    useEffect(() => {
        // Função executada na montagem do componente (equivalente a componentDidMount em componentes de classe)
        const select = selectedAccess.split(',').map(Number);
        setValoresSelecionados(select);
      }, [selectedAccess]);
	

    const handleChange = e => {
        setValoresSelecionados(e.target.value);
        const String = e.target.value.map(numero => `${numero}`).join(",");
        console.log(String)
        onChange(String);
	};

	return (
		<div style={{ marginTop: 6 }}>
			<FormControl fullWidth margin="dense" variant="outlined">
				<InputLabel>Acesso de Usuarios</InputLabel>
				<Select
					multiple
					labelWidth={60}
					value={valoresSelecionados}
					onChange={handleChange}
				>
					        <MenuItem value={1}>Conversas</MenuItem>
                            <MenuItem value={2}>Chat Interno</MenuItem>
                            <MenuItem value={3}>Contatos</MenuItem>
                            <MenuItem value={4}>Respostas Rapidas</MenuItem>
                            <MenuItem value={5}>Filas</MenuItem>
                            <MenuItem value={6}>Numeros</MenuItem>
                            <MenuItem value={7}>Em Andamento</MenuItem>
                            <MenuItem value={8}>Finalizados</MenuItem>
                            <MenuItem value={9}>Buscar</MenuItem>
                            <MenuItem value={10}>Usuarios</MenuItem>
				</Select>
			</FormControl>
		</div>
	);
};

export default AccessUsers;
