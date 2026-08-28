import React, { useContext, useEffect, useState, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router";
import {
  Heart,
  MessageSquare,
  MoreHorizontal,
  Bookmark,
  Globe2,
  Send,
  BookmarkOff,
  Lock,
  X,
  Pencil,
  Trash2,
  Image,
  Loader,
} from "lucide-react";
import { userContext } from "../context/UserContext";
import axios from "axios";
import Loading from "./Loading";
import timeAgo from "../utils/TimeAgo";
import ErrorState from "./ErrorState";
import Swal from "sweetalert2";
import { toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { faBookmark as solidBookmark } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as regularBookmark } from "@fortawesome/free-regular-svg-icons";
import Comments from "./Comments";

export default function PostDetails() {
  const { id } = useParams();

  const navigate = useNavigate();
  const { token, userInfo } = useContext(userContext);
  const [isLike, setISlike] = useState(false);
  const [post, setPost] = useState({});
  const [comments, setComments] = useState([]);
  const [IsUpdateComment, setIsUpdateComment] = useState(false);
  const [loading, setLoading] = useState(true);
  const [likesCounter, SetLikesCounter] = useState(post.likesCount);

  const [error, setError] = useState(false);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const [likeAnimation, setLikeAnimation] = useState(false);
  const [isBoookMark, setIsBookMark] = useState(post.bookmarked);
  const [commentText, setCommentText] = useState("");
  const [commentFile, setCommentFile] = useState(null);
  const [originalCommentText, setOriginalCommentText] = useState("");
  const [originalCommentImage, setOriginalCommentImage] = useState(null);
  const [commentSelectedImage, setCommentSelectedImage] = useState(null);
  const [editingCommentID, setEditingCommentID] = useState(null);
  const [commentSubmitLoading, setCommentSubmitLoading] = useState(false);

  async function deletePost() {
    const options = {
      method: "DELETE",
      url: `https://route-posts.routemisr.com/posts/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await axios.request(options);
      toast.success("Post deleted");
    } catch (error) {
      toast.error("Failed to delete post");
    }
  }

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  async function getPost() {
    try {
      const options = {
        method: "GET",
        url: `https://route-posts.routemisr.com/posts/${id}?page=1&limit=20`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.request(options);

      setPost(data.data.post);
      SetLikesCounter(data.data.post.likesCount);
      setIsBookMark(data.data.post.bookmarked);
      setISlike(data.data.post.likes?.includes(userInfo?.id));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  async function likePost() {
    const options = {
      method: "PUT",
      url: `https://route-posts.routemisr.com/posts/${id}/like`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.request(options);
    setISlike(data.data.liked);
    SetLikesCounter(data.data.likesCount);
  }

  async function savePost() {
    const options = {
      method: "PUT",
      url: `https://route-posts.routemisr.com/posts/${post.id}/bookmark`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.request(options);
    console.log(data.data);
    setIsBookMark(data.data.bookmarked);
  }

  async function getPostComments() {
    try {
      const options = {
        method: "GET",
        url: `https://route-posts.routemisr.com/posts/${id}/comments?page=1&limit=10`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.request(options);

      setComments(data.data.comments);
    } catch (error) {
      setError(true);
    }
  }

  useEffect(() => {
    getPost();
    getPostComments();
  }, []);

  function handleCommentPhotoChange(e) {
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

    setCommentFile(selectedFile);
    setCommentSelectedImage(URL.createObjectURL(selectedFile));
  }

  function handleRemoveCommentImage() {
    setCommentSelectedImage(null);
    setCommentFile(null);
  }

  async function createComment(e) {
    e.preventDefault();

    if (!commentText && !commentFile) return;

    setCommentSubmitLoading(true);

    const formData = new FormData();

    if (commentText) {
      formData.append("content", commentText);
    }

    if (commentFile) {
      formData.append("image", commentFile);
    }

    try {
      const options = {
        method: "POST",
        url: `https://route-posts.routemisr.com/posts/${id}/comments?page=1&limit=10`,
        data: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.request(options);
      toast.success("Comment added");
      setCommentText("");
      handleRemoveCommentImage();
      setCommentSubmitLoading(false);

      setComments((prev) => [data.data.comment, ...prev]);
    } catch (error) {
      toast.error("Failed to add comment");
      setCommentSubmitLoading(false);
    }
  }

  async function UpdateComment(e) {
    e.preventDefault();

    if (!commentText && !commentFile) return;

    setCommentSubmitLoading(true);

    const formData = new FormData();

    if (commentText) {
      formData.append("content", commentText);
    }

    if (commentFile) {
      formData.append("image", commentFile);
    }

    try {
      const options = {
        method: "PUT",
        url: `https://route-posts.routemisr.com/posts/${id}/comments/${editingCommentID}`,
        data: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.request(options);

      toast.success("Comment added");
      setCommentText("");
      handleRemoveCommentImage();
      setCommentSubmitLoading(false);
      setIsUpdateComment(false);
      setEditingCommentID(null);

      setComments((prev) => [data.data.comment, ...prev]);
    } catch (error) {
      toast.error("Failed to add comment");
      setCommentSubmitLoading(false);
      console.log({ error });
    }
  }

  function handleCommentDeleted(deletedID) {
    setComments((prev) =>
      prev.filter((comment) => (comment._id || comment.id) !== deletedID),
    );
  }
  function handleEditComment(id, image, content) {
    setEditingCommentID(id);
    setIsUpdateComment(true);
    setCommentText(content);
    setCommentSelectedImage(image);
    setOriginalCommentText(content);
    setOriginalCommentImage(image);
  }

  return (
    <>
      <div className="md:max-w-[85%] w-full mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-5 pb-10">
        {error ? (
          <ErrorState />
        ) : loading ? (
          <Loading />
        ) : (
          <>
            <div className="relative bg-[#07110D]/80 border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 backdrop-blur-md space-y-4 shadow-xl">
              {likeAnimation ? (
                <div className=" absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]">
                  {" "}
                  <FontAwesomeIcon
                    className="text-8xl text-[#1DB854] animate-ping"
                    icon={faHeartSolid}
                  />
                </div>
              ) : (
                ""
              )}
              <div className="flex items-center justify-between gap-2">
                <Link
                  to={`${userInfo.id === post.user._id ? `/profile` : `/user/${post.user._id}`}`}
                >
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                    <img
                      src={post.user.photo}
                      alt={post.user.name}
                      className="size-9 sm:size-11 rounded-full object-cover border border-white/10 shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs hover:text-[#1DB854] sm:text-sm font-semibold text-white truncate">
                        {post.user.name}
                      </h4>
                      <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-[#8A8F8D] mt-0.5 truncate">
                        <span className="truncate">@{post.user.username}</span>
                        <span>•</span>
                        <span className="shrink-0">
                          {timeAgo(post.createdAt)}
                        </span>
                        {post.privacy === "public" ? (
                          <Globe2 className="size-2.5 sm:size-3 text-[#8A8F8D] shrink-0" />
                        ) : (
                          <Lock className="size-2.5 sm:size-3 text-[#8A8F8D] shrink-0" />
                        )}
                      </div>
                    </div>
                  </div>
                </Link>

                <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                  {post.user._id === userInfo.id ? (
                    ""
                  ) : (
                    <button
                      onClick={() => {
                        savePost();
                      }}
                      className="hover:text-white transition-colors cursor-pointer shrink-0"
                    >
                      {isBoookMark ? (
                        <FontAwesomeIcon
                          className="text-xl text-[#1DB854]"
                          icon={solidBookmark}
                        />
                      ) : (
                        <FontAwesomeIcon
                          className="text-xl text-[#8A8F8D] hover:text-white"
                          icon={regularBookmark}
                        />
                      )}
                    </button>
                  )}

                  {userInfo.id === post.user._id ? (
                    <div className="relative" ref={menuRef}>
                      <button
                        onClick={() => setIsMenuOpen((prev) => !prev)}
                        className="p-1.5 sm:p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                      >
                        <MoreHorizontal className="size-4 sm:size-5" />
                      </button>

                      {isMenuOpen && (
                        <div className="absolute right-0 mt-2 w-36 bg-[#0B1A14] border border-white/10 rounded-2xl shadow-xl py-1.5 z-20 backdrop-blur-xl">
                          <button className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-gray-200 hover:text-white hover:bg-white/5 transition-colors cursor-pointer">
                            <Pencil className="size-3.5 text-[#1DB854]" />
                            <span>Update Post</span>
                          </button>

                          <button
                            onClick={() => {
                              setIsMenuOpen(false);
                              Swal.fire({
                                title:
                                  "<span class='text-lg font-bold text-white'>Delete?</span>",
                                text: "Are you sure you want to delete this post?",
                                icon: "warning",
                                iconColor: "#1DB854",
                                showCancelButton: true,
                                confirmButtonText: "Yes, delete it",
                                cancelButtonText: "Cancel",
                                reverseButtons: true,

                                background: "#07110D",
                                color: "#A3F5C3",
                                customClass: {
                                  popup:
                                    "border border-white/10 backdrop-blur-md rounded-3xl p-6 shadow-2xl",
                                  title: "text-white font-semibold",
                                  htmlContainer: "text-xs text-gray-300 mt-2",
                                  confirmButton:
                                    "px-5 py-2.5 bg-[#1DB854] hover:bg-[#19a34a] text-[#0A1F18] font-semibold text-xs rounded-xl transition-all active:scale-[0.98] outline-none ml-2 cursor-pointer",
                                  cancelButton:
                                    "px-5 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 font-medium text-xs rounded-xl border border-white/10 transition-all active:scale-[0.98] outline-none cursor-pointer",
                                },
                                buttonsStyling: false,
                              }).then((result) => {
                                if (result.isConfirmed) {
                                  deletePost();
                                  navigate(-1);
                                }
                              });
                            }}
                            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer"
                          >
                            <Trash2 className="size-3.5" />
                            <span>Delete Post</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    ""
                  )}

                  <button
                    onClick={() => navigate(-1)}
                    className="p-1.5 sm:p-2 rounded-full bg-white/[0.04] border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer backdrop-blur-md"
                    aria-label="Close"
                  >
                    <X className="size-4 sm:size-4.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-normal wrap-break-word">
                {post.body}
              </p>

              {post.image && (
                <div className="w-full rounded-xl sm:rounded-2xl border border-white/10 overflow-hidden max-h-[600px] bg-black/20">
                  <img
                    src={post.image}
                    alt="post content"
                    className="w-full max-h-[600px] object-cover object-center"
                  />
                </div>
              )}

              {commentSelectedImage && (
                <div className="relative rounded-2xl border border-white/10 overflow-hidden max-h-[220px] w-fit">
                  <img
                    src={commentSelectedImage}
                    alt="Comment preview"
                    className="max-h-[220px] object-cover rounded-2xl"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveCommentImage}
                    className="absolute top-2 right-2 size-7 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 flex items-center justify-center text-white transition-all cursor-pointer"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              )}

              <form className="flex items-center gap-2 lg:gap-3 pt-2 border-t border-white/5 text-gray-400 text-xs lg:text-sm">
                <button
                  onClick={() => {
                    likePost();
                    if (isLike) {
                      return;
                    } else {
                      setLikeAnimation(true);
                      setTimeout(() => {
                        setLikeAnimation(false);
                      }, 400);
                    }
                  }}
                  className="flex items-center gap-1.5 hover:text-[#1DB854] transition-colors cursor-pointer shrink-0"
                >
                  {isLike ? (
                    <FontAwesomeIcon
                      className="text-2xl text-[#1DB854]"
                      icon={faHeartSolid}
                    />
                  ) : (
                    <FontAwesomeIcon
                      className="text-2xl"
                      icon={faHeartRegular}
                    />
                  )}
                  <span className="text-[16px]">{likesCounter}</span>
                </button>
                <Link to={`/postlikes/${id}`}>
                  {likesCounter === 1 ? (
                    <div className=" text-[16px] flex text-[#1DB854] hover:text-[#1DB854]/50 transition-colors cursor-pointer shrink-0">
                      <FontAwesomeIcon icon={faHeartSolid} />
                    </div>
                  ) : (
                    ""
                  )}
                  {likesCounter === 2 ? (
                    <div className="text-[16px] flex text-[#1DB854] hover:text-[#1DB854]/50 transition-colors cursor-pointer shrink-0">
                      <FontAwesomeIcon icon={faHeartSolid} />
                      <FontAwesomeIcon icon={faHeartSolid} />
                    </div>
                  ) : (
                    ""
                  )}
                  {likesCounter >= 3 ? (
                    <div className="text-[16px] flex text-[#1DB854] hover:text-[#1DB854]/50 transition-colors cursor-pointer shrink-0">
                      <FontAwesomeIcon icon={faHeartSolid} />
                      <FontAwesomeIcon icon={faHeartSolid} />
                      <FontAwesomeIcon icon={faHeartSolid} />
                    </div>
                  ) : (
                    ""
                  )}
                </Link>
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1 min-w-[50px] bg-white/[0.04] border border-white/10 rounded-full px-4 py-2 text-xs lg:text-sm text-gray-200 placeholder:text-[#8A8F8D] outline-none focus:border-[#1DB854]/50 transition-colors"
                />

                <label className="flex items-center justify-center size-8 lg:size-9 rounded-full bg-white/[0.04] hover:bg-white/10 border border-white/10 text-[#1DB854] transition-all cursor-pointer shrink-0">
                  <Image className="size-4" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleCommentPhotoChange}
                  />
                </label>

                {IsUpdateComment ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        handleRemoveCommentImage();
                        setCommentText("");
                        setIsUpdateComment(false);
                        setEditingCommentID(null);
                      }}
                      className="flex items-center justify-center size-8 lg:size-9 rounded-full bg-white/[0.04] hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer shrink-0"
                    >
                      <X className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        UpdateComment(e);
                        handleCommentDeleted(editingCommentID);
                      }}
                      disabled={
                        commentSubmitLoading ||
                        !(commentText || commentFile) ||
                        (commentText === originalCommentText &&
                          !commentFile &&
                          commentSelectedImage === originalCommentImage)
                      }
                      className="flex items-center justify-center size-8 lg:size-9 rounded-full bg-blue-600 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white hover:bg-blue-500 transition-colors cursor-pointer shrink-0"
                    >
                      {commentSubmitLoading ? (
                        <Loader className="size-4 animate-spin" />
                      ) : (
                        <Pencil className="size-4" />
                      )}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={createComment}
                    disabled={
                      commentSubmitLoading || !(commentText || commentFile)
                    }
                    className="flex items-center justify-center size-8 lg:size-9 rounded-full bg-[#1DB854] disabled:bg-[#1DB854]/50 disabled:cursor-not-allowed text-white hover:bg-[#1DB854]/90 transition-colors cursor-pointer shrink-0"
                  >
                    {commentSubmitLoading ? (
                      <Loader className="size-4 animate-spin" />
                    ) : (
                      <Send className="size-4" />
                    )}
                  </button>
                )}
              </form>
            </div>

            <div className="bg-[#07110D]/80 border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 backdrop-blur-md space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <h3 className="text-xs sm:text-sm font-semibold text-white flex items-center gap-2">
                  <span>Comments</span>
                  <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] sm:text-xs text-[#1DB854] font-medium">
                    {comments.length}
                  </span>
                </h3>
              </div>

              <div className="space-y-3.5 sm:space-y-4">
                {comments.length === 0 ? (
                  <p className="text-center text-xs sm:text-sm text-gray-400">
                    No comments yet
                  </p>
                ) : (
                  comments.map((comment) => (
                    <Comments
                      key={comment._id || comment.id}
                      postID={id}
                      postOwnerID={post.user._id}
                      commentID={comment._id || comment.id}
                      commentCreator={comment.commentCreator}
                      commentContent={comment.content}
                      commentImage={comment.image}
                      commentDate={comment.createdAt}
                      repliesCount={comment.repliesCount}
                      likesCount={comment.likes?.length || 0}
                      isLiked={comment.likes?.includes(userInfo?.id)}
                      onDelete={handleCommentDeleted}
                      onUpdate={handleEditComment}
                    />
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
