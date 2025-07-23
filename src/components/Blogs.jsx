import React, { useEffect, useState } from "react";
import BlogCard from "./BlogCard";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [keyword, setKeyword] = useState("");

  const fetchBlogs = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/blogs`);
      const result = await res.json();
      setBlogs(result.data);
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
    }
  };

  const searchBlogs = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/blogs?keyword=${keyword}`
      );
      const result = await res.json();
      setBlogs(result.data);
    } catch (error) {
      console.error("Failed to search blogs:", error);
    }
  };

  const resetSearch = () => {
    fetchBlogs();
    setKeyword("");
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="container">
      <div className="d-flex justify-content-center pt-5 mb-4">
        <form onSubmit={searchBlogs}>
          <div className="d-flex">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="form-control"
              placeholder="Search Blogs"
            />
            <button className="btn btn-dark ms-2" type="submit">
              Search
            </button>
            <button
              type="button"
              onClick={resetSearch}
              className="btn btn-success ms-2"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
      <div className="d-flex justify-content-between pt-5 mb-4">
        <h4>Blogs</h4>
        <a href="/create" className="btn btn-dark">
          Create
        </a>
      </div>
      <div className="row">
        {blogs && blogs.length > 0 ? (
          blogs.map((blog) => (
            <BlogCard
              blogs={blogs}
              setBlogs={setBlogs}
              key={blog.id}
              blog={blog}
            />
          ))
        ) : (
          <p>No blogs found.</p>
        )}
      </div>
    </div>
  );
};

export default Blogs;
