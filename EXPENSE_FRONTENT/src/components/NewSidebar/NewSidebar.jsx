import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useDemoRouter } from '@toolpad/core/internal';
import MUIDataTable from "mui-datatables";

const NAVIGATION = [
  { segment: 'dashboard', title: 'Dashboard', icon: <DashboardIcon /> },
  { segment: 'Approved', title: 'Approved', icon: <CheckCircleIcon /> },
  { segment: 'Pending', title: 'Pending', icon: <PendingActionsIcon /> },
  { segment: 'Reject', title: 'Reject', icon: <NotInterestedIcon /> },
];

const demoTheme = createTheme({
  breakpoints: { values: { xs: 0, sm: 600, md: 600, lg: 1200, xl: 1536 } },
});
const columns = [
  { name: "Employee ID", label: "Employee ID" },
  { name: "Employee Name", label: "Employee Name" },
  { name: "Amount", label: "Amount" },
  { 
    name: "Category", 
    label: "Category",
    options: {
      customBodyRender: (value) => {
        const categoryColors = {
          "Food": "#FF5733",
          "Travel": "#3498DB",
          "Flight": "#8E44AD",
          "Hotel": "#27AE60",
          "Health": "#E74C3C",
        };
        return (
          <div
            style={{
              backgroundColor: categoryColors[value] || "#BDC3C7",
              color: "#ffffff",
              padding: "5px 10px",
              borderRadius: "8px",
              fontWeight: "bold",
              textAlign: "center",
              display: "inline-block",
              minWidth: "80px",
            }}
          >
            {value}
          </div>
        );
      }
    }
  },
  { name: "Date", label: "Date" },
  { 
    name: "Status", 
    label: "Status",
    options: {
      customBodyRender: (value) => {
        const statusColors = {
          "Approved": "green",
          "Pending": "blue",
          "Reject": "red",
        };
        return (
          <div
            style={{
              backgroundColor: statusColors[value] || "#BDC3C7",
              color: "#ffffff",
              padding: "5px 10px",
              borderRadius: "8px",
              fontWeight: "bold",
              textAlign: "center",
              display: "inline-block",
              minWidth: "80px",
            }}
          >
            {value}
          </div>
        );
      }
    }
  },
  {
    name: "Action",
    label: "Action",
    options: {
      customBodyRender: (value, tableMeta) => {
        return (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              style={{ backgroundColor: "green", color: "white", padding: "5px 10px", borderRadius: "5px", border: "none", cursor: "pointer" }}
              onClick={() => handleAction(tableMeta.rowIndex, "Approved")}
            >
              Approve
            </button>
            <button
              style={{ backgroundColor: "red", color: "white", padding: "5px 10px", borderRadius: "5px", border: "none", cursor: "pointer" }}
              onClick={() => handleAction(tableMeta.rowIndex, "Reject")}
            >
              Reject
            </button>
          </div>
        );
      }
    }
  }
];

const handleAction = (index, status) => {
  data[index][5] = status;
  alert(`Status updated to ${status}`);
};

const data = [
  ["202125", "John Walsh", "2000", "Hotel", "02/12/2024", "Approved"],
  ["202126", "Alice Smith", "1500", "Food", "02/15/2024", "Pending"],
  ["202127", "Robert Brown", "3200", "Travel", "02/20/2024", "Approved"],
  ["202128", "Emma Davis", "5000", "Flight", "02/25/2024", "Reject"],
  ["202129", "Liam Wilson", "1800", "Health", "02/28/2024", "Pending"],
  ["202125", "John Walsh", "2000", "Hotel", "02/12/2024", "Approved"],
  ["202126", "Alice Smith", "1500", "Food", "02/15/2024", "Pending"],
  ["202127", "Robert Brown", "3200", "Travel", "02/20/2024", "Approved"],
  ["202128", "Emma Davis", "5000", "Flight", "02/25/2024", "Reject"],
  ["202129", "Liam Wilson", "1800", "Health", "02/28/2024", "Pending"],
];

const options = {
  selectableRows: "none", 
  responsive: "standard", 
  elevation: 4,
  print: false,
  download: false,
  rowsPerPage: 10,
  rowsPerPageOptions: [10, 20, 30, 40],
};

function DemoPageContent({ pathname }) {
  return (
    <Box sx={{ py: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '100%', maxWidth: '1200px', mx: 'auto' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Expense Table</Typography>
      <Box sx={{ width: '100%', overflowX: 'auto', boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)", borderRadius: "10px", padding: "10px", backgroundColor: "white" }}>
        <MUIDataTable title={"Expense Report"} data={data} columns={columns} options={options} />
      </Box>
    </Box>
  );
}

DemoPageContent.propTypes = { pathname: PropTypes.string.isRequired };

function DashboardLayoutBranding(props) {
  const { window } = props;
  const router = useDemoRouter('/dashboard');

  return (
    <AppProvider
      navigation={NAVIGATION}
      branding={{ logo: <img src="https://zidio.in/assets/img/logo/logo.png" alt="MUI logo" />, title: 'Expense Management' }}
      router={router}
      theme={demoTheme}
      window={window ? window() : undefined}
    >
      <DashboardLayout>
        <DemoPageContent pathname={router.pathname} />
      </DashboardLayout>
    </AppProvider>
  );
}

DashboardLayoutBranding.propTypes = { window: PropTypes.func };

export default DashboardLayoutBranding;

