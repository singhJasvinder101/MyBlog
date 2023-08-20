import React, { useEffect, useRef, useState } from 'react';
import { marked } from "marked";
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import "prismjs/themes/prism-tomorrow.css";

import { CloudinaryContext, Image } from 'cloudinary-react';
import { Spinner } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { Alert } from 'react-bootstrap';
import { useSelector } from 'react-redux';
const apiUrl = import.meta.env.VITE_API_URI;
import { convert } from 'html-to-text';
import axios from 'axios';

const TextEditor = () => {
    const [content, setContent] = useState('');
    const [uploadedImagePublicId, setUploadedImagePublicId] = useState(null);
    const [uploading, setUploading] = useState(false)
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState([])
    const [imageUrl, setImageUrl] = useState("https://res.cloudinary.com/practicaldev/image/fetch/s--gIvrKWQi--/c_imagga_scale,f_auto,fl_progressive,h_500,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/5rbe6wwa5mcc2q4me43s.png")

    const textAreaRef = useRef(null)

    const getMarkdownText = (text) => {
        var rawMarkup = marked.parse(text);
        return { __html: rawMarkup };
    }
    useEffect(() => {
        Prism.highlightAll()
    }, [content])

    const uploadImage = async (e) => {
        setUploading(true)
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'hndevrtd'); // Replace with your Cloudinary upload preset
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
        console.log(data);
    };

    const handleButtonClick = (format) => {
        switch (format) {
            case 'bold':
                setContent(prevContent => prevContent + '**Bold** ');
                break;
            case 'italic':
                setContent(prevContent => prevContent + '*Italic* ');
                break;
            case 'code':
                setContent(prevContent => prevContent + '\n```javascript\nconsole.log("Hello, World!");\n```');
                break;
            case 'orderedList':
                setContent(prevContent => prevContent + '\n1. text1\n2. text2\n3. text3 ');
                break;
            case 'unorderedList':
                setContent(prevContent => prevContent + '\n-  text1\n- text2\n- text3 ');
                break;
            case 'link':
                const linkURL = prompt('Enter the URL for the link:');
                if (linkURL) {
                    setContent(prevContent => prevContent + `[Link text](${linkURL}) `);
                }
                break;
            default:
                break;
        }
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
        const { data } = await axios.post(`${apiUrl}/api/blogs/createPost`, {
            title, description, body_html, tags, images, author
        }, {
            withCredentials: true,
        })
        return data
    }

    const body_html = content

    const handleSubmit = (e) => {
        e.preventDefault()
        e.stopPropagation();

        const options = {
            wordwrap: 130,
        };

        const form = e.currentTarget.elements;
        const title = form.title.value
        const markedDescription = marked(textAreaRef.current.value);
        const descriptionString = convert(markedDescription, options).slice(0, 30).replace(/\n/g, '');;

        const description = descriptionString

        const images = [{ path: imageUrl }]
        const author = user.name + user.lastname
        blogPostApiRequest(title, description, body_html, tags, images, author)
            .then(res => {
                console.log(res)
            })
            .catch(err => console.log(err))
        // console.log(title, description, body_html, tags, images, author)
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="post-container mt-4 container">
                    <h1 className='my-5 d-block'>Add Your Posts 🙌🏼</h1>
                    <input name='title' type="text" className='post-input' placeholder='Post title...' />
                    <input
                        className='tags-input d-block my-4 px-2 py-2'
                        placeholder='tags with commas,  then Enter'
                        onKeyPress={tagsHandler}
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                    />

                    <div className="post-tags">
                        {tags && tags.map((tag, i) => (
                            <span key={i} className='post-tag d-inline-block'># {tag}</span>
                        ))}
                    </div>

                    <div className="cover-image-input">
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
                    ) : (<Image className='d-block my-3 posted-img' height='20%' width="50%" crop="scale" src='https://res.cloudinary.com/practicaldev/image/fetch/s--gIvrKWQi--/c_imagga_scale,f_auto,fl_progressive,h_500,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/5rbe6wwa5mcc2q4me43s.png' />)}

                </div>
                <div className="text-editor container">
                    <div className="toolbar">
                        <button onClick={(e) => { handleButtonClick('bold'); e.preventDefault() }}>Bold</button>
                        <button onClick={(e) => { handleButtonClick('italic'); e.preventDefault() }}>Italic</button>
                        <button onClick={(e) => { handleButtonClick('code'); e.preventDefault() }}>Code</button>
                        <button onClick={(e) => { handleButtonClick('orderedList'); e.preventDefault() }}>Ordered List</button>
                        <button onClick={(e) => { handleButtonClick('unorderedList'); e.preventDefault() }}>Unordered List</button>
                        <button onClick={(e) => { handleButtonClick('link'); e.preventDefault() }}>Link</button>
                    </div>
                    <div className="editor my-2 d-flex flex-wrap">
                        <textarea
                            ref={textAreaRef}
                            className='text-container'
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Write description in detail..."
                        />
                        <div className="publish-post my-auto mx-2">
                            <button type='submit' style={{ height: '3rem' }} className='btn btn-primary'>Publish Article
                                🎉
                            </button>
                        </div>
                    </div>
                    <div className="preview container mt-3 mb-5">
                        <p>Preview:</p>
                        <div>
                            <div dangerouslySetInnerHTML={getMarkdownText(content)} />
                        </div>
                    </div>
                </div>
            </form>
        </div >
    );
};

export default TextEditor;
