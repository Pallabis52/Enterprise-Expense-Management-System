import React, { useEffect, useState } from "react";
import { Container, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import axios from "axios";

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/expenses`).then((response) => {
      setExpenses(response.data);
    });
  }, []);

  return (
    <Container>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Category</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {expenses.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell>{expense.category}</TableCell>
              <TableCell>${expense.amount}</TableCell>
              <TableCell>{expense.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
};

export default Expenses;