"use client";
import { Post } from "@/features/posts/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Heart, MessageCircle, Repeat, Send, Bookmark, MoreHorizontal, Globe, ThumbsUp, MessageSquare, Share2 } from "lucide-react";

interface PostPreviewCardProps {
  post: Post;
  className?: string;
}

export const PostPreviewCard = ({ post, className }: PostPreviewCardProps) => {
  const platform = (post.channel.slug || post.channel.name).toLowerCase();
  
  // Platform specific renders
  if (platform.includes("instagram")) return <InstagramPreview post={post} />;
  if (platform.includes("twitter") || platform.includes("x")) return <XPreview post={post} />;
  if (platform.includes("facebook")) return <FacebookPreview post={post} />;
  
  // Default fallback
  return <DefaultPreview post={post} />;
};

const MediaDisplay = ({ post }: { post: Post }) => {
  const media = post.media && post.media.length > 0 ? post.media[0] : null;

  if (!media) return null;

  if (media.type === "video") {
    return (
      <div className="relative aspect-square w-full bg-black flex items-center justify-center">
        {/* Placeholder for video */}
        <span className="text-white text-xs">Video Preview</span>
        {media.thumbnail_url && (
            <img src={media.thumbnail_url} alt="thumbnail" className="absolute inset-0 w-full h-full object-cover" />
        )}
      </div>
    );
  }

  return (
    <div className="aspect-square w-full overflow-hidden">
      <img src={media.url} alt="Post media" className="w-full h-full object-cover" />
    </div>
  );
};

const InstagramPreview = ({ post }: { post: Post }) => {
  return (
    <div className="w-[300px] bg-white border rounded-lg shadow-sm font-sans flex flex-col text-sm text-black">
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={post.user.avatar} />
            <AvatarFallback>{post.user.name[0]}</AvatarFallback>
          </Avatar>
          <span className="font-semibold text-xs">{post.user.name}</span>
        </div>
        <MoreHorizontal className="h-4 w-4 text-gray-500" />
      </div>

      {/* Media */}
      <MediaDisplay post={post} />

      {/* Actions */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Heart className="h-6 w-6" />
            <MessageCircle className="h-6 w-6" />
            <Send className="h-6 w-6" />
          </div>
          <Bookmark className="h-6 w-6" />
        </div>
        <div className="font-semibold text-xs mb-1">1,234 likes</div>
        <div className="text-xs">
          <span className="font-semibold mr-1">{post.user.name}</span>
          {post.caption}
        </div>
      </div>
    </div>
  );
};

const XPreview = ({ post }: { post: Post }) => {
  return (
    <div className="w-[300px] bg-black text-white p-3 rounded-lg font-sans border border-gray-800">
      <div className="flex gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={post.user.avatar} />
          <AvatarFallback>{post.user.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 text-sm">
            <span className="font-bold truncate">{post.user.name}</span>
            <span className="text-gray-500 truncate">@{post.user.name.toLowerCase().replace(/\s/g, '')}</span>
            <span className="text-gray-500">· 2h</span>
          </div>
          <div className="text-sm mt-1 whitespace-pre-wrap">{post.caption}</div>
          
          {post.media && post.media.length > 0 && (
            <div className="mt-3 rounded-xl overflow-hidden border border-gray-800">
               <MediaDisplay post={post} />
            </div>
          )}

          <div className="flex justify-between mt-3 text-gray-500">
            <MessageCircle className="h-4 w-4" />
            <Repeat className="h-4 w-4" />
            <Heart className="h-4 w-4" />
            <Share2 className="h-4 w-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

const FacebookPreview = ({ post }: { post: Post }) => {
  return (
    <div className="w-[300px] bg-white rounded-lg shadow-sm font-sans text-black border">
      <div className="p-3 pb-2">
        <div className="flex gap-2">
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.user.avatar} />
            <AvatarFallback>{post.user.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold text-sm">{post.user.name}</div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <span>2h</span>
              <span>·</span>
              <Globe className="h-3 w-3" />
            </div>
          </div>
        </div>
        <div className="mt-2 text-sm">{post.caption}</div>
      </div>

      {post.media && post.media.length > 0 && (
          <MediaDisplay post={post} />
      )}

      <div className="px-3 py-2 border-t mt-2">
         <div className="flex items-center justify-between text-gray-500 text-sm">
            <div className="flex items-center gap-2">
                <ThumbsUp className="h-4 w-4" /> Like
            </div>
            <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" /> Comment
            </div>
            <div className="flex items-center gap-2">
                <Share2 className="h-4 w-4" /> Share
            </div>
         </div>
      </div>
    </div>
  );
};

const DefaultPreview = ({ post }: { post: Post }) => {
    return (
        <div className="w-[300px] bg-white p-4 rounded-md shadow border">
            <div className="font-bold mb-2">{post.channel.name}</div>
            <div className="text-sm mb-2">{post.caption}</div>
             {post.media && post.media.length > 0 && (
                 <div className="mt-2 rounded overflow-hidden">
                     <MediaDisplay post={post} />
                 </div>
             )}
        </div>
    )
}
