import React, { useEffect, useState } from "react";
import Editor from "react-simple-wysiwyg";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

const EditBlog = () => {
  const [blog, setBlog] = useState(null);
  const [html, setHtml] = useState("");
  const [imageId, setImageId] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const params = useParams();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  function onChange(e) {
    setHtml(e.target.value);
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/save-temp-image`, {
        method: "POST",
        body: formData,
      });
      const result = await res.json();

      if (!result.status) {
        alert(result.errors?.image || "Image upload failed");
        e.target.value = null;
        setImageId(null);
        return;
      }
      setImageId(result.image.id);
    } catch (error) {
      alert("Error uploading image");
      setImageId(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/blogs/${params.id}`);
      const result = await res.json();

      if (res.ok) {
        setBlog(result.data);
        setHtml(result.data.description || "");
        reset(result.data);
        setImageId(result.data.image_id || null);
      } else {
        toast.error(result.message || "Failed to fetch blog data");
      }
    } catch (error) {
      toast.error("Error fetching blog data");
    } finally {
      setLoading(false);
    }
  };

  const formSubmit = async (data) => {
    const newData = { ...data, description: html, image_id: imageId };

    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/blogs/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });

      if (res.ok) {
        toast.success("Blog updated successfully!");
        navigate("/");
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Failed to update blog");
      }
    } catch (error) {
      toast.error("Failed to update blog");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlog();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container">
      <div className="d-flex justify-content-between pt-5 mb-4">
        <h4>Edit Blog</h4>
        <a href="/" className="btn btn-dark">
          Back
        </a>
      </div>
      <div className="card shadow-lg">
        <form onSubmit={handleSubmit(formSubmit)}>
          <div className="card-body">
            <div className="mb-3">
              <label className="form-label">Title</label>
              <input
                {...register("title", { required: true })}
                type="text"
                className={`form-control ${errors.title ? "is-invalid" : ""}`}
                placeholder="Title"
              />
              {errors.title && <p className="invalid-feedback">Title field is required</p>}
            </div>
            <div className="mb-3">
              <label className="form-label">Short Description</label>
              <textarea
                {...register("shortDesc")}
                cols="30"
                rows="5"
                className="form-control"
              ></textarea>
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <Editor
                value={html}
                onChange={onChange}
                containerProps={{ style: { height: "300px" } }}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Image</label>
              <input
                onChange={handleFileChange}
                type="file"
                className="form-control"
                disabled={loading}
              />
              <div className="mt-2">
                {blog?.image && (
                  <img
                    className="w-50"
                    src={`${import.meta.env.VITE_API_URL.replace('/api','')}/uploads/blogs/${blog.image}`}
                    alt="Blog"
                  />
                )}
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Author</label>
              <input
                {...register("author", { required: true })}
                type="text"
                className={`form-control ${errors.author ? "is-invalid" : ""}`}
                placeholder="Author"
              />
              {errors.author && <p className="invalid-feedback">Author field is required</p>}
            </div>
            <button className="btn btn-dark" disabled={loading}>
              {loading ? "Please wait..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBlog;
