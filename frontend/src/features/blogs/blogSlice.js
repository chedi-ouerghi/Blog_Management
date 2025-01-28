import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


const API_URL = 'http://localhost:6505/api';


export const fetchBlogs = createAsyncThunk('blogs/fetchBlogs', async (_, { getState, rejectWithValue }) => {
  const token = localStorage.getItem('token');
  if (!token) return rejectWithValue('No token found.');

  try {
    const response = await axios.get(`${API_URL}/blogs/admin/blogs`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.blogs;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const approveBlog = createAsyncThunk('blogs/approveBlog', async (id, { rejectWithValue }) => {
  const token = localStorage.getItem('token');
  if (!token) return rejectWithValue('No token found.');

  try {
    await axios.put(
      `${API_URL}/blogs/${id}/approve`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return id;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const rejectBlog = createAsyncThunk('blogs/rejectBlog', async (id, { rejectWithValue }) => {
  const token = localStorage.getItem('token');
  if (!token) return rejectWithValue('No token found.');

  try {
    await axios.put(
      `${API_URL}/blogs/${id}/reject`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return id;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const deleteBlog = createAsyncThunk('blogs/deleteBlog', async (id, { rejectWithValue }) => {
  const token = localStorage.getItem('token');
  if (!token) return rejectWithValue('No token found.');

  try {
    await axios.delete(`${API_URL}/blogs/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return id;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const fetchPaginatedBlogs = createAsyncThunk(
  'blogs/fetchPaginatedBlogs',
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/blogs?page=${page}&limit=${limit}`);
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchBlogDetails = createAsyncThunk(
  'blogs/fetchBlogDetails',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/blogs/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createBlog = createAsyncThunk('blogs/createBlog', async (formData, { rejectWithValue }) => {
  const token = localStorage.getItem('token');
  if (!token) return rejectWithValue('No token found.');

  try {
    const response = await axios.post(`${API_URL}/blogs`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data; 
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const updateBlog = createAsyncThunk(
  'blogs/updateBlog',
  async ({ id, formData }, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    if (!token) return rejectWithValue('No token found.');

    try {
      const response = await axios.put(`${API_URL}/blogs/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);



const blogSlice = createSlice({
  name: 'blogs',
  initialState: {
    blogs: [],
    loading: false,
    error: null,
    createdBlog: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(approveBlog.fulfilled, (state, action) => {
        const index = state.blogs.findIndex((blog) => blog._id === action.payload);
        if (index !== -1) state.blogs[index].status = 'approved';
      })
      
      .addCase(rejectBlog.fulfilled, (state, action) => {
        const index = state.blogs.findIndex((blog) => blog._id === action.payload);
        if (index !== -1) state.blogs[index].status = 'rejected';
      })
      
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.blogs = state.blogs.filter((blog) => blog._id !== action.payload);
      })
      
    .addCase(fetchPaginatedBlogs.pending, (state) => {
      state.loading = true;
    })
    .addCase(fetchPaginatedBlogs.fulfilled, (state, action) => {
      state.loading = false;
      state.blogs = action.payload.blogs;
      state.totalPages = action.payload.totalPages;
    })
    .addCase(fetchPaginatedBlogs.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    
    .addCase(fetchBlogDetails.pending, (state) => {
      state.loading = true;
    })
    .addCase(fetchBlogDetails.fulfilled, (state, action) => {
      state.loading = false;
      state.blogDetails = action.payload;
    })
    .addCase(fetchBlogDetails.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
      
    .addCase(createBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.createdBlog = action.payload;
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
     
      .addCase(updateBlog.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.blogs.findIndex(blog => blog._id === action.payload._id);
        if (index !== -1) {
          state.blogs[index] = action.payload; 
        }
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export default blogSlice.reducer;
