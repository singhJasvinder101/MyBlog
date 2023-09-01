import React, { useEffect, useRef, useState } from 'react';
import { marked } from "marked";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import "prismjs/themes/prism-tomorrow.css";

import { CloudinaryContext, Image } from 'cloudinary-react';
import { Spinner } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { Alert } from 'react-bootstrap';
import { useSelector } from 'react-redux';
const apiUrl = import.meta.env.VITE_API_URI;
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';
import axios from 'axios';

const TextEditor = () => {
    const [uploadedImagePublicId, setUploadedImagePublicId] = useState(null);
    const [uploading, setUploading] = useState(false)
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState([])
    const [imageUrl, setImageUrl] = useState("https://res.cloudinary.com/practicaldev/image/fetch/s--gIvrKWQi--/c_imagga_scale,f_auto,fl_progressive,h_500,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/5rbe6wwa5mcc2q4me43s.png")
    const [loaderState, setLoaderState] = useState(false)
    const [articleStatePublished, setArticleStatePublished] = useState(false)
    const textAreaRef = useRef(null)
    const [content, setContent] = useState('')
    const body_html = content   
    

    const uploadImage = async (e) => {
        setUploading(true)
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'hndevrtd');
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/dfdmyewjs/image/upload`,
            {
                method: 'POST',
                body: formData,
            }
        );
        const data = await response.json();
        setUploading(false)
        setUploadedImagePublicId(data.public_id);
        setImageUrl(data.url)
        // console.log(data);
    };


    useEffect(() => {
        // console.log(tags);
    }, [tags]);

    const tagsHandler = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            setTags(tagInput.split(','))
            setTags(tagInput.split(',').map(tag => tag.trim()));
            setTagInput('');
        }
    }

    const user = useSelector(state => state.userLoggedIn.userInfo)
    // console.log(user)

    const blogPostApiRequest = async (title, description, body_html, tags, images, author) => {
        setLoaderState(true)
        const { data } = await axios.post(`${apiUrl}/api/blogs/createPost`, {
            title, description, body_html, tags, images, author
        }, {
            withCredentials: true,
        })
        setLoaderState(false)
        setArticleStatePublished(true)
        return data
    }


    const handleProcedureContentChange = (newContent) => {
        // console.log("content---->", newContent);

        const highlightedContent = newContent.replace(
            /<blockquote>([\s\S]*?)<\/blockquote>/g,
            (match, p1) => {
                const highlightedCode = Prism.highlight(
                    p1,
                    Prism.languages.javascript,
                    'javascript'
                );
                return `<pre><code class="language-javascript">${highlightedCode}</code></pre>`;
            }
        );
        setContent(highlightedContent);
    };


    var modules = {
        toolbar: [
            [{ size: ["small", false, "large", "huge"] }],
            ["bold", "italic", "underline", "strike", "blockquote"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
            [
                { list: "ordered" },
                { list: "bullet" },
                { indent: "-1" },
                { indent: "+1" },
                { align: [] }
            ],
            ["link"]
            [{ "color": ["#000000", "#e60000", "#ff9900", "#ffff00", "#008a00", "#0066cc", "#9933ff", "#ffffff", "#facccc", "#ffebcc", "#ffffcc", "#cce8cc", "#cce0f5", "#ebd6ff", "#bbbbbb", "#f06666", "#ffc266", "#ffff66", "#66b966", "#66a3e0", "#c285ff", "#888888", "#a10000", "#b26b00", "#b2b200", "#006100", "#0047b2", "#6b24b2", "#444444", "#5c0000", "#663d00", "#666600", "#003700", "#002966", "#3d1466", 'custom-color'] }],
        ],
    };

    var formats = [
        "header", "height", "bold", "italic",
        "underline", "strike", "blockquote",
        "list", "color", "bullet", "indent",
        "link", "image", "align", "size",
    ];

    useEffect(() => {
        Prism.highlightAll();
    }, [content]);


    const handleSubmit = (e) => {
        e.preventDefault()
        e.stopPropagation();

        const options = {
            wordwrap: 130,
        };

        const form = e.currentTarget.elements;
        const title = form.title.value
        const purifiedDescription = DOMPurify.sanitize(content, {
            ALLOWED_TAGS: [], 
        });
        const descriptionString = purifiedDescription.slice(0, 90).replace(/\n/g, '');;
        const description = descriptionString

        const images = [{ path: imageUrl }]
        const author = user.name + user.lastname
        blogPostApiRequest(title, description, body_html, tags, images, author)
            .then(res => {
                // console.log(res)
                window.location.href = "/"
            })
            .catch(err => console.log(err))
        // console.log(title, description, body_html, tags, images, author)
    }

    // console.log(tags)

    return (
        <div className='create-post-page'>
            <form onSubmit={handleSubmit}>
                <div className="post-container pt-4 container text-center">
                    <h1 className='my-5 d-block'>Add Your Posts 🙌🏼</h1>
                    <input name='title' type="text" className='post-title-input text-center' placeholder='Post title...' required />
                    <input
                        id='tags'
                        className='tags-input my-4 px-4 py-2'
                        placeholder='tags with commas,  then press Enter'
                        onKeyPress={tagsHandler}
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                    />

                    <div className="post-tags">
                        {tags && tags.map((tag, i) => (
                            <span key={i} className='post-tag d-inline-block'># {tag}</span>
                        ))}
                    </div>

                    <div className="cover-image-input text-left">
                        <label title='add photo of 100:42 ratio' className="input-text" htmlFor="inputGroupFile01">Select you cover image {uploading ? <Spinner /> : null}</label>
                        <input type="file" id='inputGroupFile01'
                            className='form'
                            style={{ visibility: 'hidden' }}
                            onChange={uploadImage} />
                    </div>
                    {uploadedImagePublicId ? (
                        <CloudinaryContext cloudName="dfdmyewjs" className='my-3'>
                            <Image className='cloudinary-image' publicId={uploadedImagePublicId} height='200' width="400" crop="scale" />
                        </CloudinaryContext>
                    ) : (<Image className='d-block my-3 posted-img' height='20%' width="100%" crop="scale" src='https://res.cloudinary.com/practicaldev/image/fetch/s--gIvrKWQi--/c_imagga_scale,f_auto,fl_progressive,h_500,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/5rbe6wwa5mcc2q4me43s.png' />)}

                </div>
                <div className="text-editor container">
                    <ReactQuill
                        className='code-content'
                        theme="snow"
                        modules={modules}
                        formats={formats}
                        placeholder="write your content ...."
                        onChange={handleProcedureContentChange}
                        style={{ height: "220px" }}
                    />
                    <div className="publish-post mt-5">
                        <button type='submit' style={{ height: '3rem', marginTop: '4rem' }} className='btn btn-primary'>
                            {articleStatePublished ? 'Published \uD83C\uDF89' : 'Publish Article'}
                            {loaderState ? (
                                <Spinner
                                    className='mx-2'
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true" />
                            ) : ""}
                        </button>
                    </div>
                    <div className="preview my-4">
                        <p>Preview:</p>
                        {/* <blockquote className='text-dark'>{content}</blockquote> */}
                        <div
                            className='language-javascript'
                            dangerouslySetInnerHTML={{ __html: content }}
                        />
                    </div>
                </div>
            </form>
        </div >
    );
};

export default TextEditor;
