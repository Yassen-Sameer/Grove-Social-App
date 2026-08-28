import React, { useContext } from "react";
import { Link } from "react-router";
import { X, Image, Loader, Send } from "lucide-react";
import timeAgo from "../utils/TimeAgo";
import { userContext } from "../context/UserContext";

export default function Replies({
  username,
  replyText,
  setReplyText,
  replySelectedImage,
  onReplyPhotoChange,
  onRemoveReplyImage,
  replySubmitLoading,
  onCreateReply,
  isRepliesLoading,
  commentReplies,
}) {
  const { userInfo } = useContext(userContext);
  return (
    <div className="space-y-3 pt-1">
      {replySelectedImage && (
        <div className="relative rounded-2xl border border-white/10 overflow-hidden max-h-[220px] w-fit">
          <img
            src={replySelectedImage}
            alt="Reply preview"
            className="max-h-[220px] object-cover rounded-2xl"
          />
          <button
            type="button"
            onClick={onRemoveReplyImage}
            className="absolute top-2 right-2 size-7 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 flex items-center justify-center text-white transition-all cursor-pointer"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}

      <form
        onSubmit={onCreateReply}
        className="flex items-center gap-2 text-gray-400 text-xs"
      >
        <input
          type="text"
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder={`Reply to @${username}...`}
          className="flex-1 min-w-[50px] bg-white/[0.04] border border-white/10 rounded-full px-3.5 py-1.5 text-xs text-gray-200 placeholder:text-[#8A8F8D] outline-none focus:border-[#1DB854]/50 transition-colors"
        />

        <label className="flex items-center justify-center size-7 rounded-full bg-white/[0.04] hover:bg-white/10 border border-white/10 text-[#1DB854] transition-all cursor-pointer shrink-0">
          <Image className="size-3.5" />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onReplyPhotoChange}
          />
        </label>

        <button
          type="submit"
          disabled={replySubmitLoading || !(replyText || replySelectedImage)}
          className="flex items-center justify-center size-7 rounded-full bg-[#1DB854] disabled:bg-[#1DB854]/50 disabled:cursor-not-allowed text-white hover:bg-[#1DB854]/90 transition-colors cursor-pointer shrink-0"
        >
          {replySubmitLoading ? (
            <Loader className="size-3 animate-spin" />
          ) : (
            <Send className="size-3" />
          )}
        </button>
      </form>

      <div className="pl-4 sm:pl-6 border-l border-white/10 space-y-2.5">
        {isRepliesLoading ? (
          <p className="text-[10px] sm:text-xs text-gray-400">
            Loading replies...
          </p>
        ) : commentReplies.length === 0 ? (
          <p className="text-[10px] sm:text-xs text-gray-400">No replies yet</p>
        ) : (
          commentReplies.map((reply) => (
            <div
              key={reply._id || reply.id}
              className="flex items-start gap-2 pt-1"
            >
              <Link
                to={`${userInfo.id === reply.commentCreator?._id ? `/profile` : `/user/${reply.commentCreator?._id}`}`}
                className="shrink-0 mt-0.5"
              >
                <img
                  src={reply.commentCreator?.photo}
                  alt={reply.commentCreator?.name}
                  className="size-6 rounded-full object-cover border border-white/10"
                />
              </Link>

              <div className="flex-1 min-w-0">
                <div className="bg-white/[0.03] border border-white/5 rounded-xl px-3 py-1.5 text-[10px] sm:text-[12px] leading-relaxed w-fit max-w-[90%] wrap-break-word">
                  <Link
                    to={`${userInfo.id === reply.commentCreator?._id ? `/profile` : `/user/${reply.commentCreator?._id}`}`}
                    className="font-semibold text-white block hover:text-[#1DB854] cursor-pointer transition-colors truncate"
                  >
                    {reply.commentCreator?.name}
                  </Link>

                  <p className="text-gray-300 mt-0.5 wrap-break-word">
                    {reply.content}
                  </p>

                  {(reply.image || reply.photo) && (
                    <div className="mt-2 overflow-hidden rounded-lg max-w-[200px]">
                      <img
                        src={reply.image || reply.photo}
                        alt="Reply attachment"
                        className="w-full h-auto object-cover max-h-[150px] rounded-lg border border-white/10"
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2.5 sm:gap-3 px-1.5 text-[9px] sm:text-[11px] text-[#8A8F8D]">
                  <span className="truncate">
                    @{reply.commentCreator?.username}
                  </span>
                  <span>•</span>
                  <span className="shrink-0">{timeAgo(reply.createdAt)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
