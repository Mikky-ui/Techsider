import React, { useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import { NavLink, useLocation } from 'react-router';
import { navLinkStyles } from './navbarStyles';

export default function NavbarMenu({ pages }) {
  const [anchorElNav, setAnchorElNav] = useState(null);

  const location = useLocation()
  const path = location.pathname
  console.log(path)

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <>
      {/* Mobile Menu */}
      <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
        <IconButton
          size="large"
          aria-label="open navigation menu"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleOpenNavMenu}
          color="inherit"
        >
          <MenuIcon />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorElNav}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          keepMounted
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          open={Boolean(anchorElNav)}
          onClose={handleCloseNavMenu}
        >
          {pages.map((page) => (
            <MenuItem key={page.label} onClick={handleCloseNavMenu} selected={path === page.path}>
              {/* Use Link for navigation */}
              <NavLink to={page.path} style={navLinkStyles}>
                <Typography textAlign="center">{page.label}</Typography>
              </NavLink>
            </MenuItem>
          ))}
        </Menu>
      </Box>

      {/* Desktop Menu */}
      <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
        {pages.map((page) => (
          <Button
          key={page.label}
          component={NavLink}
          to={page.path}
          onClick={handleCloseNavMenu}
          sx={{ my: 2, color: 'white', display: 'block' }}
        >
            <NavLink to={page.path} style={navLinkStyles}>
              {page.label}
            </NavLink>
        </Button>
        ))}
      </Box>
    </>
  );
}
