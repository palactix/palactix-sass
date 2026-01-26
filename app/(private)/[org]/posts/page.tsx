import { Suspense } from "react";
import { PostsListingPage } from "@/components/posts/listing/PostsListingPage";

function PostsPage() {
  return <div className="container py-6 h-[calc(100vh-4rem)]">
    <Suspense fallback={<div>Loading posts...</div>}>
        <PostsListingPage />
    </Suspense>
  </div>;
}
export default PostsPage;