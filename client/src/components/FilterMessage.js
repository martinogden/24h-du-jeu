import React, { PropTypes } from 'react';
import { CardPanel} from 'react-materialize';


const FilterMessage = ({ fetchGames }) => (
	<CardPanel className="center-align">
            <a href='#' className="teal-text" onClick={ fetchGames }>
            	Afficher tous les jeux
            </a>
    </CardPanel>
);

FilterMessage.propTypes = {
	 fetchGames: PropTypes.func.isRequired,
};

export default FilterMessage;