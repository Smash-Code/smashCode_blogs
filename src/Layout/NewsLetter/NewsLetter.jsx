import { useState } from 'react'
import { db } from 'config/firebase'
import { useNotifyContext } from 'context/notifyContext';

const NewsLetter = () => {
    const { set_notify } = useNotifyContext();
    const [formData, setFormData] = useState({ email: "" });
    const [error, setError] = useState({ error: true, msg: "" });
    let emRgx = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    // onchange input
    const handleChange = (e) => {
        let { value } = e.target;
        setFormData({
            email: value
        });
        if (value.trim().length > 0) {
            if (emRgx.test(value)) {
                setError({ error: false, msg: "" });
            } else {
                setError({ error: true, msg: "Invalid email address" });
            }
        }
        else {
            setError({ error: false, msg: "" });
        }
    };

    // subscribe
    const subscribe = (e) => {
        e.preventDefault();
        if (!error.error && emRgx.test(formData.email)) {
            let key = db.ref('subscribe').push().key;
            db.ref('subscribers').child(key).set({
                id: key,
                email: formData.email,
            }).then(() => {
                setFormData({ email: "" });
                set_notify({ open: true, type: "success", msg: "Subscribed Successfully." })
            }).catch((err) => {
                console.log(err)
                set_notify({ open: true, type: "error", msg: "Something error occurred." })
            })
        } else {
            set_notify({ open: true, type: "error", msg: "Invalid email address." })
        }
    };

    return (
        <div className="news-letter-main position-relative">
            <div className="shape shape-top-right"></div>
            <div className="shape shape-bottom-left"></div>
            <div className="shape shape-bottom-center"></div>
            <div className="container">
                <div className="row justify-content-center align-items-center">
                    <div className="news-letter-wrapper">
                        <h4>Subscribe <span className="secondary-head-news">to our NewsLetter</span></h4>
                        
                        <form action="" onSubmit={subscribe}>
                            <input
                                name="email"
                                type="text"
                                placeholder="Your email address"
                                value={formData.email}
                                onChange={handleChange}
                            />
                            <button type="submit" className="subscribe-btn">
                                Subscribe
                            </button>
                        </form>
                        {error.error &&
                            <span className="error-msg">{error.msg}</span>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NewsLetter
