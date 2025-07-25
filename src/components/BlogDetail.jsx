import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const BlogDetail = () => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams();

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/blogs/${params.id}`);
      if (!res.ok) throw new Error("Failed to fetch blog");
      const result = await res.json();
      setBlog(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, []);

  const baseUrl = import.meta.env.VITE_API_URL.replace(/\/api$/, "");

  if (loading) return <div className="container pt-5">Loading...</div>;
  if (error) return <div className="container pt-5 text-danger">Error: {error}</div>;
  if (!blog) return <div className="container pt-5">No blog found</div>;

  return (
    <div className="container">
      <div className="d-flex justify-content-between pt-5 mb-4">
        <h2>{blog.title}</h2>
        <Link to="/" className="btn btn-dark">
          Back to blogs
        </Link>
      </div>
      <div className="row">
        <div className="col-md-12">
          <p>
            by <strong>{blog.author}</strong> on{" "}
            {new Date(blog.created_at).toLocaleDateString()}
          </p>

          {blog.image && (
            <img
  className="w-100"
  src={`https://api.narwan.net/laravel-blog-app-backend/public/uploads/blogs/${blog.image}`}
  alt={blog.title}
/>


          )}

          <div
            className="mt-3"
            dangerouslySetInnerHTML={{ __html: blog.description }}
          />
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
