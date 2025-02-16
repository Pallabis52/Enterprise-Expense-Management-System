import { createSlice } from "@reduxjs/toolkit";

const expenseInitialState = { expenses: [] };

const expenseSlice = createSlice({
  name: "expenses",
  initialState: expenseInitialState,
  reducers: {
    setExpenses: (state, action) => {
      state.expenses = action.payload;
    },
  },
});

export const { setExpenses } = expenseSlice.actions;
export default expenseSlice.reducer;
