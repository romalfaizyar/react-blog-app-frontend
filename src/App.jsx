import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes } from 'react-router-dom';
import Blogs from './components/Blogs';
import CreateBlog from './components/CreateBlog';
import { ToastContainer, toast } from 'react-toastify';
import BlogDetail from './components/BlogDetail';
import EditBlog from './components/EditBlog';


function App() {
  return (
    <>
      <div className='bg-dark text-center py-2 shadow-lg'>
        <h1 className='text-white'>React Laravel Blog App</h1>
      </div>
      <Routes>
        <Route path='/' element={ <Blogs/> }/>
        <Route path='/create' element={ <CreateBlog/> }/>
        <Route path='/blog/:id' element={ <BlogDetail /> }/>
        <Route path='/blog/edit/:id' element={ <EditBlog /> }/>
      </Routes>
      <ToastContainer />
    </>
  )
}

export default App
