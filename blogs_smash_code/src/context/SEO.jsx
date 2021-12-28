import React from 'react'
import PropTypes from 'prop-types'
// import { Helmet } from 'react-helmet'
import MetaTags from 'react-meta-tags';

function SEO({ description, lang,  title, pageUrl, image, children }) {
    return (
        <MetaTags
            // defer={false}
            // htmlAttributes={{
            //     lang,
            // }}
            // defaultTitle={title || 'Smash-Code'}
            // titleTemplate={`%s`}
        >
            {/* General tags */}
            <title>{title || 'Smash-Code'}</title>
            <meta name="image" content={image} />
            <meta name="description" content={description} />

            {/* OpenGraph tags */}
            <meta property="og:title" content={title} />
            <meta property="og:type" content={ `article`} />
            <meta property="og:url" content={pageUrl} />
            <meta property="og:image" content={image} />
            <meta property="og:description" content={description} />

            {/* Twitter Card tags */}
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:creator" content="Ismail Muhammad" />
            <meta name="twitter:title" content={pageUrl} />
            <meta name="twitter:image" content={image} />
            <meta name="twitter:description" content={description} />
        </MetaTags>
    )
}

SEO.defaultProps = {
    lang: `en`,
    description: ``,
}

SEO.propTypes = {
    description: PropTypes.string,
    lang: PropTypes.string,
    title: PropTypes.string,
}

export default SEO