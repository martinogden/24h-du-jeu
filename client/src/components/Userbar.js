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

const Userbar = ({onLogout}) => {

	return(
		<li>
			<Dropdown 
				trigger={
					<a href='#'><img src='/static/img/celine.jpg' className="circle" style={ styles.img }/></a>
				}
				options={
					{
						constrain_width: false,
						belowOrigin: true,
					}	
				}>

				<NavItem>J&#39;apporte</NavItem>
				<NavItem>J&#39;explique</NavItem>
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
};

export default Userbar;