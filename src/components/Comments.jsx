import React, { useContext, useEffect, useRef, useState } from "react";
import { MessageSquare, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import Swal from "sweetalert2";
import axios from "axios";
import { toast } from "sonner";
import { userContext } from "../context/UserContext";
import timeAgo from "../utils/TimeAgo";
import Replies from "./Replies";
import { Link } from "react-router";

export default function Comments({
  postID,
  postOwnerID,
  commentID,
  commentCreator,
  commentContent,
  commentImage,
  commentDate,
  repliesCount,
  likesCount,
  isLiked,
  onDelete,
  onUpdate,
}) {
  const { userInfo, token } = useContext(userContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const [isLike, setIsLike] = useState(isLiked || false);
  const [likesCounter, setLikesCounter] = useState(likesCount || 0);
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replyFile, setReplyFile] = useState(null);
  const [replySelectedImage, setReplySelectedImage] = useState(null);
  const [replySubmitLoading, setReplySubmitLoading] = useState(false);
  const [replies, setReplies] = useState([]);
  const [repliesLoading, setRepliesLoading] = useState(false);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function deleteComment() {
    const options = {
      method: "DELETE",
      url: `https://route-posts.routemisr.com/posts/${postID}/comments/${commentID}`,
      headers: { Authorization: `Bearer ${token}` },
    };

    try {
      await axios.request(options);
      onDelete(commentID);
      toast.success("Comment deleted");
    } catch (error) {
      toast.error("Failed to delete comment");
    }
  }

  async function likeComment() {
    const options = {
      method: "PUT",
      url: `https://route-posts.routemisr.com/posts/${postID}/comments/${commentID}/like`,
      headers: { Authorization: `Bearer ${token}` },
    };

    try {
      const { data } = await axios.request(options);
      setIsLike(data.data.liked);
      setLikesCounter(data.data.likesCount);
    } catch (error) {
      toast.error("Failed to like comment");
    }
  }

  function handleReplyPhotoChange(event) {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;
    if (!selectedFile.type.startsWith("image/")) {
      toast.error("Please select a valid image");
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }
    setReplyFile(selectedFile);
    setReplySelectedImage(URL.createObjectURL(selectedFile));
  }

  function handleRemoveReplyImage() {
    setReplySelectedImage(null);
    setReplyFile(null);
  }

  async function getReplies() {
    setRepliesLoading(true);
    try {
      const { data } = await axios.request({
        method: "GET",
        url: `https://route-posts.routemisr.com/posts/${postID}/comments/${commentID}/replies`,
        headers: { Authorization: `Bearer ${token}` },
      });
      setReplies(data.data.replies);
    } catch (error) {
      toast.error("Failed to load replies");
    } finally {
      setRepliesLoading(false);
    }
  }

  function handleOpenReply() {
    if (isReplyOpen) {
      setIsReplyOpen(false);
      return;
    }
    setIsReplyOpen(true);
    setReplyText(`@${commentCreator.username} `);
    getReplies();
  }

  async function createReply(event) {
    event.preventDefault();
    if (!replyText && !replyFile) return;

    const formData = new FormData();
    if (replyText) formData.append("content", replyText);
    if (replyFile) formData.append("image", replyFile);

    setReplySubmitLoading(true);
    try {
      const { data } = await axios.request({
        method: "POST",
        url: `https://route-posts.routemisr.com/posts/${postID}/comments/${commentID}/replies`,
        data: formData,
        headers: { Authorization: `Bearer ${token}` },
      });
      setReplies((previous) => [data.data.reply, ...previous]);
      setReplyText("");
      handleRemoveReplyImage();
      toast.success("Reply added");
    } catch (error) {
      toast.error("Failed to add reply");
    } finally {
      setReplySubmitLoading(false);
    }
  }

  return (
    <div className="flex items-start gap-2.5 sm:gap-3 border-b border-white/5 last:border-0 pb-3 sm:pb-4 last:pb-0">
      <Link
        to={`${userInfo.id === commentCreator._id ? `/profile` : `/user/${commentCreator._id}`}`}
        className="shrink-0 mt-0.5"
      >
        <img
          src={commentCreator.photo}
          alt={commentCreator.name}
          className="size-7 sm:size-8 rounded-full object-cover border border-white/10"
        />
      </Link>
      <div className="flex-1 space-y-2 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="bg-white/[0.04] border border-white/5 rounded-2xl px-3 sm:px-3.5 py-1.5 sm:py-2 text-[11px] sm:text-[13px] leading-relaxed w-fit max-w-[85%] sm:max-w-[90%] wrap-break-word">
            <Link
              to={`${userInfo.id === commentCreator._id ? `/profile` : `/user/${commentCreator._id}`}`}
              className="font-semibold text-white block hover:text-[#1DB854] cursor-pointer transition-colors truncate"
            >
              {commentCreator.name}
            </Link>
            <p className="text-gray-300 mt-0.5 wrap-break-word">
              {commentContent}
            </p>
          </div>

          {userInfo?.id === commentCreator?._id ||
          userInfo?.id === postOwnerID ? (
            <div className="relative shrink-0" ref={menuRef}>
              <button
                type="button"
                onClick={() => setIsMenuOpen((previous) => !previous)}
                className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                <MoreHorizontal className="size-3.5 sm:size-4" />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-1 w-32 bg-[#0B1A14] border border-white/10 rounded-xl shadow-xl py-1 z-20 backdrop-blur-xl">
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      Swal.fire({
                        title:
                          "<span class='text-lg font-bold text-white'>Delete?</span>",
                        text: "Are you sure you want to delete this comment?",
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
                          deleteComment();
                        }
                      });
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer"
                  >
                    <Trash2 className="size-3" />
                    <span>Delete</span>
                  </button>
                  <button
                    onClick={() => {
                      onUpdate(commentID, commentImage, commentContent);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-text-[#1DB854] hover:text-[#1DB854] hover:bg-[#1DB854]/10 transition-colors cursor-pointer"
                  >
                    <Pencil className="size-3 text-[#1DB854]" />

                    <span>Update </span>
                  </button>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {commentImage && (
          <div className="rounded-xl border border-white/10 overflow-hidden max-h-[220px] w-fit">
            <img
              src={commentImage}
              alt="Comment attachment"
              className="max-h-[220px] object-cover"
            />
          </div>
        )}

        <div className="flex items-center gap-2.5 sm:gap-3 px-1.5 text-[9px] sm:text-[11px] text-[#8A8F8D]">
          <span className="truncate">@{commentCreator.username}</span>
          <span>•</span>
          <span className="shrink-0">{timeAgo(commentDate)}</span>
          <button
            type="button"
            onClick={likeComment}
            className="flex items-center gap-1 hover:text-[#1DB854] cursor-pointer transition-colors shrink-0"
          >
            {isLike ? (
              <FontAwesomeIcon
                className="text-sm sm:text-base text-[#1DB854]"
                icon={faHeartSolid}
              />
            ) : (
              <FontAwesomeIcon
                className="text-sm sm:text-base"
                icon={faHeartRegular}
              />
            )}
            <span>{likesCounter}</span>
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={handleOpenReply}
            className="flex items-center gap-1 hover:text-[#1DB854] font-medium cursor-pointer transition-colors shrink-0"
          >
            <MessageSquare className="size-2.5 sm:size-3" />
            <span>Reply ({repliesCount || 0})</span>
          </button>
        </div>

        {isReplyOpen && (
          <Replies
            username={commentCreator.username}
            replyText={replyText}
            setReplyText={setReplyText}
            replySelectedImage={replySelectedImage}
            onReplyPhotoChange={handleReplyPhotoChange}
            onRemoveReplyImage={handleRemoveReplyImage}
            replySubmitLoading={replySubmitLoading}
            onCreateReply={createReply}
            isRepliesLoading={repliesLoading}
            commentReplies={replies}
          />
        )}
      </div>
    </div>
  );
}
