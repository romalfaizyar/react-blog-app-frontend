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

  if (loading) return <div className="container pt-5">Loading...</div>;
  if (error) return <div className="container pt-5 text-danger">Error: {error}</div>;
  if (!blog) return <div className="container pt-5">No blog found</div>;

  // حذف "/api" از انتهای URL برای دسترسی به مسیر فایل‌های آپلود شده
  const baseUrl = import.meta.env.VITE_API_URL.replace(/\/api$/, "");
  const imageUrl = blog.image ? `${baseUrl}/uploads/blogs/${blog.image}` : null;

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
            by <strong>{blog.author}</strong> on {new Date(blog.created_at).toLocaleDateString()}
          </p>
          {imageUrl && (
            <img
              className="w-100"
              src={imageUrl}
              alt={blog.title}
              onError={e => {
                e.target.onerror = null;
                e.target.src = "https://placehold.co/600x400?text=No+Image";
              }}
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
