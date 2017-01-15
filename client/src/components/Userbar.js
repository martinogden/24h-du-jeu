import React, { PropTypes } from 'react';
import { NavItem, Dropdown, Icon } from 'react-materialize';

const styles = {  // TODO extract inline styles
	img: {
		height: '32px',
		position: 'relative',
    	top: '12px',
	},
};


const user_image = (user) => {
	if (!user.picture_url)
		return (<Icon>perm_identity</Icon>);
	else
		return (<img src={ user.picture_url } className="circle" style={ styles.img }/>);
}

const Userbar = ({ loggedInUser, onLogout, onFetchGamesIKnow, onFetchGamesIOwn }) => {

	return(
		<li>
			<Dropdown 
				trigger={
					<a href='#'>{ user_image(loggedInUser) }</a>
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