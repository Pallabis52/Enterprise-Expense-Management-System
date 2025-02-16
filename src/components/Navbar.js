import React from "react";
import { AppBar, Toolbar, Typography, Button, Switch } from "@mui/material";
import { Link } from "react-router-dom";
import { useTheme } from "../theme/ThemeProvider";

const Navbar = () => {
  const { darkMode, setDarkMode } = useTheme();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>Expense Manager</Typography>
        <Button color="inherit" component={Link} to="/">Dashboard</Button>
        <Button color="inherit" component={Link} to="/expenses">Expenses</Button>
        <Button color="inherit" component={Link} to="/reports">Reports</Button>
        <Button color="inherit" component={Link} to="/analytics">Analytics</Button>
        <Button color="inherit" component={Link} to="/login">Login</Button>
        <Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
