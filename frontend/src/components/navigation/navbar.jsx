import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import AdbIcon from '@mui/icons-material/Adb';

import NavbarMenu from './NavbarMenu';
import NavbarSearch from './NavbarSearch';
import NavbarUserMenu from './NavbarUserMenu';

const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

export default function Navbar({ content, navigationItems }) {
  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Logo */}
            <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="#app-bar-with-responsive-menu"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              TECHSIDER
            </Typography>

            {/* Navigation Menu */}
            <NavbarMenu pages={navigationItems} />

            {/* Search Bar */}
            <NavbarSearch />

            {/* User Menu */}
            <NavbarUserMenu settings={settings} />
          </Toolbar>
        </Container>
      </AppBar>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {content}
      </Box>
    </Box>
  );
}
