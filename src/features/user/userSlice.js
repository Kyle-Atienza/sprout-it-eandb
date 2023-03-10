import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import userService from "./userService";

//user will be stored on local storage
const user = JSON.parse(localStorage.getItem("sproutItUser"));

//create initial state for user
const initialState = {
  user: user ? user : null,
  users: [],
  inviteToken: "",
  resetLink: "",
  isSuccess: false,
  isError: false,
  isLoading: false,
  message: "",
};

export const register = createAsyncThunk(
  "user/register",
  async (user, thunkAPI) => {
    try {
      return await userService.register(user);
    } catch (error) {
      const message = {
        status: error.message,
        response: error.response.data.message,
      };

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const registerWithInvite = createAsyncThunk(
  "user/register-invite",
  async (user, thunkAPI) => {
    try {
      return await userService.register(user);
    } catch (error) {
      const message = {
        status: error.message,
        response: error.response.data.message,
      };

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const login = createAsyncThunk("user/login", async (user, thunkAPI) => {
  try {
    return await userService.login(user);
  } catch (error) {
    const message = {
      status: error.message,
      response: error.response.data.message,
    };

    return thunkAPI.rejectWithValue(message);
  }
});

export const updateUser = createAsyncThunk(
  "user/update",
  async (payload, thunkAPI) => {
    try {
      return await userService.updateUser(payload);
    } catch (error) {
      const message = {
        status: error.message,
        response: error.response.data.message,
      };

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const invite = createAsyncThunk(
  "user/invite",
  async (invitedUser, thunkAPI) => {
    try {
      return await userService.invite(invitedUser);
    } catch (error) {
      const message = {
        status: error.message,
        response: error.response.data.message,
      };

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const forgetPassword = createAsyncThunk(
  "user/forgotPassword",
  async (email, thunkAPI) => {
    const origin = window.location.origin;

    try {
      return await userService.forgotPassword({ origin: origin, ...email });
    } catch (error) {
      const message = {
        status: error.message,
        response: error.response.data.message,
      };

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "user/resetPassword",
  async (payload, thunkAPI) => {
    try {
      return await userService.resetPassword(payload);
    } catch (error) {
      const message = {
        status: error.message,
        response: error.response.data.message,
      };

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getUsers = createAsyncThunk("user/getAll", async (_, thunkAPI) => {
  try {
    return await userService.getUsers();
  } catch (error) {
    const message = {
      status: error.message,
      response: error.response.data.message,
    };

    return thunkAPI.rejectWithValue(message);
  }
});

export const deleteUser = createAsyncThunk(
  "user/delete",
  async (id, thunkAPI) => {
    try {
      return await userService.deleteUser(id);
    } catch (error) {
      const message = {
        status: error.message,
        response: error.response.data.message,
      };

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const logout = createAsyncThunk("user/logout", async () => {
  localStorage.removeItem("sproutItUser");
});

//create slice
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    reset: (state) => {
      state.isSuccess = false;
      state.isError = false;
      state.isLoading = false;
      state.message = "";
    },
    clearInviteToken: (state) => {
      state.inviteToken = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      .addCase(registerWithInvite.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerWithInvite.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(registerWithInvite.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      .addCase(invite.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(invite.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.inviteToken = action.payload;
      })
      .addCase(invite.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(forgetPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(forgetPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.resetLink = action.payload;
        alert("Reset link has been sent to your email. This may take a while");
      })
      .addCase(forgetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        console.log(action.payload);
        alert(action.payload.response);
      })
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.resetLink = action.payload;
        alert("Password Successfully Upadated");
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        console.log(action.payload);
        state.user = action.payload; //return user
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.users = action.payload;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.users = state.users.filter((user) => {
          console.log(user._id, action);
          return user._id !== action.payload.id;
        });
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      });
  },
});

export const { reset, clearInviteToken } = userSlice.actions;
export default userSlice.reducer;
