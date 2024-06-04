import React from "react";
import Link from 'react-router-dom';
const App = ({ post }) => {

  // Custom styles for tags
  const tagColors = ["#FF5733", "#33FF57", "#5733FF"]; // Example colors for tags
  const getRandomColor = () =>
    tagColors[Math.floor(Math.random() * tagColors.length)];
  const tagStyle = {
    display: "inline-block",
    backgroundColor: getRandomColor(),
    color: "#333",
    borderRadius: "20px",
    padding: "5px 10px",
    margin: "0 5px 5px 0", // Adjusted margin for spacing
    fontSize: "0.85rem",
    whiteSpace: "nowrap", // Prevent tags from wrapping onto a new line
  };

  return (
    <div className="blog-list-2" style={{ width: "100%" ,border:'1px solid blue',borderRadius:'10px'}}>
      <div className="mx-3 mt-4 p-3">
        <div style={{ color: "#0066FF" }} className="pb-2 card-subheading">
          <Link to="/">My Article</Link>
        </div>
        <div className="card-title text-left">
          <h5>
            <Link className="text-light" to={`/post-details`}>
              {post?.title || "Blog website"}
            </Link>
          </h5>
        </div>
        <div className="card-description" style={{ fontSize: "0.95rem" }}>
          {post?.description || "Description for the blog post."}
        </div>
        <div className="card-tags mt-3">
          {post?.tags && post.tags.length > 0 ? (
            post.tags.map((tag, index) => (
              <span
                key={index}
                className="tag-badge"
                style={{ ...tagStyle, backgroundColor: getRandomColor() }}
              >
                {tag}
              </span>
            ))
          ) : (
            <span className="tag-badge" style={tagStyle}>
              Default Tag
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// Static data for demonstration
const post = {
  title: "Understanding the Basics of React",
  description: "An introductory guide to the fundamental concepts of React.js, including components, state, and props.",
  images: [{ path: "react_basics.jpg" }, { path: "react_components.jpg" }],
  body_html: "<p>React is a JavaScript library for building user interfaces. It is maintained by Facebook and a community of individual developers and companies. React can be used as a base in the development of single-page or mobile applications. However, React is only concerned with rendering data to the DOM, and so creating React applications usually requires the use of additional libraries for state management and routing.</p>",
  postLikes: 25,
  likedBy: [],
  tags: ["React", "JavaScript", "Web Development", "Frontend"],
  reviewsNumber: 5,
  reviews: [],
  author: "Jane Doe",
};

export default function BlogPostCard() {
  return <App post={post} />;
}
