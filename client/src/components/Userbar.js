import React, { PropTypes } from 'react';
import { NavItem, Dropdown } from 'react-materialize';

const styles = {  // TODO extract inline styles
	img: {
		height: '32px',
		position: 'relative',
    	top: '12px',
	},
};


// TODO : replace fixed image by user image

const Userbar = ({ loggedInUser, onLogout, onFetchGamesIKnow, onFetchGamesIOwn }) => {

	return(
		<li>
			<Dropdown 
				trigger={
					<a href='#'><img src={ loggedInUser.picture_url } className="circle" style={ styles.img }/></a>
				}
				options={
					{
						constrain_width: false,
						belowOrigin: true,
					}	
				}>

				<NavItem
					onClick={ onFetchGamesIOwn }>
					Je possède
				</NavItem>
				<NavItem
					onClick={ onFetchGamesIKnow }>
					J&#39;explique
				</NavItem>
				<NavItem divider />
				<NavItem 
					onClick={ onLogout }>
					Déconnexion
				</NavItem>
			</Dropdown>
		</li>
	);
};

Userbar.propTypes = {
	 onLogout: PropTypes.func.isRequired,
	 onFetchGamesIKnow: PropTypes.func.isRequired,
	 onFetchGamesIOwn: PropTypes.func.isRequired,
	 loggedInUser: PropTypes.object.isRequired,
};

export default Userbar;