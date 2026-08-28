import React, { useContext, useEffect, useState } from "react";
import { Image, Globe2, X, Sparkles, Loader } from "lucide-react";
import { userContext } from "../context/UserContext";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import { toast } from "sonner";
import Loading from "./Loading";
import ErrorState from "./ErrorState";

export default function UpdatePost() {
  const { id } = useParams();
  const { userInfo, token } = useContext(userContext);
  const [selectedImage, setSelectedImage] = useState(null);
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [originalCaption, setOriginalCaption] = useState("");
  const [originalImage, setOriginalImage] = useState(null);

  function handlePhotoChange(e) {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      toast.error("Please select a valid image");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setFile(selectedFile);

    setSelectedImage(URL.createObjectURL(selectedFile));
  }

  // مُصلَّحة: كانت بتستخدم setPost / SetLikesCounter / setIsBookMark / setISlike
  async function getPost() {
    setLoading(true);
    try {
      const options = {
        method: "GET",
        url: `https://route-posts.routemisr.com/posts/${id}?page=1&limit=20`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.request(options);
      const post = data.data.post;

      setCaption(post.body || "");
      setOriginalCaption(post.body || "");

      setSelectedImage(post.image || null);
      setOriginalImage(post.image || null);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getPost();
  }, [id]);

  function handleRemoveImage() {
    setSelectedImage(null);
    setFile(null);
  }

  async function updatePost(e) {
    e.preventDefault();
    setSubmitLoading(true);

    const formData = new FormData();

    if (caption) {
      formData.append("body", caption);
    }

    if (file) {
      formData.append("image", file);
    }

    try {
      const options = {
        method: "PUT",
        url: `https://route-posts.routemisr.com/posts/${id}`,
        data: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.request(options);
      toast.success("Post updated successfully!");
      navigate("/");
    } catch (error) {
      toast.error("Failed to update post");
    } finally {
      setSubmitLoading(false);
    }
  }

  const hasChanges =
    caption !== originalCaption ||
    file !== null ||
    selectedImage !== originalImage;

  return (
    <div className="w-full min-w-[90%] md:max-w-[90%] lg:max-w-2xl mx-auto flex justify-center px-4 sm:px-6 py-6 space-y-5">
      {error ? (
        <ErrorState />
      ) : loading ? (
        <Loading />
      ) : (
        <form
          onSubmit={updatePost}
          className="w-full max-w-2xl bg-[#07110D]/90 border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 backdrop-blur-xl shadow-2xl space-y-5 sm:space-y-6"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="size-5 text-[#1DB854]" />
              <h1 className="text-base sm:text-lg font-bold tracking-wide">
                Update
              </h1>
            </div>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="size-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="size-11 sm:size-12 rounded-full bg-[#112B22] border border-[#1DB854]/40 flex items-center justify-center">
              <img
                src={userInfo?.photo}
                alt={userInfo?.name}
                className="size-full rounded-full object-cover border border-white/10 shrink-0"
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-white">
                {userInfo?.name}
              </span>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs text-[#8A8F8D] hover:text-white transition-all cursor-pointer w-fit">
                <Globe2 className="size-3.5 text-[#1DB854]" />
                <span>Public</span>
              </div>
            </div>
          </div>

          <div className="min-h-[100px] sm:min-h-[180px]">
            <textarea
              value={caption}
              onChange={(e) => {
                setCaption(e.target.value);
              }}
              placeholder="What's growing on your mind?"
              rows={5}
              className="w-full bg-transparent text-sm sm:text-base text-gray-100 placeholder-[#8A8F8D] focus:outline-none resize-none leading-relaxed"
            />
          </div>

          {selectedImage ? (
            <div className="relative rounded-2xl border border-white/10 overflow-hidden max-h-[300px] group">
              <img
                src={selectedImage}
                alt="Preview"
                className="w-full h-full max-h-[300px] object-cover rounded-2xl"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-3 right-3 size-8 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 flex items-center justify-center text-white transition-all cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>
          ) : (
            <div className="relative rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-4 text-center hover:border-[#1DB854]/50 transition-colors cursor-pointer group">
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handlePhotoChange}
              />
              <div className="flex flex-col items-center justify-center gap-2 py-3 pointer-events-none">
                <div className="size-10 rounded-full bg-white/5 flex items-center justify-center text-[#1DB854] group-hover:scale-110 transition-transform">
                  <Image className="size-5" />
                </div>
                <p className="text-xs sm:text-sm text-gray-300 font-medium">
                  Click to upload an image or drag & drop
                </p>
                <span className="text-[10px] sm:text-xs text-[#8A8F8D]">
                  PNG, JPG, GIF up to 5MB
                </span>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">

            {submitLoading || !hasChanges ? (
              ""
            ) : (
              <button
                type="button"
                onClick={() => {
                  setCaption(originalCaption);
                  setSelectedImage(originalImage);
                  setFile(null);
                }}
                className="px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-gray-300 text-xs sm:text-sm font-medium transition-all cursor-pointer"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={submitLoading || !hasChanges}
              className="px-6 py-2.5 disabled:bg-[#1DB854]/50 disabled:cursor-not-allowed bg-[#1DB854] hover:bg-[#19a34a] text-[#0A1F18] font-semibold text-xs sm:text-sm rounded-xl transition-all active:scale-[0.98] text-center cursor-pointer shadow-lg shadow-[#1DB854]/15"
            >
              {submitLoading ? (
                <Loader className="size-5 block m-auto animate-spin" />
              ) : (
                "Update"
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
